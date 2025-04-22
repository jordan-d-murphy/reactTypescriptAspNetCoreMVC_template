using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Identity;

// static async Task SeedRolesAndAdminAsync(IServiceProvider services, IConfiguration config)
// {
//     var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
//     var userManager = services.GetRequiredService<UserManager<AppUser>>();

//     var roles = new[] { "Admin", "FreeUser", "PaidUser", "PremiumUser" };

//     foreach (var role in roles)
//     {
//         if (!await roleManager.RoleExistsAsync(role))
//         {
//             await roleManager.CreateAsync(new IdentityRole(role));
//         }
//     }

//     var adminEmail = config["SeedAdmin:Email"];
//     var adminPassword = config["SeedAdmin:Password"];

//     if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
//     {
//         Console.WriteLine("⚠️  Admin seed user skipped: missing email or password.");
//         return;
//     }

//     var adminUser = await userManager.FindByEmailAsync(adminEmail);

//     if (adminUser == null)
//     {
//         adminUser = new AppUser
//         {
//             UserName = adminEmail,
//             Email = adminEmail,
//             FirstName = "Admin",
//             LastName = "User",
//             DisplayName = "Admin User",
//             EmailConfirmed = true,
//             IsAdmin = true
//         };

//         var result = await userManager.CreateAsync(adminUser, adminPassword);
//         if (result.Succeeded)
//         {
//             await userManager.AddToRoleAsync(adminUser, "Admin");
//             Console.WriteLine("✅ Admin user seeded.");
//         }
//         else
//         {
//             Console.WriteLine("❌ Failed to create admin user:");
//             foreach (var error in result.Errors)
//                 Console.WriteLine($"  - {error.Description}");
//         }
//     }
// }

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers(options =>
{
    // Apply [Authorize] to all controllers unless explicitly overridden
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    options.Filters.Add(new AuthorizeFilter(policy));
});

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<AuthDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<JwtSettings>(builder.Configuration.GetRequiredSection("Jwt"));

var jwtKey = builder.Configuration["Jwt:Key"] ?? "super-secret-key";
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = key,
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
        Console.ForegroundColor = ConsoleColor.DarkCyan;
        Console.WriteLine($"\n\nConnected to database: {context.Database.GetDbConnection().Database}\n\n");
        Console.ResetColor();
    }
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

using (var scope = app.Services.CreateScope())
{
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    await Utils.SeedRolesAndAdminAsync(scope.ServiceProvider, config);
    Console.WriteLine("Admin user should exist.");
}


app.Run();


record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}



