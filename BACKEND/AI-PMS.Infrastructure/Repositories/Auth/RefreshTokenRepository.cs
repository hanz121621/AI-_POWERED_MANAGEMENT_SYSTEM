using AI_PMS.Application.Interfaces.Repositories.Auth;
using AI_PMS.Domain.Entities.Auth;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Auth;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly ApplicationDbContext _context;

    public RefreshTokenRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task AddAsync(
        RefreshToken refreshToken)
    {
        await _context.RefreshTokens.AddAsync(
            refreshToken);

        await _context.SaveChangesAsync();
    }

    // =========================================================
    // GET BY TOKEN
    // =========================================================

    public async Task<RefreshToken?> GetByTokenAsync(
        string token)
    {
        return await _context.RefreshTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(
                x => x.Token == token);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public async Task UpdateAsync(
        RefreshToken refreshToken)
    {
        _context.RefreshTokens.Update(
            refreshToken);

        await _context.SaveChangesAsync();
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task DeleteAsync(
        RefreshToken refreshToken)
    {
        _context.RefreshTokens.Remove(
            refreshToken);

        await _context.SaveChangesAsync();
    }
}