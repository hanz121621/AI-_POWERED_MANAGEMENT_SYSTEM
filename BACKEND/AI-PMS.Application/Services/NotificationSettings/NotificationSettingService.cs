using AI_PMS.Application.DTOs.NotificationSettings;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Repositories.NotificationSettings;
using AI_PMS.Application.Interfaces.NotificationSettings;
using AI_PMS.Domain.Entities.NotificationSettings;

namespace AI_PMS.Application.Services.NotificationSettings;

public class NotificationSettingService
    : INotificationSettingService
{
    private readonly INotificationSettingRepository
        _notificationSettingRepository;

    private readonly IAuditLogService
        _auditLogService;

    public NotificationSettingService(
        INotificationSettingRepository notificationSettingRepository,
        IAuditLogService auditLogService)
    {
        _notificationSettingRepository =
            notificationSettingRepository;

        _auditLogService =
            auditLogService;
    }

    // =========================================================
    // GET MY NOTIFICATION SETTINGS
    // =========================================================

    public async Task<NotificationSettingDto> GetAsync(
        Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new InvalidOperationException(
                "Invalid user identity.");
        }

        var setting =
            await _notificationSettingRepository
                .GetAsync(userId);

        // -----------------------------------------------------
        // CREATE DEFAULT SETTINGS
        // -----------------------------------------------------

        if (setting == null)
        {
            var now = DateTime.UtcNow;

            setting = new NotificationSetting
            {
                Id = Guid.NewGuid(),

                UserId = userId,

                // =================================================
                // GENERAL
                // =================================================

                NotificationsEnabled = true,

                // =================================================
                // CHANNELS
                // =================================================

                EmailNotificationsEnabled = true,

                InSystemNotificationsEnabled = true,

                // =================================================
                // NOTIFICATION TYPES
                // =================================================

                TaskAssignmentAlertsEnabled = true,

                TaskStatusUpdateNotificationsEnabled = true,

                CommentAndMentionNotificationsEnabled = true,

                TeamLeaderMessageNotificationsEnabled = true,

                UserActivityNotificationsEnabled = true,

                SprintUpdateNotificationsEnabled = true,

                ProjectDeadlineRemindersEnabled = true,

                ReviewRequestNotificationsEnabled = true,

                ProjectAnnouncementNotificationsEnabled = true,

                AiRecommendationAlertsEnabled = true,

                // =================================================
                // AUDIT
                // =================================================

                CreatedAt = now,

                UpdatedAt = now
            };

            setting =
                await _notificationSettingRepository
                    .AddAsync(setting);
        }

        return MapToDto(setting);
    }

    // =========================================================
    // UPDATE MY NOTIFICATION SETTINGS
    // =========================================================

    public async Task<NotificationSettingDto> UpdateAsync(
        Guid userId,
        UpdateNotificationSettingRequestDto request)
    {
        if (userId == Guid.Empty)
        {
            throw new InvalidOperationException(
                "Invalid user identity.");
        }

        if (request == null)
        {
            throw new ArgumentNullException(
                nameof(request));
        }

        var setting =
            await _notificationSettingRepository
                .GetAsync(userId);

        // -----------------------------------------------------
        // CREATE IF NOT EXISTS
        // -----------------------------------------------------

        if (setting == null)
        {
            var now = DateTime.UtcNow;

            setting = new NotificationSetting
            {
                Id = Guid.NewGuid(),

                UserId = userId,

                // =================================================
                // GENERAL
                // =================================================

                NotificationsEnabled =
                    request.NotificationsEnabled,

                // =================================================
                // CHANNELS
                // =================================================

                EmailNotificationsEnabled =
                    request.EmailNotificationsEnabled,

                InSystemNotificationsEnabled =
                    request.InSystemNotificationsEnabled,

                // =================================================
                // NOTIFICATION TYPES
                // =================================================

                TaskAssignmentAlertsEnabled =
                    request.TaskAssignmentAlertsEnabled,

                TaskStatusUpdateNotificationsEnabled =
                    request.TaskStatusUpdateNotificationsEnabled,

                CommentAndMentionNotificationsEnabled =
                    request.CommentAndMentionNotificationsEnabled,

                TeamLeaderMessageNotificationsEnabled =
                    request.TeamLeaderMessageNotificationsEnabled,

                UserActivityNotificationsEnabled =
                    request.UserActivityNotificationsEnabled,

                SprintUpdateNotificationsEnabled =
                    request.SprintUpdateNotificationsEnabled,

                ProjectDeadlineRemindersEnabled =
                    request.ProjectDeadlineRemindersEnabled,

                ReviewRequestNotificationsEnabled =
                    request.ReviewRequestNotificationsEnabled,

                ProjectAnnouncementNotificationsEnabled =
                    request.ProjectAnnouncementNotificationsEnabled,

                AiRecommendationAlertsEnabled =
                    request.AiRecommendationAlertsEnabled,

                // =================================================
                // AUDIT
                // =================================================

                CreatedAt = now,

                UpdatedAt = now
            };

            setting =
                await _notificationSettingRepository
                    .AddAsync(setting);
        }
        else
        {
            // =====================================================
            // GENERAL
            // =====================================================

            setting.NotificationsEnabled =
                request.NotificationsEnabled;

            // =====================================================
            // CHANNELS
            // =====================================================

            setting.EmailNotificationsEnabled =
                request.EmailNotificationsEnabled;

            setting.InSystemNotificationsEnabled =
                request.InSystemNotificationsEnabled;

            // =====================================================
            // NOTIFICATION TYPES
            // =====================================================

            setting.TaskAssignmentAlertsEnabled =
                request.TaskAssignmentAlertsEnabled;

            setting.TaskStatusUpdateNotificationsEnabled =
                request.TaskStatusUpdateNotificationsEnabled;

            setting.CommentAndMentionNotificationsEnabled =
                request.CommentAndMentionNotificationsEnabled;

            setting.TeamLeaderMessageNotificationsEnabled =
                request.TeamLeaderMessageNotificationsEnabled;

            setting.UserActivityNotificationsEnabled =
                request.UserActivityNotificationsEnabled;

            setting.SprintUpdateNotificationsEnabled =
                request.SprintUpdateNotificationsEnabled;

            setting.ProjectDeadlineRemindersEnabled =
                request.ProjectDeadlineRemindersEnabled;

            setting.ReviewRequestNotificationsEnabled =
                request.ReviewRequestNotificationsEnabled;

            setting.ProjectAnnouncementNotificationsEnabled =
                request.ProjectAnnouncementNotificationsEnabled;

            setting.AiRecommendationAlertsEnabled =
                request.AiRecommendationAlertsEnabled;

            // =====================================================
            // AUDIT
            // =====================================================

            setting.UpdatedAt =
                DateTime.UtcNow;

            await _notificationSettingRepository
                .UpdateAsync(setting);
        }

        // =====================================================
        // AUDIT LOG
        // =====================================================

        await _auditLogService.CreateAsync(
            userId,
            "NotificationSettingsUpdated",
            "NotificationSetting",
            setting.Id,
            "Notification settings were updated.");

        return MapToDto(setting);
    }

    // =========================================================
    // ENTITY → DTO
    // =========================================================

    private static NotificationSettingDto MapToDto(
        NotificationSetting setting)
    {
        return new NotificationSettingDto
        {
            Id = setting.Id,

            // =================================================
            // GENERAL
            // =================================================

            NotificationsEnabled =
                setting.NotificationsEnabled,

            // =================================================
            // CHANNELS
            // =================================================

            EmailNotificationsEnabled =
                setting.EmailNotificationsEnabled,

            InSystemNotificationsEnabled =
                setting.InSystemNotificationsEnabled,

            // =================================================
            // NOTIFICATION TYPES
            // =================================================

            TaskAssignmentAlertsEnabled =
                setting.TaskAssignmentAlertsEnabled,

            TaskStatusUpdateNotificationsEnabled =
                setting.TaskStatusUpdateNotificationsEnabled,

            CommentAndMentionNotificationsEnabled =
                setting.CommentAndMentionNotificationsEnabled,

            TeamLeaderMessageNotificationsEnabled =
                setting.TeamLeaderMessageNotificationsEnabled,

            UserActivityNotificationsEnabled =
                setting.UserActivityNotificationsEnabled,

            SprintUpdateNotificationsEnabled =
                setting.SprintUpdateNotificationsEnabled,

            ProjectDeadlineRemindersEnabled =
                setting.ProjectDeadlineRemindersEnabled,

            ReviewRequestNotificationsEnabled =
                setting.ReviewRequestNotificationsEnabled,

            ProjectAnnouncementNotificationsEnabled =
                setting.ProjectAnnouncementNotificationsEnabled,

            AiRecommendationAlertsEnabled =
                setting.AiRecommendationAlertsEnabled,

            // =================================================
            // AUDIT
            // =================================================

            CreatedAt =
                setting.CreatedAt,

            UpdatedAt =
                setting.UpdatedAt
        };
    }
}