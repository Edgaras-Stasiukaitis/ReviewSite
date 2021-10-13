﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ReviewAPI.ModelDtos;
using ReviewAPI.Models;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ReviewAPI.Controllers
{
    [ApiController]
    [Route("api/Categories/{categoryId}/Items/{itemId}/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public ReviewsController(DatabaseContext context, UserManager<User> userManager, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        // GET: api/Categories/1/Items/1/Reviews
        [HttpGet]
        public async Task<object> GetReviews(int categoryId, int itemId) => await _context.Reviews
            .Where(x => x.Item.Category.Id == categoryId && x.Item.Id == itemId)
            .Select(r => _mapper.Map<ReviewDto>(r)).ToListAsync();

        // GET: api/Categories/1/Items/1/Reviews/1
        [HttpGet("{reviewId}")]
        public async Task<object> GetReview(int categoryId, int itemId, int reviewId)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return NotFound(new { message = $"Could not retrieve review. Category by id {categoryId} not found." });
            var item = category.Items.FirstOrDefault(x => x.Id == itemId);
            if (item == null) return NotFound(new { message = $"Could not retrieve review. Item by id {itemId} not found." });
            var review = item.Reviews.FirstOrDefault(x => x.Id == reviewId);
            if (review == null) return NotFound(new { message = $"Could not retrieve review. Review by id {reviewId} not found." });
            return Ok(_mapper.Map<ReviewDto>(review));
        }

        // POST: api/Categories/1/Items/1/Reviews
        [HttpPost, Authorize(Roles = "Admin,Member")]
        public async Task<IActionResult> AddReview(int categoryId, int itemId, JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Review>(data.GetRawText());
            var category = await _context.Categories.FindAsync(categoryId);
            if(category == null) return NotFound(new { message = $"Could not add review. Category by id {categoryId} not found." });
            var item = category.Items.FirstOrDefault(x => x.Id == itemId);
            if (item == null) return NotFound(new { message = $"Could not add review. Item by id {itemId} not found." });
            if (model.Rating == 0) return BadRequest(new { message = "Review rating is required." });
            var review = new Review
            {
                Description = model.Description,
                Rating = (int)model.Rating,
                User = await GetCurrentUser(),
                Item = item
            };
            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();
            return Created($"api/Categories/{categoryId}/Items/{itemId}/[controller]/{review.Id}", _mapper.Map<ReviewDto>(review));
        }

        // PUT: api/Categories/1/Items/1/Reviews/1
        [HttpPut("{reviewId}"), Authorize(Roles = "Admin,Member")]
        public async Task<IActionResult> UpdateReview(int categoryId, int itemId, int reviewId, JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<Review>(data.GetRawText());
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return NotFound(new { message = $"Could not update review. Category by id {categoryId} not found." });
            var item = category.Items.FirstOrDefault(x => x.Id == itemId);
            if (item == null) return NotFound(new { message = $"Could not update review. Item by id {itemId} not found." });
            var review = item.Reviews.FirstOrDefault(x => x.Id == reviewId);
            if (review == null) return NotFound(new { message = $"Could not update review. Review by id {reviewId} not found." });
            if (model.Rating == 0) return BadRequest(new { message = "Review rating is required." });
            review.Description = model.Description;
            review.UpdateDate = DateTime.Now;
            review.Rating = (int)model.Rating;
            _context.Reviews.Update(review);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<ReviewDto>(review));
        }

        // DELETE: api/Categories/1/Items/1/Reviews/1
        [HttpDelete("{reviewId}"), Authorize(Roles = "Admin,Member")]
        public async Task<IActionResult> DeleteReview(int categoryId, int itemId, int reviewId)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return NotFound(new { message = $"Could not delete review. Category by id {categoryId} not found." });
            var item = category.Items.FirstOrDefault(x => x.Id == itemId);
            if (item == null) return NotFound(new { message = $"Could not delete review. Item by id {itemId} not found." });
            var review = item.Reviews.FirstOrDefault(x => x.Id == reviewId);
            if (review == null) return NotFound(new { message = $"Could not delete review. Review by id {reviewId} not found." });
            var reactions = await _context.Reactions.Where(x => x.Review.Id == reviewId).ToListAsync();
            if (reactions.Count != 0) _context.Reactions.RemoveRange(reactions);
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<ReviewDto>(review));
        }

        private async Task<User> GetCurrentUser() => await _userManager.FindByIdAsync(User.Claims.First(c => c.Type == "UserID").Value);
    }
}
