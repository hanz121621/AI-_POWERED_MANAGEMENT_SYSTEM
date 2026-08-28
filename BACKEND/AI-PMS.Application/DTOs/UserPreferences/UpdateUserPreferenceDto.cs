using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.UserPreferences;

public class UpdateUserPreferenceDto
{
    // =========================================================
    // LANGUAGE
    // =========================================================

    [Required]
    [MaxLength(20)]
    public string LanguagePreference { get; set; } = "en";

    // =========================================================
    // THEME
    // =========================================================

    [Required]
    [MaxLength(20)]
    public string ThemePreference { get; set; } = "system";

    // =========================================================
    // CUSTOM THEME
    // =========================================================

    // Required only when ThemePreference = "custom".
    public Guid? CustomThemeId { get; set; }
}