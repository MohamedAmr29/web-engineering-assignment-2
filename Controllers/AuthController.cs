using CourseManagementAPI.Auth;
using CourseManagementAPI.Data;
using CourseManagementAPI.DTOs;
using CourseManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CourseManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public AuthController(AppDbContext context, IOptions<JwtSettings> jwtOptions)
        {
            _context = context;
            _jwtSettings = jwtOptions.Value;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterRequestDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                return BadRequest(new { message = "Username already exists." });

            var user = new User
            {
                Username = request.Username,
                Password = request.Password,
                Role = "Student"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful. You can now login." });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginRequestDto request)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.Password == request.Password);

            if (user == null)
                return Unauthorized(new { message = "Invalid username or password." });

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("UserId", user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = expires
            });
        }
    }
}