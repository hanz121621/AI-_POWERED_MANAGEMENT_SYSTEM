using AI_PMS.Application.DTOs.UserPreferences;
using AI_PMS.Application.Interfaces.Data;
using AI_PMS.Application.Interfaces.UserPreferences;
using AI_PMS.Domain.Entities.UserPreferences;
using AI_PMS.Application.Interfaces.Repositories.UserPreferences;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Application.Services.UserPreferences;

public class UserPreferenceService : IUserPreferenceService
{
    private readonly IApplicationDbContext _context;
    private readonly ICustomThemeRepository _customThemeRepository;

    public UserPreferenceService(
        IApplicationDbContext context,
        ICustomThemeRepository customThemeRepository)
    {
        _context = context;
        _customThemeRepository = customThemeRepository;
    }
                       // =========================================================
// GET SUPPORTED LANGUAGES
// =========================================================

public async Task<List<string>>
    GetSupportedLanguagesAsync()
{
    var systemSetting =
        await _context.SystemSettings
            .AsNoTracking()
            .FirstOrDefaultAsync();

    if (systemSetting == null)
    {
        return new List<string>();
    }

    return systemSetting.AvailableLanguages
        .Split(
            ',',
            StringSplitOptions.RemoveEmptyEntries)
        .Select(x => x.Trim().ToLowerInvariant())
        .Where(x => !string.IsNullOrWhiteSpace(x))
        .Distinct()
        .OrderBy(x => x)
        .ToList();
}
    // =========================================================
    // GET CURRENT USER PREFERENCES
    // =========================================================

    public async Task<UserPreferenceDto> GetAsync(
        Guid userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new KeyNotFoundException(
                "User preferences not found.");
        }

        Guid? customThemeId = null;

        if (user.ThemePreference.Equals(
                "custom",
                StringComparison.OrdinalIgnoreCase))
        {
            var customTheme = await _customThemeRepository
                .GetByUserIdAsync(userId);

            // If there are custom themes, use the first/latest
            // one when no separate selected ID is available yet.
            customThemeId = customTheme
                .OrderByDescending(x => x.UpdatedAt)
                .Select(x => (Guid?)x.Id)
                .FirstOrDefault();
        }

        return new UserPreferenceDto
        {
            UserId = user.Id,

            LanguagePreference =
                user.LanguagePreference,

            ThemePreference =
                user.ThemePreference,

            CustomThemeId =
                customThemeId
        };
    }

    // =========================================================
    // UPDATE LANGUAGE + THEME PREFERENCE
    // =========================================================

    public async Task<UserPreferenceDto> UpdateAsync(
        Guid userId,
        UpdateUserPreferenceDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new KeyNotFoundException(
                "User preferences not found.");
        }

        if (request == null)
        {
            throw new ArgumentNullException(
                nameof(request));
        }

        // =====================================================
        // VALIDATE LANGUAGE
        // =====================================================
        //
        // We will replace this with system-configured
        // language options.
        //

      var language =
    request.LanguagePreference?
        .Trim()
        .ToLowerInvariant();

if (string.IsNullOrWhiteSpace(language))
{
    throw new ArgumentException(
        "Language preference is required.");
}

// =====================================================
// VALIDATE AGAINST SYSTEM SUPPORTED LANGUAGES
// =====================================================

var systemSetting =
    await _context.SystemSettings
        .AsNoTracking()
        .FirstOrDefaultAsync();

if (systemSetting == null)
{
    throw new InvalidOperationException(
        "System language settings are not configured.");
}

var supportedLanguages =
    systemSetting.AvailableLanguages
        .Split(
            ',',
            StringSplitOptions.RemoveEmptyEntries)
        .Select(x => x.Trim().ToLowerInvariant())
        .ToHashSet();

