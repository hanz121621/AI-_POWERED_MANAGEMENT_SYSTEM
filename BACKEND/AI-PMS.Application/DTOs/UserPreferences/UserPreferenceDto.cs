namespace AI_PMS.Application.DTOs.UserPreferences;

public class UserPreferenceDto
{
    public Guid UserId { get; set; }

    // =========================================================
    // LANGUAGE
    // =========================================================

    public string LanguagePreference { get; set; } = "en";

    // =========================================================
    // THEME
    // =========================================================

    // "system", "light", "dark", etc.
    // If a custom theme is selected, this can be "custom".
    public string ThemePreference { get; set; } = "system";

    // Selected personal custom theme, if any.
    public Guid? CustomThemeId { get; set; }
}
