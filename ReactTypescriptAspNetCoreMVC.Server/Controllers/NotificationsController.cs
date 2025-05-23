using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactTypescriptAspNetCoreMVC.Server.Data.Auth;
using ReactTypescriptAspNetCoreMVC.Server.Entities;

namespace ReactTypescriptAspNetCoreMVC.Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly AuthDbContext _context;

        public NotificationsController(AuthDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyNotifications()
        {
            var username = User.Identity?.Name;

            if (string.IsNullOrWhiteSpace(username))
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
                return Unauthorized();

            var notifications = await _context.Notifications
                .Where(n => n.UserId == user.Id)
                .OrderByDescending(n => n.Timestamp)
                .ToListAsync();

            return Ok(notifications);
        }
    }
}
