using Microsoft.AspNetCore.Identity;

namespace ReactTypescriptAspNetCoreMVC.Server.Entities
{
    public class AppUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DisplayName { get; set; }
        public bool IsAdmin { get; set; } = false;
        public string FullName => $"{FirstName} {LastName}".Trim();
    }
}