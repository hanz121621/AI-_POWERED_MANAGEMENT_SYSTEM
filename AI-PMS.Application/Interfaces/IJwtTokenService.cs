using AI_PMS.Domain.Entities;

namespace AI_PMS.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}