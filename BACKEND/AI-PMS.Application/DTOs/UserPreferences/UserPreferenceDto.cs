namespace AI_PMS.Application.DTOs.UserPreferences;

public class UserPreferenceDto
{
    public Guid UserId { get; set; }

    public string LanguagePreference { get; set; } = "en";

    public string ThemePreference { get; set; } = "system";
}