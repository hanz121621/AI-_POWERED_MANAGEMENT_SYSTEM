using System.Security.Cryptography;
using AI_PMS.Application.Interfaces.Security;

namespace AI_PMS.Infrastructure.Security
{
   public class RefreshTokenService : IRefreshTokenService
    {
        public string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];

            using var rng = RandomNumberGenerator.Create();

            rng.GetBytes(randomBytes);

            return Convert.ToBase64String(randomBytes);
        }
    }
}