using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;


[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly JwtSettings _jwtSettings;

    private readonly UserManager<AppUser> _userManager;
    private readonly IConfiguration _config;

    public AuthController(UserManager<AppUser> userManager, IConfiguration config, IOptions<JwtSettings> options)
    {
        _userManager = userManager;
        _config = config;
        _jwtSettings = options.Value;

    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var user = new AppUser
        {
            UserName = dto.Username,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            DisplayName = dto.DisplayName,
            IsAdmin = false
        };

        if (string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest("Password is Required");

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, "User");

        if (!string.IsNullOrEmpty(dto.ColorRole))
        {
            await _userManager.AddToRoleAsync(user, dto.ColorRole);
        }

        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userManager.FindByNameAsync(dto.Username) ?? await _userManager.FindByEmailAsync(dto.Username);
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            return Unauthorized();

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName ?? string.Empty),
            new Claim(ClaimTypes.Name, user.UserName!),
            new Claim("displayName", user.DisplayName ?? string.Empty),
            new Claim("isAdmin", user.IsAdmin.ToString())
        };

        var roles = await _userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
    }

    public class LoginDto
    {
        [Required]
        [MinLength(6)]
        public string Username { get; set; } = "";
        [Required]
        [MinLength(8)]
        public string Password { get; set; } = "";
    }

    public class RegisterDto
    {
        [Required]
        [MinLength(6)]
        public string? Username { get; set; } = string.Empty;
        [Required]
        [MinLength(8)]
        public string? Password { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string? Email { get; set; } = string.Empty;
        [Required]
        public string? FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; } = string.Empty;
        public string? DisplayName { get; set; } = string.Empty;
        public string? ColorRole { get; set; } = string.Empty;
    }
}
