using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using ReviewAPI.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using ReviewAPI.ModelDtos;

namespace ReviewAPI.Controllers
{
    public class ApplicationSettings
    {
        public string JWT_Secret { get; set; }
        public string Client_URL { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly DatabaseContext _context;
        private readonly ApplicationSettings _appSettings;
        private readonly IMapper _mapper;

        public UsersController(UserManager<User> userManager, SignInManager<User> signInManager, DatabaseContext context, IOptions<ApplicationSettings> appSettings, IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<object> GetUsers() => await _userManager.Users.Select(user => _mapper.Map<UserDto>(user)).ToListAsync();

        [HttpGet("{id}")]
        public async Task<object> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = $"Could not retrieve user. User by id {id} not found." });
            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpPost, Route("Register")]
        public async Task<IActionResult> Register(JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<dynamic>(data.GetRawText());
            model.Role = "Admin";
            var applicationUser = new User()
            {
                UserName = model.UserName,
                Role = model.Role,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                EmailConfirmed = true,
            };
            try
            {
                var result = await _userManager.CreateAsync(applicationUser, (string)model.Password);
                if (await _userManager.FindByNameAsync(applicationUser.UserName) != null)
                    return BadRequest(new { message = $"Could not register user. User with Username {applicationUser.UserName} is already registered." });
                await _userManager.AddToRoleAsync(applicationUser, (string)model.Role);
                await _context.SaveChangesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost, Route("Login")]
        public async Task<IActionResult> Login(JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<dynamic>(data.GetRawText());
            var user = await _userManager.FindByNameAsync((string)model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, (string)model.Password))
            {
                var role = await _userManager.GetRolesAsync(user);
                IdentityOptions _options = new();
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID", user.Id.ToString()),
                        new Claim(_options.ClaimsIdentity.RoleClaimType, role.FirstOrDefault())
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return Ok(new { 
                    Token = token, 
                    User = _mapper.Map<UserDto>(user)
                });
            }
            else
                return BadRequest(new { message = "Username or password is incorrect." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = $"Could not delete user. User by id {id} not found" });
            var rolesForUser = await _userManager.GetRolesAsync(user);
            using (var transaction = _context.Database.BeginTransaction())
            {
                if (rolesForUser.Count() > 0)
                    foreach (var item in rolesForUser.ToList())
                        await _userManager.RemoveFromRoleAsync(user, item);
                var reviews = _context.Reviews.Where(r => r.User.Id == id);
                var reactions = _context.Reactions.Where(r => r.User.Id == id);
                _context.Reactions.RemoveRange(reactions);
                _context.Reviews.RemoveRange(reviews);
                await _userManager.DeleteAsync(user);
                transaction.Commit();
            }
            return Ok(_mapper.Map<UserDto>(user));
        }

        private async Task<User> GetCurrentUser() => await _userManager.FindByIdAsync(User.Claims.First(c => c.Type == "UserID").Value);
    }
}