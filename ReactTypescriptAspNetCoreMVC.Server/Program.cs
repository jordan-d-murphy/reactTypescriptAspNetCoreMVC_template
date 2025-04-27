using Extensions;
using ReactTypescriptAspNetCoreMVC.Server.Extensions;
using ReactTypescriptAspNetCoreMVC.Server.Hubs;
using ReactTypescriptAspNetCoreMVC.Server.Interfaces;
using ReactTypescriptAspNetCoreMVC.Server.Middleware;
using ReactTypescriptAspNetCoreMVC.Server.Services;
using ReactTypescriptAspNetCoreMVC.Server.Setup;

var builder = WebApplication.CreateBuilder(args);

// Setup configuration
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// Add services
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices();
builder.Services.AddAuthenticationServices(builder.Configuration);
builder.Services.AddSignalRServices();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddCorsPolicy();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddSingleton<IRoleEventRelay, RoleEventRelay>();

// Build app
var app = builder.Build();

// Middlewares
app.UseRouting();
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseCors("CorsPolicy");
app.UseMiddleware<ValidationExceptionMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.MapHub<NotificationHub>(NotificationHub.HubUrl);

using (var scope = app.Services.CreateScope())
{
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    await SeedDb.SeedRolesAndAdminAsync(scope.ServiceProvider, config);
}

app.Run();
