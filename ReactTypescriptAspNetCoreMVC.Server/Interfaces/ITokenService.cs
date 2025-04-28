using ReactTypescriptAspNetCoreMVC.Server.Entities;

namespace ReactTypescriptAspNetCoreMVC.Server.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user, IList<string> roles);

        string CreateRefreshToken();

        void SaveRefreshToken(string userId, string refreshToken);

        bool ValidateRefreshToken(string userId, string refreshToken);
    }
}
