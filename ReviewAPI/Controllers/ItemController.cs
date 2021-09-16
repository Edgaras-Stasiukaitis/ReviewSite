using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ReviewAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ReviewAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ItemController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet, Route("GetItems")]
        public async Task<object> GetItems() => await _context.Items.ToListAsync();

        [HttpGet, Route("GetItem/{id}")]
        public async Task<object> GetItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null) return BadRequest($"Could not retrieve item. Item  by id {id} not found.");
            return item;
        }

        [HttpPost, Route("AddItem")]
        public async Task<IActionResult> AddItem(JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Item>(data.GetRawText());
            var item = new Item
            {
                Name = model.Name,
                Description = model.Description,
                Rating = model.Rating,
                ImageURL = model.ImageURL,
                Category = _context.Categories.First()
            };
            await _context.Items.AddAsync(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpPut, Route("UpdateItem/{id}")]
        public async Task<IActionResult> UpdateItem(int id, JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Item>(data.GetRawText());
            var item = await _context.Items.FindAsync(id);
            if (item == null) return BadRequest($"Could not update item. Item by id {id} not found.");
            item.Name = model.Name;
            item.Description = model.Description;
            item.Rating = model.Rating;
            item.ImageURL = model.ImageURL;
            _context.Items.Update(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpDelete, Route("DeleteItem/{itemId}")]
        public async Task<IActionResult> DeleteItem(int itemId)
        {
            var item = await _context.Items.FindAsync(itemId);
            if (item == null) return BadRequest($"Could not delete item. Item by id {itemId} not found.");
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }
    }
}
