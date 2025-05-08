using Extensions;
using ReactTypescriptAspNetCoreMVC.Server.Extensions;
using ReactTypescriptAspNetCoreMVC.Server.Hubs;
using ReactTypescriptAspNetCoreMVC.Server.Interfaces;
using ReactTypescriptAspNetCoreMVC.Server.Middleware;
using ReactTypescriptAspNetCoreMVC.Server.Services;
using ReactTypescriptAspNetCoreMVC.Server.Settings;
using ReactTypescriptAspNetCoreMVC.Server.Setup;

var builder = WebApplication.CreateBuilder(args);

// Setup configuration
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// Add services
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices();
builder.Services.AddAuthenticationServices(builder.Configuration);
builder.Services.AddSignalRServices();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddCorsPolicy();

builder.Services.AddScoped<IAuthService, AuthService>();

// Build app
var app = builder.Build();

// Middlewares
app.UseCors("CorsPolicy");
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<ValidationExceptionMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHub<NotificationHub>(NotificationHub.HubUrl);
app.Services.GetRequiredService<IRoleEventRelay>().Register();

using (var scope = app.Services.CreateScope())
{
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    await SeedDb.SeedRolesAndAdminAsync(scope.ServiceProvider, config);
}

app.Run();
