using Microsoft.AspNetCore.Identity;
using ReactTypescriptAspNetCoreMVC.Server.Entities;
using ReactTypescriptAspNetCoreMVC.Server.Events;

namespace ReactTypescriptAspNetCoreMVC.Server.Setup
{
    public static class SeedDb
    {
        public static string[] GetRoles()
        {
            // this needs to move somewhere else, probably a role controller and be fetched from the database
            return ["Admin", "User", "PaidUser", "PremiumUser", "Red", "Green", "Blue"];
        }

        public static string GetGUID()
        {
            return Guid.NewGuid().ToString();
        }

        public static async Task SeedRolesAndAdminAsync(IServiceProvider services, IConfiguration config)
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = services.GetRequiredService<UserManager<AppUser>>();

            var roles = GetRoles();

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            var adminEmail = config["SeedAdmin:Email"] ?? throw new Exception("Missing SeedAdmin__Email");
            var adminPassword = config["SeedAdmin:Password"] ?? throw new Exception("Missing SeedAdmin__Password");

            if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("\n\n⚠️  Admin seed user skipped: missing email or password.\n\n");
                Console.ResetColor();
                return;
            }

            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new AppUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "Admin",
                    LastName = "User",
                    DisplayName = "Admin User",
                    EmailConfirmed = true,
                    IsAdmin = true
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                    RoleEvents.RaiseRoleChanged(adminUser.UserName, "Admin", added: true);
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine("\n\n✅ Admin user seeded.\n\n");
                    Console.ResetColor();
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("\n\n❌ Failed to create admin user:");
                    foreach (var error in result.Errors)
                        Console.WriteLine($"  - {error.Description}");
                    Console.WriteLine("\n\n");
                    Console.ResetColor();
                }
            }
        }
    }
}
