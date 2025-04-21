using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Auth;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;

    public UsersController(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
        // For debugging cliams
        foreach (var claim in User.Claims)
        {
            Console.WriteLine($"CLAIM: {claim.Type} = {claim.Value}");
        }

        var username = User.FindFirstValue(ClaimTypes.Name) ?? User.Identity?.Name;
        if (username == null)
            return Unauthorized();

        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
            return Unauthorized();

        var profile = new
        {
            user.UserName,
            user.Email,
            user.FirstName,
            user.LastName,
            user.DisplayName,
            user.IsAdmin
        };

        return Ok(profile);
    }
}

