using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.NotificationSettings;

public class UpdateNotificationSettingRequestDto
{
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
}