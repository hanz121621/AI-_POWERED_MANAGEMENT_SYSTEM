namespace AI_PMS.Domain.Entities.DashboardSettings;

public class DashboardPreferenceWidget
{
    public Guid Id { get; set; }

    // =========================================================
    // DASHBOARD PREFERENCE
    // =========================================================

    public Guid DashboardPreferenceId { get; set; }

    public DashboardPreference DashboardPreference { get; set; } = null!;

    // =========================================================
    // WIDGET
    // =========================================================

    public string WidgetKey { get; set; } = string.Empty;

    public bool IsVisible { get; set; } = true;

    public int DisplayOrder { get; set; }
}