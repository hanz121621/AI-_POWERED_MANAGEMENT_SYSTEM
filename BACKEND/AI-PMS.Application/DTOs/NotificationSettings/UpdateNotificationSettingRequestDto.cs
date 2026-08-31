using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.NotificationSettings;

public class UpdateNotificationSettingRequestDto
{
    // =========================================================
    // GENERAL
    // =========================================================

    [Required]
    public bool NotificationsEnabled { get; set; }

    // =========================================================
    // CHANNELS
    // =========================================================

    [Required]
    public bool EmailNotificationsEnabled { get; set; }

    [Required]
    public bool InSystemNotificationsEnabled { get; set; }

    // =========================================================
    // NOTIFICATION TYPES
    // =========================================================

    [Required]
    public bool TaskAssignmentAlertsEnabled { get; set; }

    [Required]
    public bool TaskStatusUpdateNotificationsEnabled { get; set; }

    [Required]
    public bool CommentAndMentionNotificationsEnabled { get; set; }

    [Required]
    public bool TeamLeaderMessageNotificationsEnabled { get; set; }

    [Required]
    public bool SprintUpdateNotificationsEnabled { get; set; }

    [Required]
    public bool ProjectDeadlineRemindersEnabled { get; set; }

    [Required]
    public bool ReviewRequestNotificationsEnabled { get; set; }

    [Required]
    public bool ProjectAnnouncementNotificationsEnabled { get; set; }

    [Required]
    public bool AiRecommendationAlertsEnabled { get; set; }

    [Required]
    public bool UserActivityNotificationsEnabled { get; set; }
}