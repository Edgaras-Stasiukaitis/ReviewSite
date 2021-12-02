using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ReviewAPI.ModelDtos;
using ReviewAPI.Models;

namespace ReviewAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public HomeController(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Home/Popular/1
        [Route("Popular/{amount}"), HttpGet]
        public async Task<object> GetPopularReviews(int amount) => await _context.Reviews
            .Select(r => new
            {
                Review = _mapper.Map<ReviewDto>(r),
                Item = _mapper.Map<ItemDto>(r.Item),
                Category = _mapper.Map<CategoryDto>(r.Item.Category),
                User = _mapper.Map<UserDto>(r.User),
                r.Reactions
            })
            .OrderByDescending(r => r.Reactions.Count)
            .Take(amount)
            .ToListAsync();

        // GET: api/Home/Recent/1
        [Route("Recent/{amount}"), HttpGet]
        public async Task<object> GetRecentReviews(int amount) => await _context.Reviews
            .OrderByDescending(x => x.CreationDate)
            .Select(r => new
            {
                Review = _mapper.Map<ReviewDto>(r),
                Item = _mapper.Map<ItemDto>(r.Item),
                Category = _mapper.Map<CategoryDto>(r.Item.Category),
                User = _mapper.Map<UserDto>(r.User),
                r.Reactions
            })
            .Take(amount)
            .ToListAsync();
    }
}
