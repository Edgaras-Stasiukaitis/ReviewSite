using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ReviewAPI.Models;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ReviewAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ItemsController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet, Route("Category/{categoryId}")]
        public async Task<object> GetItems(int categoryId)
        {
            return await _context.Items.Where(x => x.Category.Id == categoryId).Select(x => new { x.Id, x.Name, x.Description, x.Rating, x.ImageURL}).ToListAsync();
        } 

        [HttpGet("{itemId}")]
        public async Task<object> GetItem(int itemId)
        {
            var item = await _context.Items.FindAsync(itemId);
            if (item == null) return BadRequest($"Could not retrieve item. Item by id {itemId} not found.");
            return item;
        }

        [HttpPost, Route("Category/{categoryId}")]
        public async Task<IActionResult> AddItem(int categoryId, JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Item>(data.GetRawText());
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return BadRequest($"Could not add item. Category by id {categoryId} not found.");
            var item = new Item
            {
                Name = model.Name,
                Description = model.Description,
                Rating = model.Rating,
                ImageURL = model.ImageURL,
                Category = category
            };
            await _context.Items.AddAsync(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpPut("{itemId}")]
        public async Task<IActionResult> UpdateItem(int itemId, JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Item>(data.GetRawText());
            var item = await _context.Items.FindAsync(itemId);
            if (item == null) return BadRequest($"Could not update item. Item by id {itemId} not found.");
            item.Name = model.Name;
            item.Description = model.Description;
            item.Rating = model.Rating;
            item.ImageURL = model.ImageURL;
            _context.Items.Update(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpDelete("{itemId}")]
        public async Task<IActionResult> DeleteItem(int itemId)
        {
            var item = await _context.Items.FindAsync(itemId);
            if (item == null) return BadRequest($"Could not delete item. Item by id {itemId} not found.");
            var reviews = await _context.Reviews.Where(x => x.Item.Id == itemId).ToListAsync();
            if (reviews.Count != 0) _context.Reviews.RemoveRange(reviews);
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }
    }
}
