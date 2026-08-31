
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
        // CREATE DEFAULT SETTINGS IF NONE EXIST
        // -----------------------------------------------------

        if (setting == null)
        {
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

                ProjectDeadlineRemindersEnabled = true,

                SprintUpdateNotificationsEnabled = true,

                AiRecommendationAlertsEnabled = true,

                UserActivityNotificationsEnabled = true,

                // =================================================
                // AUDIT
                // =================================================

                CreatedAt = DateTime.UtcNow,

                UpdatedAt = DateTime.UtcNow
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
        // CREATE SETTINGS IF NONE EXIST
        // -----------------------------------------------------

        if (setting == null)
        {
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

                ProjectDeadlineRemindersEnabled =
                    request.ProjectDeadlineRemindersEnabled,

                SprintUpdateNotificationsEnabled =
                    request.SprintUpdateNotificationsEnabled,

                AiRecommendationAlertsEnabled =
                    request.AiRecommendationAlertsEnabled,

                UserActivityNotificationsEnabled =
                    request.UserActivityNotificationsEnabled,

                // =================================================
                // AUDIT
                // =================================================

                CreatedAt = DateTime.UtcNow,

                UpdatedAt = DateTime.UtcNow
            };

            setting =
                await _notificationSettingRepository
                    .AddAsync(setting);
        }
        else
        {
            // -------------------------------------------------
            // APPLY USER'S CHANGES
            // -------------------------------------------------

            // =================================================
            // GENERAL
            // =================================================

            setting.NotificationsEnabled =
                request.NotificationsEnabled;

            // =================================================
            // CHANNELS
            // =================================================

            setting.EmailNotificationsEnabled =
                request.EmailNotificationsEnabled;

            setting.InSystemNotificationsEnabled =
                request.InSystemNotificationsEnabled;

            // =================================================
            // NOTIFICATION TYPES
            // =================================================

            setting.TaskAssignmentAlertsEnabled =
                request.TaskAssignmentAlertsEnabled;

            setting.ProjectDeadlineRemindersEnabled =
                request.ProjectDeadlineRemindersEnabled;

            setting.SprintUpdateNotificationsEnabled =
                request.SprintUpdateNotificationsEnabled;

            setting.AiRecommendationAlertsEnabled =
                request.AiRecommendationAlertsEnabled;

            setting.UserActivityNotificationsEnabled =
                request.UserActivityNotificationsEnabled;

            // =================================================
            // AUDIT
            // =================================================

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
            Id =
                setting.Id,

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

            ProjectDeadlineRemindersEnabled =
                setting.ProjectDeadlineRemindersEnabled,

            SprintUpdateNotificationsEnabled =
                setting.SprintUpdateNotificationsEnabled,

            AiRecommendationAlertsEnabled =
                setting.AiRecommendationAlertsEnabled,

            UserActivityNotificationsEnabled =
                setting.UserActivityNotificationsEnabled,

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
