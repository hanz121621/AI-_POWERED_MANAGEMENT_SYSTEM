using AI_PMS.Domain.Entities.Auth;

namespace AI_PMS.Application.Interfaces.Repositories.Auth;

public interface IRefreshTokenRepository
{
    Task AddAsync(RefreshToken refreshToken);
    Task<RefreshToken?> GetByTokenAsync(string token);
    Task UpdateAsync(RefreshToken refreshToken);
    Task DeleteAsync(RefreshToken refreshToken);
}

