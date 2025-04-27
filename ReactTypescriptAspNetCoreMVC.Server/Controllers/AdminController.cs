using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ReactTypescriptAspNetCoreMVC.Server.DTOs;
using ReactTypescriptAspNetCoreMVC.Server.Entities;
using ReactTypescriptAspNetCoreMVC.Server.Events;
using ReactTypescriptAspNetCoreMVC.Server.Setup;

namespace ReactTypescriptAspNetCoreMVC.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AdminController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetAdminDashboardAsync()
        {
            var roles = SeedDb.GetRoles();

            Dictionary<string, List<AppUser>> mapUsersToRoles = new Dictionary<string, List<AppUser>>();

            foreach (var role in roles)
            {
                if (await _roleManager.RoleExistsAsync(role))
                {
                    var users = await _userManager.GetUsersInRoleAsync(role);
                    mapUsersToRoles[role] = users.ToList();
                }
            }

            var allUsers = _userManager.Users.ToList();

            return Ok(new
            {
                mapUsersToRoles,
                allUsers
            });
        }

        [HttpPost("roles")]
        public async Task<IActionResult> AddUserToRole([FromBody] RoleDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username))
                return BadRequest("Username must be passed.");

            var user = await _userManager.FindByNameAsync(dto.Username);
            if (user == null)
                return BadRequest("Could not fetch user.");

            if (dto.Role == null)
                return BadRequest("Role wasn't passed correctly.");

            await _userManager.AddToRoleAsync(user, dto.Role);
            RoleEvents.RaiseRoleChanged(dto.Username, dto.Role, added: true);
            var roles = SeedDb.GetRoles();

            Dictionary<string, List<AppUser>> mapUsersToRoles = new Dictionary<string, List<AppUser>>();

            foreach (var role in roles)
            {
                if (await _roleManager.RoleExistsAsync(role))
                {
                    var users = await _userManager.GetUsersInRoleAsync(role);
                    mapUsersToRoles[role] = users.ToList();
                }
            }

            var allUsers = _userManager.Users.ToList();

            return Ok(new
            {
                mapUsersToRoles,
                allUsers
            });
        }

        [HttpDelete("roles")]
        public async Task<IActionResult> RemoveUserFromRole([FromBody] RoleDto dto)
        {
            var username = User.Identity?.Name;
            if (username == dto.Username && dto.Role == "Admin")
                return BadRequest("You cannot remove yourself from Admin Role.");

            if (string.IsNullOrWhiteSpace(dto.Username))
                return BadRequest("Username must be passed.");

            var user = await _userManager.FindByNameAsync(dto.Username);
            if (user == null)
                return BadRequest("Could not fetch user.");

            if (dto.Role == null)
                return BadRequest("Role wasn't passed correctly.");

            await _userManager.RemoveFromRoleAsync(user, dto.Role);
            RoleEvents.RaiseRoleChanged(dto.Username, dto.Role, added: false);
            var roles = SeedDb.GetRoles();

            Dictionary<string, List<AppUser>> mapUsersToRoles = new Dictionary<string, List<AppUser>>();

            foreach (var role in roles)
            {
                if (await _roleManager.RoleExistsAsync(role))
                {
                    var users = await _userManager.GetUsersInRoleAsync(role);
                    mapUsersToRoles[role] = users.ToList();
                }
            }

            var allUsers = _userManager.Users.ToList();

            return Ok(new
            {
                mapUsersToRoles,
                allUsers
            });
        }

        [HttpPost("notifyall")]
        public IActionResult NotifyAllUsers([FromBody] NotificationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest(new { message = "Server says: The message field is required." });
            }

            RoleEvents.RaiseNotifyAll(dto.Message);
            return Ok(new { success = true, message = "Notify all users success" });
        }
    }
}
