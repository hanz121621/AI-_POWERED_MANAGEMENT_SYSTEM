using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.UserPreferences;

public class UpdateUserPreferenceDto
{
    [Required]
    [MaxLength(20)]
    public string LanguagePreference { get; set; } = "en";

    [Required]
    [MaxLength(20)]
    public string ThemePreference { get; set; } = "system";
}