if (!supportedLanguages.Contains(language))
{
    throw new ArgumentException(
        "Selected language is not available.");
}

        // =====================================================
        // VALIDATE THEME
        // =====================================================

        var theme =
            request.ThemePreference.Trim().ToLowerInvariant();

        var supportedSystemThemes = new[]
        {
            "light",
            "dark",
            "system"
        };

        if (!theme.Equals("custom") &&
            !supportedSystemThemes.Contains(theme))
        {
            throw new ArgumentException(
                "Selected theme is unavailable.");
        }

        // =====================================================
        // CUSTOM THEME VALIDATION
        // =====================================================

        if (theme == "custom")
        {
            if (!request.CustomThemeId.HasValue ||
                request.CustomThemeId.Value == Guid.Empty)
            {
                throw new ArgumentException(
                    "A custom theme must be selected.");
            }

            var customTheme =
                await _customThemeRepository.GetByIdAsync(
                    userId,
                    request.CustomThemeId.Value);

            if (customTheme == null)
            {
                throw new ArgumentException(
                    "The selected custom theme does not belong to you.");
            }
        }

        // =====================================================
        // SAVE USER PREFERENCES
        // =====================================================

        user.LanguagePreference = language;
        user.ThemePreference = theme;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new UserPreferenceDto
        {
            UserId = user.Id,

            LanguagePreference =
                user.LanguagePreference,

            ThemePreference =
                user.ThemePreference,

            CustomThemeId =
                theme == "custom"
                    ? request.CustomThemeId
                    : null
        };
    }

    // =========================================================
    // GET MY CUSTOM THEMES
    // =========================================================

    public async Task<List<CustomThemeDto>>
        GetCustomThemesAsync(Guid userId)
    {
        var themes =
            await _customThemeRepository
                .GetByUserIdAsync(userId);

        return themes
            .Select(MapCustomThemeToDto)
            .ToList();
    }

    // =========================================================
    // GET ONE OF MY CUSTOM THEMES
    // =========================================================

    public async Task<CustomThemeDto?>
        GetCustomThemeByIdAsync(
            Guid userId,
            Guid themeId)
    {
        var theme =
            await _customThemeRepository
                .GetByIdAsync(
                    userId,
                    themeId);

        if (theme == null)
        {
            return null;
        }

        return MapCustomThemeToDto(theme);
    }

    // =========================================================
    // CREATE CUSTOM THEME
    // =========================================================

    public async Task<CustomThemeDto>
        CreateCustomThemeAsync(
            Guid userId,
            CreateCustomThemeDto request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(
                nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException(
                "Theme name is required.");
        }

        var name = request.Name.Trim();

        var existingThemes =
            await _customThemeRepository
                .GetByUserIdAsync(userId);

        if (existingThemes.Any(x =>
            x.Name.Equals(
                name,
                StringComparison.OrdinalIgnoreCase)))
        {
            throw new ArgumentException(
                "You already have a custom theme with this name.");
        }

        ValidateColor(
            request.PrimaryColor,
            "Primary color");

        ValidateColor(
            request.BackgroundColor,
            "Background color");

        ValidateColor(
            request.SidebarColor,
            "Sidebar color");

        ValidateColor(
            request.TextColor,
            "Text color");

        var theme = new CustomTheme
        {
            Id = Guid.NewGuid(),

            UserId = userId,

            Name = name,

            PrimaryColor =
                request.PrimaryColor.Trim(),

            BackgroundColor =
                request.BackgroundColor.Trim(),

            SidebarColor =
                request.SidebarColor.Trim(),

            TextColor =
                request.TextColor.Trim(),

            CreatedAt = DateTime.UtcNow,

            UpdatedAt = DateTime.UtcNow
        };

        var created =
            await _customThemeRepository
                .AddAsync(theme);

        return MapCustomThemeToDto(created);
    }

    // =========================================================
    // UPDATE MY CUSTOM THEME
    // =========================================================

    public async Task<CustomThemeDto?>
        UpdateCustomThemeAsync(
            Guid userId,
            Guid themeId,
            UpdateCustomThemeDto request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(
                nameof(request));
        }

        var theme =
            await _customThemeRepository
                .GetByIdAsync(
                    userId,
                    themeId);

        if (theme == null)
        {
            return null;
        }

        var name = request.Name.Trim();

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Theme name is required.");
        }

        var existingThemes =
            await _customThemeRepository
                .GetByUserIdAsync(userId);

        if (existingThemes.Any(x =>
            x.Id != themeId &&
            x.Name.Equals(
                name,
                StringComparison.OrdinalIgnoreCase)))
        {
            throw new ArgumentException(
                "You already have a custom theme with this name.");
        }

        ValidateColor(
            request.PrimaryColor,
            "Primary color");

        ValidateColor(
            request.BackgroundColor,
            "Background color");

        ValidateColor(
            request.SidebarColor,
            "Sidebar color");

        ValidateColor(
            request.TextColor,
            "Text color");

        theme.Name = name;

        theme.PrimaryColor =
            request.PrimaryColor.Trim();

        theme.BackgroundColor =
            request.BackgroundColor.Trim();

        theme.SidebarColor =
            request.SidebarColor.Trim();

        theme.TextColor =
            request.TextColor.Trim();

        theme.UpdatedAt = DateTime.UtcNow;

        await _customThemeRepository
            .UpdateAsync(theme);

        return MapCustomThemeToDto(theme);
    }

    // =========================================================
    // DELETE MY CUSTOM THEME
    // =========================================================

    public async Task<bool>
        DeleteCustomThemeAsync(
            Guid userId,
            Guid themeId)
    {
        var theme =
            await _customThemeRepository
                .GetByIdAsync(
                    userId,
                    themeId);

        if (theme == null)
        {
            return false;
        }

        await _customThemeRepository
            .DeleteAsync(theme);

        return true;
    }

    // =========================================================
    // COLOR VALIDATION
    // =========================================================

    private static void ValidateColor(
        string? color,
        string fieldName)
    {
        if (string.IsNullOrWhiteSpace(color))
        {
            throw new ArgumentException(
                $"{fieldName} is required.");
        }

        var value = color.Trim();

        // Accept:
        // #FFFFFF
        // #000000
        // rgb(...)
        // rgba(...)
        // named CSS colors such as "blue"
        //
        // Detailed frontend color validation can be added later.

        if (value.Length > 20)
        {
            throw new ArgumentException(
                $"{fieldName} is invalid.");
        }
    }

    // =========================================================
    // MAP CUSTOM THEME
    // =========================================================

    private static CustomThemeDto
        MapCustomThemeToDto(
            CustomTheme theme)
    {
        return new CustomThemeDto
        {
            Id = theme.Id,

            UserId = theme.UserId,

            Name = theme.Name,

            PrimaryColor =
                theme.PrimaryColor,

            BackgroundColor =
                theme.BackgroundColor,

            SidebarColor =
                theme.SidebarColor,

            TextColor =
                theme.TextColor,

            CreatedAt =
                theme.CreatedAt,

            UpdatedAt =
                theme.UpdatedAt
        };
    }
}
