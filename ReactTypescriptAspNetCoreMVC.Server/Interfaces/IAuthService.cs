using Auth;

namespace Services
{
    public interface IAuthService
    {
        Task<string> GenerateJwtTokenAsync(AppUser user);
        Task<AppUser?> GetUserByUsernameAsync(string username);
    }
}