namespace AI_PMS.Application.DTOs.UserPreferences;

public class CustomThemeDto
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string PrimaryColor { get; set; } = string.Empty;

    public string BackgroundColor { get; set; } = string.Empty;

    public string SidebarColor { get; set; } = string.Empty;

    public string TextColor { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
