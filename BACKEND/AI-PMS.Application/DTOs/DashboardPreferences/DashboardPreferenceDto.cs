namespace AI_PMS.Application.DTOs.DashboardPreferences;

public class DashboardPreferenceDto
{
    public Guid UserId { get; set; }

    // =========================================================
    // DASHBOARD VIEW
    // =========================================================

    public string DefaultView { get; set; } = "overview";

    public string DefaultFilter { get; set; } = "all";

    // =========================================================
    // WIDGET VISIBILITY
    // =========================================================

    public bool ShowProjectProgress { get; set; }

    public bool ShowSprintProgress { get; set; }

    public bool ShowProjectTimeline { get; set; }

    public bool ShowRisksAndIssues { get; set; }

    public bool ShowTeamProgress { get; set; }

    public bool ShowDeadlineInformation { get; set; }

    public bool ShowAIRecommendations { get; set; }

    public bool ShowAIRiskPrediction { get; set; }

    public bool ShowRecentActivity { get; set; }

    public bool ShowNotifications { get; set; }

    // =========================================================
    // AVAILABLE WIDGETS
    // =========================================================

    public List<DashboardWidgetDto> AvailableWidgets { get; set; }
        = new();

    // =========================================================
    // LAST UPDATED
    // =========================================================

    public DateTime? UpdatedAt { get; set; }
}