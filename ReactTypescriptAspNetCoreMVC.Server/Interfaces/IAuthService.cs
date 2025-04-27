using ReactTypescriptAspNetCoreMVC.Server.Entities;

namespace ReactTypescriptAspNetCoreMVC.Server.Interfaces
{
    public interface IAuthService
    {
        Task<AppUser?> GetUserByUsernameAsync(string username);
    }
}
