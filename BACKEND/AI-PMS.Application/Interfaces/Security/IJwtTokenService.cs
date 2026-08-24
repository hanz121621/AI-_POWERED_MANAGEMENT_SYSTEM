using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Application.Interfaces.Security;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}
