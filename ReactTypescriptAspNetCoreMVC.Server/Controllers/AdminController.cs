using System.Security.Claims;
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

        return Ok(mapUsersToRoles);
    }
}
