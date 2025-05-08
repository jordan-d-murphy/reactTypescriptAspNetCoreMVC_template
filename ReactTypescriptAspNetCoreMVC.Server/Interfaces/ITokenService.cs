using ReactTypescriptAspNetCoreMVC.Server.Entities;

namespace ReactTypescriptAspNetCoreMVC.Server.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user, IList<string> roles);

        string CreateRefreshToken();

        // void SaveRefreshToken(string userId, string refreshToken);

        // void SaveRefreshTokenAsync(string userId, string refreshToken);
        Task SaveRefreshTokenAsync(AppUser user, string refreshToken);

        // bool ValidateRefreshToken(string userId, string refreshToken);
        Task<bool> ValidateRefreshTokenAsync(AppUser user, string refreshToken);

        Task RevokeRefreshTokenAsync(string userId, string refreshToken);
        Task<AppUser> GetUserFromRefreshTokenAsync(string refreshToken);
    }
}
