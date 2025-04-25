using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text.Json;
using Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin")]
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
        var roles = Utils.GetRoles();

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
        // add user to role (based on dto.Role and dto.Username)
        if (string.IsNullOrWhiteSpace(dto.Username))
            return BadRequest("Username must be passed.");

        var user = await _userManager.FindByNameAsync(dto.Username);
        if (user == null)
            return BadRequest("Could not fetch user.");

        if (dto.Role == null)
            return BadRequest("Role wasn't passed correctly.");

        await _userManager.AddToRoleAsync(user, dto.Role);
        var roles = Utils.GetRoles();

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
        // remove user from role
        var username = User.Identity?.Name;
        if (username == dto.Username && dto.Role == "Admin")
            return BadRequest("You cannot remove yourself from Admin Role.");
        // add user to role (based on dto.Role and dto.Username)
        if (string.IsNullOrWhiteSpace(dto.Username))
            return BadRequest("Username must be passed.");

        var user = await _userManager.FindByNameAsync(dto.Username);
        if (user == null)
            return BadRequest("Could not fetch user.");

        if (dto.Role == null)
            return BadRequest("Role wasn't passed correctly.");

        await _userManager.RemoveFromRoleAsync(user, dto.Role);
        var roles = Utils.GetRoles();

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


    public class RoleDto
    {
        [Required]
        public string? Username { get; set; } = string.Empty;
        [Required]
        public string? Role { get; set; } = string.Empty;
    }
}