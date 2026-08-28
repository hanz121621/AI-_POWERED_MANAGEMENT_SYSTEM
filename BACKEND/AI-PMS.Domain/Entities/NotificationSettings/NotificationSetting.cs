using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.NotificationSettings;

public class NotificationSetting
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    // =========================================================
    // OWNER
    // Each authenticated user has their own settings
    // =========================================================

    [Required]
    public Guid UserId { get; set; }

    public User? User { get; set; }

    // =========================================================
    // GENERAL NOTIFICATIONS
    // =========================================================

    [Required]
    public bool NotificationsEnabled { get; set; } = true;

    // =========================================================
    // NOTIFICATION CHANNELS
    // =========================================================

    [Required]
    public bool EmailNotificationsEnabled { get; set; } = true;

    [Required]
    public bool InSystemNotificationsEnabled { get; set; } = true;

    // =========================================================
    // NOTIFICATION TYPES
    // =========================================================

    [Required]
    public bool TaskAssignmentAlertsEnabled { get; set; } = true;

    [Required]
    public bool ProjectDeadlineRemindersEnabled { get; set; } = true;

    [Required]
    public bool SprintUpdateNotificationsEnabled { get; set; } = true;

    [Required]
    public bool AiRecommendationAlertsEnabled { get; set; } = true;

    [Required]
    public bool UserActivityNotificationsEnabled { get; set; } = true;

    // =========================================================
    // AUDIT
    // =========================================================

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}