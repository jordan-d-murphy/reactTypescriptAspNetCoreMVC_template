using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using ReactTypescriptAspNetCoreMVC.Server.Entities;

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

        // remove default NameIdentifier and Name, was causing a duplicate that broke signalR
        var toRemove = identity.FindAll(ClaimTypes.NameIdentifier).ToList();
        foreach (var claim in toRemove)
            identity.RemoveClaim(claim);

        var nameClaims = identity.FindAll(ClaimTypes.Name).ToList();
        foreach (var claim in nameClaims)
            identity.RemoveClaim(claim);

        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
        identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName ?? ""));
        identity.AddClaim(new Claim("displayName", user.DisplayName ?? ""));
        identity.AddClaim(new Claim("isAdmin", user.IsAdmin.ToString()));

        return identity;
    }
}
