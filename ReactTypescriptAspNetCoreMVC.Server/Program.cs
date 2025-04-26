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

var configuration = builder.Configuration;

// Load secrets from ENV
var jwtKey = configuration["Jwt:Key"] ?? throw new Exception("Missing Jwt__Key");
var defaultConnection = configuration.GetConnectionString("DefaultConnection") ?? throw new Exception("Missing DefaultConnection");


// Services
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(defaultConnection));

builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<AuthDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<JwtSettings>(builder.Configuration.GetRequiredSection("Jwt"));

builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<RoleChangedEventHandler>();
builder.Services.AddSingleton<IRoleEventRelay, RoleEventRelay>();
builder.Services.AddScoped<IUserClaimsPrincipalFactory<AppUser>, CustomClaimsPrincipalFactory>();
builder.Services.AddSingleton<IUserIdProvider, NameIdentifierUserIdProvider>();

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
        ValidateIssuer = false, // TODO: need to set this up
        ValidateAudience = false, // TODO: need to set this up
        ClockSkew = TimeSpan.Zero
    };

    // REQUIRED for SignalR auth
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
app.MapHub<NotificationHub>("/hubs/notifications"); // Must match exactly what React connects to
app.MapOpenApi();

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
