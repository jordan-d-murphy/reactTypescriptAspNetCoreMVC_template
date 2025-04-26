using System.Text;
using Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// Services
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<AuthDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<JwtSettings>(builder.Configuration.GetRequiredSection("Jwt"));

builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<RoleChangedEventHandler>();
builder.Services.AddSingleton<IRoleEventRelay, RoleEventRelay>();
builder.Services.AddScoped<IUserClaimsPrincipalFactory<AppUser>, CustomClaimsPrincipalFactory>();
builder.Services.AddSingleton<IUserIdProvider, NameIdentifierUserIdProvider>(); // 👈 IMPORTANT: Add this!!

builder.Services.AddSignalR().AddJsonProtocol();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithOrigins("http://localhost:5173"); // React app URL
    });
});

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

    // 👇 This is REQUIRED for SignalR auth
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/notifications"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

builder.Services.AddControllers(options =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    options.Filters.Add(new AuthorizeFilter(policy));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware
app.UseRouting();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Endpoints
app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications"); // 👈 Must match exactly what React connects to
app.MapOpenApi(); // if you want

// Custom startup logic
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
    Console.ForegroundColor = ConsoleColor.DarkCyan;
    Console.WriteLine($"\n\nConnected to database: {context.Database.GetDbConnection().Database}\n\n");
    Console.ResetColor();

    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    await Utils.SeedRolesAndAdminAsync(scope.ServiceProvider, config);
    Console.WriteLine("Admin user should exist.");

    var roleRelay = scope.ServiceProvider.GetRequiredService<IRoleEventRelay>();
    roleRelay.Register();
}

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

// using System.Text;
// using Auth;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.AspNetCore.Mvc.Authorization;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.IdentityModel.Tokens;
// using static AdminController;

// var builder = WebApplication.CreateBuilder(args);

// builder.Configuration
//     .SetBasePath(Directory.GetCurrentDirectory())
//     .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
//     .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
//     .AddEnvironmentVariables();

// // Add services to the container.
// // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddControllers(options =>
// {
//     // Apply [Authorize] to all controllers unless explicitly overridden
//     var policy = new AuthorizationPolicyBuilder()
//         .RequireAuthenticatedUser()
//         .Build();
//     options.Filters.Add(new AuthorizeFilter(policy));
// });

// builder.Services.AddOpenApi();
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// builder.Services.AddDbContext<AuthDbContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// builder.Services.AddIdentity<AppUser, IdentityRole>()
//     .AddEntityFrameworkStores<AuthDbContext>()
//     .AddDefaultTokenProviders();

// builder.Services.Configure<JwtSettings>(builder.Configuration.GetRequiredSection("Jwt"));



// builder.Services.AddScoped<INotificationService, NotificationService>();
// builder.Services.AddScoped<RoleChangedEventHandler>();
// builder.Services.AddSingleton<IRoleEventRelay, RoleEventRelay>();
// builder.Services.AddScoped<IUserClaimsPrincipalFactory<AppUser>, CustomClaimsPrincipalFactory>();

// builder.Services.AddSignalR().AddJsonProtocol();


// var jwtKey = builder.Configuration["Jwt:Key"] ?? "super-secret-key";
// var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
// })
// .AddJwtBearer(options =>
// {
//     options.RequireHttpsMetadata = false;
//     options.SaveToken = true;
//     options.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuerSigningKey = true,
//         IssuerSigningKey = key,
//         ValidateIssuer = false,
//         ValidateAudience = false,
//         ClockSkew = TimeSpan.Zero
//     };
// });

// builder.Services.AddAuthorization();

// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("CorsPolicy", policy =>
//     {
//         policy.AllowAnyHeader()
//               .AllowAnyMethod()
//               .AllowCredentials()
//               .WithOrigins("http://localhost:5173"); // React app URL
//     });
// });



// var app = builder.Build();
// app.UseRouting();
// app.UseCors("CorsPolicy");


// app.Services.GetRequiredService<IRoleEventRelay>().Register();

// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();

//     using (var scope = app.Services.CreateScope())
//     {
//         var context = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
//         Console.ForegroundColor = ConsoleColor.DarkCyan;
//         Console.WriteLine($"\n\nConnected to database: {context.Database.GetDbConnection().Database}\n\n");
//         Console.ResetColor();
//     }
// }

// app.UseHttpsRedirection();
// app.UseAuthentication();
// app.UseAuthorization();
// app.MapControllers();

// app.MapHub<NotificationHub>(NotificationHub.HubUrl);



// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

// app.UseHttpsRedirection();

// var summaries = new[]
// {
//     "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
// };

// app.MapGet("/weatherforecast", () =>
// {
//     var forecast = Enumerable.Range(1, 5).Select(index =>
//         new WeatherForecast
//         (
//             DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
//             Random.Shared.Next(-20, 55),
//             summaries[Random.Shared.Next(summaries.Length)]
//         ))
//         .ToArray();
//     return forecast;
// })
// .WithName("GetWeatherForecast");

// using (var scope = app.Services.CreateScope())
// {
//     var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
//     await Utils.SeedRolesAndAdminAsync(scope.ServiceProvider, config);
//     Console.WriteLine("Admin user should exist.");
// }

// // RoleEvents.OnRoleChanged += async (username, role, added) =>
// // {
// //     using var scope = app.Services.CreateScope();
// //     var roleChangedHandler = scope.ServiceProvider.GetRequiredService<RoleChangedEventHandler>();
// //     RoleEvents.OnRoleChanged += roleChangedHandler.HandleRoleChange;
// //     roleChangedHandler.HandleRoleChange(username, role, added);
// // };


// app.Run();


// record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
// {
//     public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
// }



