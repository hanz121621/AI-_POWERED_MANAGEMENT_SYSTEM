using AI_PMS.Domain.Entities.UserPreferences;

namespace AI_PMS.Application.Interfaces.Repositories.UserPreferences;

public interface ICustomThemeRepository
{
    // =========================================================
    // GET ALL USER'S CUSTOM THEMES
    // =========================================================

    Task<List<CustomTheme>> GetByUserIdAsync(
        Guid userId);

    // =========================================================
    // GET ONE USER'S CUSTOM THEME
    // =========================================================

    Task<CustomTheme?> GetByIdAsync(
        Guid userId,
        Guid themeId);

        

    // =========================================================
    // CREATE
    // =========================================================

    Task<CustomTheme> AddAsync(
        CustomTheme theme);
            
            
    // =========================================================
    // UPDATE
    // =========================================================

    Task UpdateAsync(
        CustomTheme theme);

    // =========================================================
    // DELETE
    // =========================================================

    Task DeleteAsync(
        CustomTheme theme);
}
