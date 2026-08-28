using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.DashboardSettings;

public class DashboardPreference
{
    public Guid Id { get; set; }

    // =========================================================
    // OWNER
    // =========================================================

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    // =========================================================
    // DASHBOARD VIEW
    // =========================================================

    public string DefaultView { get; set; } = "overview";

    public string DefaultFilter { get; set; } = "all";

    // =========================================================
    // WIDGET SETTINGS
    // =========================================================

    public bool ShowProjectProgress { get; set; } = true;

    public bool ShowSprintProgress { get; set; } = true;

    public bool ShowProjectTimeline { get; set; } = true;

    public bool ShowRisksAndIssues { get; set; } = true;

    public bool ShowTeamProgress { get; set; } = true;

    public bool ShowDeadlineInformation { get; set; } = true;

    public bool ShowAIRecommendations { get; set; } = true;

    public bool ShowAIRiskPrediction { get; set; } = true;

    public bool ShowRecentActivity { get; set; } = true;

    public bool ShowNotifications { get; set; } = true;

    // =========================================================
    // TIMESTAMPS
    // =========================================================

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<DashboardPreferenceWidget> Widgets { get; set; }
    = new List<DashboardPreferenceWidget>();
}