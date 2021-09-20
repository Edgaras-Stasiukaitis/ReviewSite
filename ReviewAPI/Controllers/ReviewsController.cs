using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ReviewAPI.Models;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ReviewAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly UserManager<User> _userManager;

        public ReviewsController(DatabaseContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Reviews
        [HttpGet]
        public async Task<object> GetReviews() => await _context.Reviews.ToListAsync();

        // GET: api/Reviews/1
        [HttpGet("{id}")]
        public async Task<object> GetReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound($"Could not retrieve review. Review by id {id} not found.");
            return new { review.Id, review.Description, review.Rating};
        }

        // POST: api/Reviews/Item/1
        [HttpPost, Route("Item/{itemId}"), Authorize]
        public async Task<IActionResult> AddReview(JsonElement data, int itemId)
        {
            var model = JsonConvert.DeserializeObject<Item>(data.GetRawText());
            var item = await _context.Items.FindAsync(itemId);
            if(item == null) return NotFound($"Could not retrieve item. Item by id {itemId} not found.");
            var review = new Review
            {
                Description = model.Description,
                Rating = (int)model.Rating,
                User = await GetCurrentUser(),
                Item = item
            };
            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();
            return Ok(review);
        }

        // PUT: api/Reviews/1
        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> UpdateReview(int id, JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Item>(data.GetRawText());
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound($"Could not update review. Review by id {id} not found.");
            review.Description = model.Description;
            review.Rating = (int)model.Rating;
            _context.Reviews.Update(review);
            await _context.SaveChangesAsync();
            return Ok(new { review.Id, review.Description, review.Rating});
        }

        // DELETE: api/Reviews/1
        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound($"Could not delete review. Review by id {id} not found.");
            var reactions = await _context.Reactions.Where(x => x.Review.Id == id).ToListAsync();
            if (reactions.Count != 0) _context.Reactions.RemoveRange(reactions);
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return Ok(new { review, reactions });
        }

        private async Task<User> GetCurrentUser() => await _userManager.FindByIdAsync(User.Claims.First(c => c.Type == "UserID").Value);
    }
}
