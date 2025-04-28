using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ReactTypescriptAspNetCoreMVC.Server.Data.Auth;
using ReactTypescriptAspNetCoreMVC.Server.Entities;
using ReactTypescriptAspNetCoreMVC.Server.Interfaces;
using ReactTypescriptAspNetCoreMVC.Server.Settings;

namespace ReactTypescriptAspNetCoreMVC.Server.Services
{
    public class TokenService : ITokenService
    {

        // this is temporary, add to db later
        // private static readonly Dictionary<string, string> _refreshTokens = new Dictionary<string, string>();
        private readonly AuthDbContext _context;

        private readonly JwtSettings _jwtSettings;
        public TokenService(AuthDbContext context, IOptions<JwtSettings> options)
        {
            _context = context;
            _jwtSettings = options.Value;
        }

        public string CreateToken(AppUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim("displayName", user.DisplayName ?? string.Empty),
                new Claim("given_name", user.FirstName ?? string.Empty),
                new Claim("family_name", user.LastName ?? string.Empty),
                new Claim("isAdmin", user.IsAdmin.ToString())
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddSeconds(30), // Super short expiry for testing in dev!

                // expires: DateTime.UtcNow.AddHours(1), // for actual use

                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string CreateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        // public void SaveRefreshToken(string userId, string refreshToken)
        // {
        //     _refreshTokens[userId] = refreshToken;
        // }

        // public bool ValidateRefreshToken(string userId, string refreshToken)
        // {
        //     return _refreshTokens.TryGetValue(userId, out var savedToken) && savedToken == refreshToken;
        // }

        public async Task SaveRefreshTokenAsync(AppUser user, string refreshToken)
        {
            var newToken = new RefreshToken
            {
                Token = refreshToken,
                Expires = DateTime.UtcNow.AddDays(7),
                AppUserId = user.Id,
            };

            _context.RefreshTokens.Add(newToken);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ValidateRefreshTokenAsync(AppUser user, string refreshToken)
        {
            var token = await _context.RefreshTokens
                .Where(rt => rt.AppUserId == user.Id && rt.Token == refreshToken && !rt.IsRevoked && rt.Expires > DateTime.UtcNow)
                .FirstOrDefaultAsync();

            return token != null;
        }

        public async Task RevokeRefreshTokenAsync(string userId, string refreshToken)
        {
            var token = await _context.RefreshTokens
                .Where(rt => rt.AppUserId == userId && rt.Token == refreshToken && !rt.IsRevoked)
                .FirstOrDefaultAsync();

            if (token != null)
            {
                token.IsRevoked = true;
                await _context.SaveChangesAsync();
            }
        }

        // public void SaveRefreshTokenAsync(string userId, string refreshToken)
        // {
        //     throw new NotImplementedException();
        // }

        // public bool ValidateRefreshToken(string userId, string refreshToken)
        // {
        //     throw new NotImplementedException();
        // }
    }
}
