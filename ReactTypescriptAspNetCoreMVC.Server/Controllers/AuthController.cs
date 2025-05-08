using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ReactTypescriptAspNetCoreMVC.Server.DTOs.Auth;
using ReactTypescriptAspNetCoreMVC.Server.Entities;
using ReactTypescriptAspNetCoreMVC.Server.Events;
using ReactTypescriptAspNetCoreMVC.Server.Hubs;
using ReactTypescriptAspNetCoreMVC.Server.Interfaces;

namespace ReactTypescriptAspNetCoreMVC.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;

        private readonly IHubContext<NotificationHub> _hub;

        public AuthController(UserManager<AppUser> userManager, ITokenService tokenService, IHubContext<NotificationHub> hub)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _hub = hub;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is Required");

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
            RoleEvents.RaiseRoleChanged(dto.Username, "User", added: true);

            if (!string.IsNullOrEmpty(dto.ColorRole))
            {
                await _userManager.AddToRoleAsync(user, dto.ColorRole);
                RoleEvents.RaiseRoleChanged(dto.Username, dto.ColorRole, added: true);
            }

            return Ok(new { success = true, message = "Registered successfully." });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.LoginIdentifier) ?? await _userManager.FindByEmailAsync(dto.LoginIdentifier);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return Unauthorized();

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenService.CreateToken(user, roles);

            var refreshToken = _tokenService.CreateRefreshToken();

            await _tokenService.SaveRefreshTokenAsync(user, refreshToken);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Secure = true, // important in production (HTTPS only)
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

            return Ok(new { token });
        }

        [HttpPost("logout")]
        [AllowAnonymous]
        public async Task<IActionResult> LogoutAsync([FromBody] RefreshRequest refreshRequest)
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshTokenFromCookie))
            {
                return Unauthorized();
            }

            var userId = refreshRequest.UserId;

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("Missing userId.");
            }

            // Revoke the refresh token
            await _tokenService.RevokeRefreshTokenAsync(userId, refreshTokenFromCookie);

            // Delete refresh token cookie from browser
            Response.Cookies.Delete("refreshToken");

            return Ok();
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
                return Unauthorized();

            var user = await _tokenService.GetUserFromRefreshTokenAsync(refreshToken);
            if (user == null || !await _tokenService.ValidateRefreshTokenAsync(user, refreshToken))
                return Unauthorized();

            await _tokenService.RevokeRefreshTokenAsync(user.Id, refreshToken);

            var roles = await _userManager.GetRolesAsync(user);
            var newAccessToken = _tokenService.CreateToken(user, roles);
            var newRefreshToken = _tokenService.CreateRefreshToken();

            await _tokenService.SaveRefreshTokenAsync(user, newRefreshToken);

            Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            await _hub.Clients.User(user.Id).SendAsync("ReceiveNotification", "✅ Token refreshed successfully");
            return Ok(new { accessToken = newAccessToken });
        }

        // [HttpPost("refresh")]
        // [AllowAnonymous]
        // [Consumes("application/json")]
        // public async Task<IActionResult> Refresh([FromBody] RefreshRequest refreshRequest)
        // {
        //     var refreshTokenTest = Request.Cookies["refreshToken"];

        //     Console.ForegroundColor = ConsoleColor.Yellow;
        //     Console.WriteLine($"\n\nvar refreshTokenTest = Request.Cookies['refreshToken'];\n{refreshTokenTest}\n\n");
        //     Console.ResetColor();

        //     if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
        //     {
        //         return Unauthorized();
        //     }

        //     var userId = refreshRequest.UserId;

        //     // simple version assuming userId is known:
        //     var user = await _userManager.FindByIdAsync(userId);

        //     if (user == null || !await _tokenService.ValidateRefreshTokenAsync(user, refreshToken))
        //     {
        //         return Unauthorized();
        //     }

        //     await _tokenService.RevokeRefreshTokenAsync(user.Id, refreshToken);

        //     var roles = await _userManager.GetRolesAsync(user);
        //     var newAccessToken = _tokenService.CreateToken(user, roles);
        //     var newRefreshToken = _tokenService.CreateRefreshToken();

        //     await _tokenService.SaveRefreshTokenAsync(user, newRefreshToken);

        //     var cookieOptions = new CookieOptions
        //     {
        //         HttpOnly = true,
        //         SameSite = SameSiteMode.Lax,
        //         Secure = true,
        //         Expires = DateTime.UtcNow.AddDays(7)
        //     };

        //     Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);

        //     return Ok(new { accessToken = newAccessToken });
        // }
    }
}
