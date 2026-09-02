using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.NotificationSettings;

public class NotificationSetting
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    // =========================================================
    // OWNER
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

    // Task assignment
    [Required]
    public bool TaskAssignmentAlertsEnabled { get; set; } = true;

    // Task status changes
    [Required]
    public bool TaskStatusUpdateNotificationsEnabled { get; set; } = true;

    // Comments and mentions
    [Required]
    public bool CommentAndMentionNotificationsEnabled { get; set; } = true;

    // Team Leader messages
    [Required]
    public bool TeamLeaderMessageNotificationsEnabled { get; set; } = true;

    // Sprint updates
    [Required]
    public bool SprintUpdateNotificationsEnabled { get; set; } = true;

    // Project deadline reminders
    [Required]
    public bool ProjectDeadlineRemindersEnabled { get; set; } = true;

    // Review requests
    [Required]
    public bool ReviewRequestNotificationsEnabled { get; set; } = true;

    // Project announcements
    [Required]
    public bool ProjectAnnouncementNotificationsEnabled { get; set; } = true;

    // AI recommendations
    [Required]
    public bool AiRecommendationAlertsEnabled { get; set; } = true;

    // General user activity
    [Required]
    public bool UserActivityNotificationsEnabled { get; set; } = true;

    // =========================================================
    // AUDIT
    // =========================================================

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}