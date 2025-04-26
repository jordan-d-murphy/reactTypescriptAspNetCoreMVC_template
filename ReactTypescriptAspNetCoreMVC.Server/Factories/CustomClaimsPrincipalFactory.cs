using Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;

public class CustomClaimsPrincipalFactory : UserClaimsPrincipalFactory<AppUser>
{
    public CustomClaimsPrincipalFactory(
        UserManager<AppUser> userManager,
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, optionsAccessor)
    {
    }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(AppUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);

        // REMOVE default NameIdentifier and Name
        var toRemove = identity.FindAll(ClaimTypes.NameIdentifier).ToList();
        foreach (var claim in toRemove)
            identity.RemoveClaim(claim);

        var nameClaims = identity.FindAll(ClaimTypes.Name).ToList();
        foreach (var claim in nameClaims)
            identity.RemoveClaim(claim);

        // ADD the correct ones
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
        identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName ?? ""));

        // Optional: add custom ones
        identity.AddClaim(new Claim("displayName", user.DisplayName ?? ""));
        identity.AddClaim(new Claim("isAdmin", user.IsAdmin.ToString()));

        return identity;
    }
}