using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ReactTypescriptAspNetCoreMVC.Server.Extensions
{
    public static class AuthenticationServiceExtensions
    {
        public static IServiceCollection AddAuthenticationServices(this IServiceCollection services, IConfiguration config)
        {
            // var jwtKey = config["Jwt:Key"] ?? throw new Exception("Missing Jwt:Key");
            var jwtKey = config["Jwt:Key"] ?? Environment.GetEnvironmentVariable("Jwt__Key") ?? throw new Exception("Missing Jwt Key");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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

        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.HandleResponse(); // very important
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                var result = System.Text.Json.JsonSerializer.Serialize(new { message = "Unauthorized" });
                return context.Response.WriteAsync(result);
            },
            OnForbidden = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            }
        };
    });

            // services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            //     .AddJwtBearer(options =>
            //     {
            //         options.RequireHttpsMetadata = false;
            //         options.SaveToken = true;
            //         options.TokenValidationParameters = new TokenValidationParameters
            //         {
            //             ValidateIssuerSigningKey = true,
            //             IssuerSigningKey = key,
            //             ValidateIssuer = false,
            //             ValidateAudience = false,
            //             ClockSkew = TimeSpan.Zero
            //         };

            //         options.Events = new JwtBearerEvents
            //         {
            //             OnChallenge = context =>
            //             {
            //                 context.HandleResponse();
            //                 context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            //                 context.Response.ContentType = "application/json";
            //                 var result = System.Text.Json.JsonSerializer.Serialize(new { message = "Unauthorized" });
            //                 return context.Response.WriteAsync(result);
            //             }
            //         };
            //     });

            return services;
        }
    }
}