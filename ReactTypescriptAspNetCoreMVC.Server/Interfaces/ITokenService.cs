using ReactTypescriptAspNetCoreMVC.Server.Entities;

namespace ReactTypescriptAspNetCoreMVC.Server.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user, IList<string> roles);
    }
}
