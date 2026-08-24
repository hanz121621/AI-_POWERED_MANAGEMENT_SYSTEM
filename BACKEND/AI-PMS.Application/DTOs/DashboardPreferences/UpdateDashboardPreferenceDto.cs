namespace AI_PMS.Application.DTOs.DashboardPreferences;

public class UpdateDashboardPreferenceDto
{
    public bool ShowProjectMetrics { get; set; }

    public bool ShowTaskMetrics { get; set; }

    public bool ShowSprintMetrics { get; set; }

    public bool ShowTeamMetrics { get; set; }

    public bool ShowAIAlerts { get; set; }

    public string DefaultView { get; set; } = "overview";

    public string DefaultFilter { get; set; } = "all";
}