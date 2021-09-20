using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ReviewAPI.Models;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;

namespace ReviewAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public CategoriesController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<object> GetCategories() => await _context.Categories.ToListAsync();

        // GET: api/Categories/1
        [HttpGet("{id}")]
        public async Task<object> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound($"Could not retrieve category. Category by id {id} not found.");
            return new
            {
                category.Id,
                category.Name,
                category.ImageURL,
                category.Items
            };
        }

        // POST: api/Categories
        [HttpPost]
        public async Task<IActionResult> AddCategory(JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Item>(data.GetRawText());
            var category = new Category
            {
                Name = model.Name,
                ImageURL = model.ImageURL
            };
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return Ok(category);
        }

        // PUT: api/Categories/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Item>(data.GetRawText());
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound($"Could not update category. Category by id {id} not found.");
            category.Name = model.Name;
            category.ImageURL = model.ImageURL;
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
            return Ok(category);
        }

        // DELETE: api/Categories/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound($"Could not delete Category. Category by id {id} not found.");
            var items = await _context.Items.Where(x => x.Category.Id == id).ToListAsync();
            if(items.Count != 0) _context.Items.RemoveRange(items);
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok(category);
        }
    }
}
