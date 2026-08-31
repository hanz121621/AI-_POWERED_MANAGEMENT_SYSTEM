using AI_PMS.Application.DTOs.UserPreferences;

namespace AI_PMS.Application.Interfaces.UserPreferences;

public interface IUserPreferenceService
{

         // =========================================================
// GET SUPPORTED LANGUAGES
// =========================================================

Task<List<string>> GetSupportedLanguagesAsync();

    // =========================================================
    // GET USER PREFERENCES
    // =========================================================
 
    Task<UserPreferenceDto> GetAsync(
        Guid userId);

    // =========================================================
    // UPDATE USER PREFERENCES
    // =========================================================

    Task<UserPreferenceDto> UpdateAsync(
        Guid userId,
        UpdateUserPreferenceDto request);

    // =========================================================
    // GET MY CUSTOM THEMES
    // =========================================================

    Task<List<CustomThemeDto>> GetCustomThemesAsync(
        Guid userId);

    // =========================================================
    // GET ONE CUSTOM THEME
    // =========================================================

    Task<CustomThemeDto?> GetCustomThemeByIdAsync(
        Guid userId,
        Guid themeId);

    // =========================================================
    // CREATE CUSTOM THEME
    // =========================================================

    Task<CustomThemeDto> CreateCustomThemeAsync(
        Guid userId,
        CreateCustomThemeDto request);

    // =========================================================
    // UPDATE CUSTOM THEME
    // =========================================================

    Task<CustomThemeDto?> UpdateCustomThemeAsync(
        Guid userId,
        Guid themeId,
        UpdateCustomThemeDto request);

    // =========================================================
    // DELETE CUSTOM THEME
    // =========================================================

    Task<bool> DeleteCustomThemeAsync(
        Guid userId,
        Guid themeId);
}
