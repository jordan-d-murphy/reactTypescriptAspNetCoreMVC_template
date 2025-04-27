using ReactTypescriptAspNetCoreMVC.Server.Entities;

namespace ReactTypescriptAspNetCoreMVC.Server.Interfaces
{
    public interface IAuthService
    {
        // Task<string> GenerateJwtTokenAsync(AppUser user);
        Task<AppUser?> GetUserByUsernameAsync(string username);
    }
}