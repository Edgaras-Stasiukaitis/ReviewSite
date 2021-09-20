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

        public UsersController(UserManager<User> userManager, SignInManager<User> signInManager, DatabaseContext context, IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
            _context = context;
        }

        [HttpGet]
        public async Task<object> GetUsers() => await _userManager.Users.Select(x => new
            {
                x.Id,
                x.UserName,
                x.FirstName,
                x.LastName,
                x.Email,
                x.Reviews,
                x.Reactions
            }).ToListAsync();

        [HttpGet("{id}")]
        public async Task<object> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            var userRole = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
            if (user == null) return NotFound($"Could not retrieve user. User by id {id} not found.");
            return Ok(new {
                user.Id, 
                role = userRole,
                user.UserName,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Reviews,
                user.Reactions
            });
        }

        [HttpPost, Route("Register")]
        public async Task<object> Register(JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<dynamic>(data.GetRawText());
            model.Role = "Admin";
            var applicationUser = new User()
            {
                UserName = model.UserName,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                EmailConfirmed = true,
            };
            try
            {
                var result = await _userManager.CreateAsync(applicationUser, (string)model.Password);
                await _userManager.AddToRoleAsync(applicationUser, (string)model.Role);
                await _context.SaveChangesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Problem with register:\n{ex.Message}");
            }
        }

        [HttpPost, Route("Login")]
        public async Task<IActionResult> Login(JsonElement data)
        {
            var model = JsonConvert.DeserializeObject<dynamic>(data.GetRawText());
            var user = await _userManager.FindByNameAsync((string)model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, (string)model.Password))
            {
                //Get role
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
                return Ok(new { Token = token, User = user });
            }
            else
                return BadRequest(new { message = "Username or password is incorrect." });
        }

        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (id == null) return NotFound("User not found");
            var user = await _userManager.FindByIdAsync(id);
            var rolesForUser = await _userManager.GetRolesAsync(user);
            using (var transaction = _context.Database.BeginTransaction())
            {
                if (rolesForUser.Count() > 0)
                    foreach (var item in rolesForUser.ToList())
                        await _userManager.RemoveFromRoleAsync(user, item);
                await _userManager.DeleteAsync(user);
                transaction.Commit();
            }
            return Ok(user);
        }

        private async Task<User> GetCurrentUser() => await _userManager.FindByIdAsync(User.Claims.First(c => c.Type == "UserID").Value);
    }
}