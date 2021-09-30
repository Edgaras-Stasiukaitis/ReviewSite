using AutoMapper;
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
    [Route("api/Categories/{categoryId}/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public ItemsController(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Categories/1/Items
        [HttpGet]
        public async Task<object> GetItems(int categoryId) => await _context.Items.Where(o => o.Category.Id == categoryId).Select(item => _mapper.Map<ItemDto>(item)).ToListAsync();

        // GET: api/Categories/1/Items/1
        [HttpGet("{itemId}")]
        public async Task<IActionResult> GetItem(int categoryId, int itemId)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return NotFound(new { message = $"Could not retrieve item. Category by id {categoryId} not found." });
            var item = category.Items.FirstOrDefault(x => x.Id == itemId);
            if (item == null) return NotFound(new { message = $"Could not retrieve item. Item by id {itemId} not found." });
            return Ok(_mapper.Map<ItemDto>(item));
        }

        // POST: api/Categories/1/Items
        [HttpPost]
        public async Task<IActionResult> AddItem(int categoryId, JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Item>(data.GetRawText());
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return NotFound(new { message = $"Could not add item. Category by id {categoryId} not found." });
            if (model.Name == null) return BadRequest(new { message = "Item name is required." });
            var item = new Item
            {
                Name = model.Name,
                Rating = model.Rating,
                Description = model.Description,
                ImageURL = model.ImageURL,
                Category = category
            };
            await _context.Items.AddAsync(item);
            await _context.SaveChangesAsync();
            return Created($"api/Categories/{categoryId}/[controller]/{item.Id}", _mapper.Map<ItemDto>(item));
        }

        // PUT: api/Categories/1/Items/1
        [HttpPut("{itemId}")]
        public async Task<IActionResult> UpdateItem(int categoryId, int itemId, JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Item>(data.GetRawText());
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return NotFound(new { message = $"Could not update item. Category by id {categoryId} not found." });
            var item = category.Items.FirstOrDefault(x => x.Id == itemId);
            if (item == null) return NotFound(new { message = $"Could not update item. Item by id {itemId} not found." });
            if (model.Name == null) return BadRequest(new { message = "Item name is required." });
            item.Name = model.Name;
            item.Rating = model.Rating;
            item.Description = model.Description;
            item.ImageURL = model.ImageURL;
            _context.Items.Update(item);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<ItemDto>(item));
        }

        // DELETE: api/Categories/1/Items/1
        [HttpDelete("{itemId}")]
        public async Task<IActionResult> DeleteItem(int categoryId, int itemId)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return NotFound(new { message = $"Could not delete item. Category by id {categoryId} not found." });
            var item = category.Items.FirstOrDefault(x => x.Id == itemId);
            if (item == null) return NotFound(new { message = $"Could not delete item. Item by id {itemId} not found." });
            var reactions = await _context.Reactions.Where(x => x.Review.Item.Id == itemId).ToListAsync();
            if (reactions.Count != 0) _context.Reactions.RemoveRange(reactions);
            var reviews = await _context.Reviews.Where(x => x.Item.Id == itemId).ToListAsync();
            if (reviews.Count != 0) _context.Reviews.RemoveRange(reviews);
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<ItemDto>(item));
        }
    }
}
