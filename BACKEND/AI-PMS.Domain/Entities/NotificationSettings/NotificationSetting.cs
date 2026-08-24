using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.NotificationSettings;

public class NotificationSetting
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public bool NotificationsEnabled { get; set; }

    [Required]
    public bool EmailNotificationsEnabled { get; set; }

    [Required]
    public bool InSystemNotificationsEnabled { get; set; }

    [Required]
    public bool TaskAssignmentAlertsEnabled { get; set; }

    [Required]
    public bool ProjectDeadlineRemindersEnabled { get; set; }

    [Required]
    public bool SprintUpdateNotificationsEnabled { get; set; }

    [Required]
    public bool AiRecommendationAlertsEnabled { get; set; }

    [Required]
    public bool UserActivityNotificationsEnabled { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}