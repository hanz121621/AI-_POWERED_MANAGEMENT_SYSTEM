using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.DashboardSettings;

public class DashboardPreference
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    public bool ShowProjectMetrics { get; set; } = true;

    public bool ShowTaskMetrics { get; set; } = true;

    public bool ShowSprintMetrics { get; set; } = true;

    public bool ShowTeamMetrics { get; set; } = true;

    public bool ShowAIAlerts { get; set; } = true;

    public string DefaultView { get; set; } = "overview";

    public string DefaultFilter { get; set; } = "all";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}