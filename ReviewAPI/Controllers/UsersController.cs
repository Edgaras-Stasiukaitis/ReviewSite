using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using ReviewAPI.Auth;
using ReviewAPI.ModelDtos;
using ReviewAPI.Models;
using System;
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
    }

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private const int TokenExpirationTime = 300;

        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly DatabaseContext _context;
        private readonly ApplicationSettings _appSettings;
        private readonly IMapper _mapper;
        private readonly TokenValidationParameters _tokenValidationParams;

        public UsersController(UserManager<User> userManager, SignInManager<User> signInManager, DatabaseContext context, IOptions<ApplicationSettings> appSettings, IMapper mapper, TokenValidationParameters tokenValidationParams)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
            _context = context;
            _mapper = mapper;
            _tokenValidationParams = tokenValidationParams;
        }

        [HttpGet, Authorize(Roles = "Admin")]
        public async Task<object> GetUsers() => await _userManager.Users.Select(user => _mapper.Map<UserDto>(user)).ToListAsync();

        [HttpGet, Route("{userId}/Reviews")]
        public async Task<IActionResult> GetReviews(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new { message = $"Could not retrieve reviews. User by id {userId} not found." });
            return Ok(user.Reviews.Select(r => _mapper.Map<ReviewDto>(r)));
        }

        [HttpGet, Route("{userId}/Reactions")]
        public async Task<object> GetReactions(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new { message = $"Could not retrieve reactions. User by id {userId} not found." });
            return Ok(user.Reactions.Select(r => _mapper.Map<ReactionDto>(r)));
        }

        [HttpGet("{id}"), Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = $"Could not retrieve user. User by id {id} not found." });
            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpGet, Route("{userId}/Reviews/{reviewId}")]
        public async Task<IActionResult> GetReview(string userId, int reviewId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new { message = $"User by id {userId} not found." });
            var review = user.Reviews.FirstOrDefault(r => r.Id == reviewId);
            if (review == null) return NotFound(new { message = $"Could not retrieve review. Review by {reviewId} not found." });
            return Ok(_mapper.Map<ReviewDto>(review));
        }

        [HttpGet, Route("{userId}/Reaction/{reactionId}")]
        public async Task<IActionResult> GetReaction(string userId, int reactionId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new { message = $"User by id {userId} not found." });
            var reaction = user.Reactions.FirstOrDefault(r => r.Id == reactionId);
            if (reaction == null) return NotFound(new { message = $"Could not retrieve reaction. Reaction by {reactionId} not found." });
            return Ok(_mapper.Map<ReactionDto>(reaction));
        }

        [HttpPost, Route("Register/{role?}")]
        public async Task<IActionResult> Register(JsonElement data, string role = "Member")
        {
            var model = JsonConvert.DeserializeObject<dynamic>(data.GetRawText());
            model.Role = role;
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
                if (!result.Succeeded) return BadRequest(result);
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
            try
            {
                var model = JsonConvert.DeserializeObject<dynamic>(data.GetRawText());
                var user = await _userManager.FindByNameAsync((string)model.UserName);
                if (user != null && await _userManager.CheckPasswordAsync(user, (string)model.Password))
                    return Ok(await GenerateAccessToken(user));
                return BadRequest(new { message = "Username or password is incorrect." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost, Route("RefreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequest tokenRequest)
        {
            if (ModelState.IsValid)
            {
                var result = await VerifyAndGenerateToken(tokenRequest);
                if (result == null) return BadRequest(new { message = "Invalid tokens." });
                if (result.GetType().GetProperty("message") != null) return BadRequest(result);
                return Ok(result);
            }
            return BadRequest(new { message = "Invalid payload" });
        }

        [HttpPost, Route("Logout"), Authorize]
        public async Task<IActionResult> Logout()
        {
            var user = await GetCurrentUser();
            if (user == null) return NotFound(new { message = "User not found." });
            var tokens = await _context.RefreshTokens.Where(x => x.User == user).ToListAsync();
            _context.RefreshTokens.RemoveRange(tokens);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"User {user.UserName} has been successfully logged out." });
        }

        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
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
                _context.Reactions.RemoveRange(_context.Reactions.Where(r => r.User.Id == id));
                _context.Reviews.RemoveRange(_context.Reviews.Where(r => r.User.Id == id));
                _context.RefreshTokens.RemoveRange(_context.RefreshTokens.Where(t => t.User.Id == id));
                await _userManager.DeleteAsync(user);
                transaction.Commit();
            }
            return Ok(_mapper.Map<UserDto>(user));
        }

        private async Task<object> VerifyAndGenerateToken(TokenRequest tokenRequest)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == tokenRequest.RefreshToken);
            if (storedToken == null) return new { message = "Token does not exist." };
            if (storedToken.AddedDate.AddMinutes(TokenExpirationTime) >= DateTime.Now)
            {
                var tokenInVerification = jwtTokenHandler.ValidateToken(tokenRequest.Token, _tokenValidationParams, out var validatedToken);
                if (validatedToken is JwtSecurityToken jwtSecurityToken)
                {
                    var result = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase);
                    if (result == false) return null;
                }
                var utcExpiryTime = long.Parse(tokenInVerification.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp).Value);
                var expiryDate = UnixTimeStampToDateTime(utcExpiryTime);
                if (expiryDate > DateTime.UtcNow) return new { message = "Token has not yet expired." };
                var jti = tokenInVerification.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti).Value;
                if (storedToken.JwtId != jti) return new { message = "Token does not match." };
            }
            if (storedToken.IsUsed) return new { message = "Token has been used." };
            if (storedToken.IsRevoked) return new { message = "Token has been revoked." };
            storedToken.IsUsed = true;
            _context.RefreshTokens.Update(storedToken);
            await _context.SaveChangesAsync();
            var user = await _userManager.FindByIdAsync(storedToken.User.Id);
            return await GenerateAccessToken(user);
        }

        private async Task<object> GenerateAccessToken(User user)
        {
            IdentityOptions _options = new();
            var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(CustomClaims.UserId, user.Id.ToString()),
                    new Claim(_options.ClaimsIdentity.RoleClaimType, role),
                    new Claim(CustomClaims.UserName, user.UserName),
                    new Claim(CustomClaims.Email, user.Email),
                    new Claim(CustomClaims.FirstName, user.FirstName),
                    new Claim(CustomClaims.LastName, user.LastName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(TokenExpirationTime),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(securityToken);
            var refreshToken = new RefreshToken()
            {
                JwtId = securityToken.Id,
                IsUsed = false,
                IsRevoked = false,
                User = user,
                AddedDate = DateTime.Now,
                ExpiryDate = DateTime.Now.AddMonths(6),
                Token = Guid.NewGuid().ToString()
            };
            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();
            return new
            {
                Token = token,
                RefreshToken = refreshToken.Token,
            };
        }

        private static DateTime UnixTimeStampToDateTime(long unixTimeStamp)
        {
            var dateTimeVal = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            return dateTimeVal.AddSeconds(unixTimeStamp).ToUniversalTime();
        }

        private async Task<User> GetCurrentUser() => await _userManager.FindByIdAsync(User.Claims.First(c => c.Type == CustomClaims.UserId).Value);
    }
}