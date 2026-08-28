using AI_PMS.Application.Interfaces.UserPreferences;
using AI_PMS.Domain.Entities.UserPreferences;
using AI_PMS.Application.Interfaces.Repositories.UserPreferences;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.UserPreferences;

public class CustomThemeRepository : ICustomThemeRepository
{
    private readonly ApplicationDbContext _context;

    public CustomThemeRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET ALL CUSTOM THEMES FOR USER
    // =========================================================

    public async Task<List<CustomTheme>> GetByUserIdAsync(
        Guid userId)
    {
        return await _context.CustomThemes
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    // =========================================================
    // GET ONE CUSTOM THEME FOR USER
    // =========================================================

    public async Task<CustomTheme?> GetByIdAsync(
        Guid userId,
        Guid themeId)
    {
        return await _context.CustomThemes
            .FirstOrDefaultAsync(x =>
                x.Id == themeId &&
                x.UserId == userId);
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task<CustomTheme> AddAsync(
        CustomTheme theme)
    {
        await _context.CustomThemes.AddAsync(theme);

        await _context.SaveChangesAsync();

        return theme;
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public async Task UpdateAsync(
        CustomTheme theme)
    {
        theme.UpdatedAt = DateTime.UtcNow;

        _context.CustomThemes.Update(theme);

        await _context.SaveChangesAsync();
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task DeleteAsync(
        CustomTheme theme)
    {
        _context.CustomThemes.Remove(theme);

        await _context.SaveChangesAsync();
    }
}