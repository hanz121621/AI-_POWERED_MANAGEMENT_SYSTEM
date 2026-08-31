namespace AI_PMS.Application.DTOs.DashboardPreferences;

public class DashboardWidgetDto
{
    public string Key { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public bool IsVisible { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsAvailable { get; set; }
}
