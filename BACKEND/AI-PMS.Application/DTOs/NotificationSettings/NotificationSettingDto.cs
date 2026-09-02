namespace AI_PMS.Application.DTOs.NotificationSettings;

public class NotificationSettingDto
{
    public Guid Id { get; set; }

    // =========================================================
    // GENERAL
    // =========================================================

    public bool NotificationsEnabled { get; set; }

    // =========================================================
    // CHANNELS
    // =========================================================

    public bool EmailNotificationsEnabled { get; set; }

    public bool InSystemNotificationsEnabled { get; set; }

    // =========================================================
    // NOTIFICATION TYPES
    // =========================================================

    public bool TaskAssignmentAlertsEnabled { get; set; }

    public bool TaskStatusUpdateNotificationsEnabled { get; set; }

    public bool CommentAndMentionNotificationsEnabled { get; set; }

    public bool TeamLeaderMessageNotificationsEnabled { get; set; }

    public bool SprintUpdateNotificationsEnabled { get; set; }

    public bool ProjectDeadlineRemindersEnabled { get; set; }

    public bool ReviewRequestNotificationsEnabled { get; set; }

    public bool ProjectAnnouncementNotificationsEnabled { get; set; }

    public bool AiRecommendationAlertsEnabled { get; set; }

    public bool UserActivityNotificationsEnabled { get; set; }

    // =========================================================
    // AUDIT
    // =========================================================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}