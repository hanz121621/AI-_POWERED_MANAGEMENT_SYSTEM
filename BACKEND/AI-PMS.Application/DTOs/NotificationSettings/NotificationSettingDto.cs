namespace AI_PMS.Application.DTOs.NotificationSettings;

public class NotificationSettingDto
{
    public Guid Id { get; set; }

    public bool NotificationsEnabled { get; set; }

    public bool EmailNotificationsEnabled { get; set; }

    public bool InSystemNotificationsEnabled { get; set; }

    public bool TaskAssignmentAlertsEnabled { get; set; }

    public bool ProjectDeadlineRemindersEnabled { get; set; }

    public bool SprintUpdateNotificationsEnabled { get; set; }

    public bool AiRecommendationAlertsEnabled { get; set; }

    public bool UserActivityNotificationsEnabled { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}