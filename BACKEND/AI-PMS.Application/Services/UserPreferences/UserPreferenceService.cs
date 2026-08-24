using AI_PMS.Application.DTOs.UserPreferences;
using AI_PMS.Application.Interfaces.Data;
using AI_PMS.Application.Interfaces.UserPreferences;

using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Application.Services.UserPreferences;

public class UserPreferenceService : IUserPreferenceService
{
    private readonly IApplicationDbContext _context;

    public UserPreferenceService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserPreferenceDto> GetAsync(Guid userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new KeyNotFoundException("User preferences not found.");

        return new UserPreferenceDto
        {
            UserId = user.Id,
            LanguagePreference = user.LanguagePreference,
            ThemePreference = user.ThemePreference
        };
    }

    public async Task<UserPreferenceDto> UpdateAsync(
        Guid userId,
        UpdateUserPreferenceDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new KeyNotFoundException("User preferences not found.");

        // =====================================================
        // VALIDATE LANGUAGE
        // =====================================================

        var supportedLanguages = new[]
        {
            "en"
        };

        if (!supportedLanguages.Contains(
                request.LanguagePreference.ToLower()))
        {
            throw new ArgumentException(
                "Selected language is not available.");
        }

        // =====================================================
        // VALIDATE THEME
        // =====================================================

        var supportedThemes = new[]
        {
            "light",
            "dark",
            "system"
        };

        if (!supportedThemes.Contains(
                request.ThemePreference.ToLower()))
        {
            throw new ArgumentException(
                "Selected theme is unavailable.");
        }

        user.LanguagePreference =
            request.LanguagePreference.ToLower();

        user.ThemePreference =
            request.ThemePreference.ToLower();

        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new UserPreferenceDto
        {
            UserId = user.Id,
            LanguagePreference = user.LanguagePreference,
            ThemePreference = user.ThemePreference
        };
    }
}