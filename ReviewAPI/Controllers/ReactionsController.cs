using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ReviewAPI.ModelDtos;
using ReviewAPI.Models;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ReviewAPI.Controllers
{
    [ApiController]
    [Route("api/Categories/{categoryId}/Items/{itemId}/Reviews/{reviewId}/[controller]")]
    public class ReactionsController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public ReactionsController(DatabaseContext context, UserManager<User> userManager, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        // GET: api/Categories/1/Items/1/Reviews/1/Reactions
        [HttpGet]
        public async Task<object> GetReactions(int categoryId, int itemId, int reviewId) => await _context.Reactions
            .Where(x => x.Review.Item.Category.Id == categoryId && x.Review.Item.Id == itemId && x.Review.Id == reviewId)
            .ToListAsync();

        // GET: api/Categories/1/Items/1/Reviews/1/Reactions/1
        [HttpGet("{reactionId}")]
        public async Task<object> GetReaction(int categoryId, int itemId, int reviewId, int reactionId)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return NotFound(new { message = $"Could not retrieve reaction. Category by id {categoryId} not found." });
            var item = category.Items.FirstOrDefault(x => x.Id == itemId);
            if (item == null) return NotFound(new { message = $"Could not retrieve reaction. Item by id {itemId} not found." });
            var review = item.Reviews.FirstOrDefault(x => x.Id == reviewId);
            if (review == null) return NotFound(new { message = $"Could not retrieve reaction. Review by id {reviewId} not found." });
            var reaction = review.Reactions.FirstOrDefault(x => x.Id == reactionId);
            if (reaction == null) return NotFound(new { message = $"Could not retrieve reaction. Reaction by id {reactionId} not found." });
            return Ok(_mapper.Map<ReactionDto>(reaction));
        }

        // POST: api/Categories/1/Items/1/Reviews/1/Reactions
        [HttpPost]
        public async Task<IActionResult> AddReaction(int categoryId, int itemId, int reviewId, JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Reaction>(data.GetRawText());
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return NotFound(new { message = $"Could not add reaction. Category by id {categoryId} not found." });
            var item = category.Items.FirstOrDefault(x => x.Id == itemId);
            if (item == null) return NotFound(new { message = $"Could not add reaction. Item by id {itemId} not found." });
            var review = item.Reviews.FirstOrDefault(x => x.Id == reviewId);
            if (review == null) return NotFound(new { message = $"Could not add reaction. Review by id {reviewId} not found." });
            if (model.ReactionState == 0) return BadRequest(new { message = "Reaction state is required." });
            var reaction = new Reaction
            {
                ReactionState = model.ReactionState,
                User = _userManager.Users.FirstOrDefault(), // temporary
                Review = review
            };
            await _context.Reactions.AddAsync(reaction);
            await _context.SaveChangesAsync();
            return Created($"api/Categories/{categoryId}/Items/{itemId}/Reviews/{reviewId}/[controller]/{reaction.Id}", _mapper.Map<ReactionDto>(reaction));
        }

        // PUT: api/Categories/1/Items/1/Reviews/1/Reactions/1
        [HttpPut("{reactionId}")]
        public async Task<IActionResult> UpdateReaction(int categoryId, int itemId, int reviewId, int reactionId, JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Reaction>(data.GetRawText());
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return NotFound(new { message = $"Could not update reaction. Category by id {categoryId} not found." });
            var item = category.Items.FirstOrDefault(x => x.Id == itemId);
            if (item == null) return NotFound(new { message = $"Could not update reaction. Item by id {itemId} not found." });
            var review = item.Reviews.FirstOrDefault(x => x.Id == reviewId);
            if (review == null) return NotFound(new { message = $"Could not update reaction. Review by id {reviewId} not found." });
            var reaction = review.Reactions.FirstOrDefault(x => x.Id == reactionId);
            if (reaction == null) return NotFound(new { message = $"Could not update reaction. Reaction by id {reactionId} not found." });
            reaction.ReactionState = model.ReactionState;
            _context.Reactions.Update(reaction);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<ReactionDto>(reaction));
        }

        // DELETE: api/Categories/1/Items/1/Reviews/1/Reactions/1
        [HttpDelete("{reactionId}")]
        public async Task<IActionResult> DeleteReaction(int categoryId, int itemId, int reviewId, int reactionId)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return NotFound(new { message = $"Could not delete reaction. Category by id {categoryId} not found." });
            var item = category.Items.FirstOrDefault(x => x.Id == itemId);
            if (item == null) return NotFound(new { message = $"Could not delete reaction. Item by id {itemId} not found." });
            var review = item.Reviews.FirstOrDefault(x => x.Id == reviewId);
            if (review == null) return NotFound(new { message = $"Could not delete reaction. Review by id {reviewId} not found." });
            var reaction = review.Reactions.FirstOrDefault(x => x.Id == reactionId);
            if (reaction == null) return NotFound(new { message = $"Could not delete reaction. Reaction by id {reactionId} not found." });
            _context.Reactions.Remove(reaction);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<ReactionDto>(reaction));
        }

        private async Task<User> GetCurrentUser() => await _userManager.FindByIdAsync(User.Claims.First(c => c.Type == "UserID").Value);
    }
}
