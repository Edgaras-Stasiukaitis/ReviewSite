using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public CategoriesController(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<object> GetCategories() => await _context.Categories.ToListAsync();

        // GET: api/Categories/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound(new { message = $"Could not retrieve category. Category by id {id} not found." });
            return Ok(_mapper.Map<CategoryDto>(category));
        }

        // POST: api/Categories
        [HttpPost, Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddCategory(JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Category>(data.GetRawText());
            if (model.Name == null) return BadRequest(new { message = "Category name is required." });
            var category = new Category
            {
                Name = model.Name,
                ImageURL = model.ImageURL
            };
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return Created($"api/[controller]/{category.Id}", _mapper.Map<CategoryDto>(category));
        }

        // PUT: api/Categories/1
        [HttpPut("{id}"), Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(int id, JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Category>(data.GetRawText());
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound(new { message = $"Could not update category. Category by id {id} not found." });
            if (model.Name == null) return BadRequest(new { message = "Category name is required." });
            category.Name = model.Name;
            category.ImageURL = model.ImageURL;
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<CategoryDto>(category));
        }

        // DELETE: api/Categories/1
        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound(new { message = $"Could not delete Category. Category by id {id} not found." });
            var reactions = await _context.Reactions.Where(x => x.Review.Item.Category.Id == id).ToListAsync();
            if (reactions.Count != 0) _context.Reactions.RemoveRange(reactions);
            var reviews = await _context.Reviews.Where(x => x.Item.Category.Id == id).ToListAsync();
            if (reviews.Count != 0) _context.Reviews.RemoveRange(reviews);
            var items = await _context.Items.Where(x => x.Category.Id == id).ToListAsync();
            if (items.Count != 0) _context.Items.RemoveRange(items);
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<CategoryDto>(category));
        }
    }
}
