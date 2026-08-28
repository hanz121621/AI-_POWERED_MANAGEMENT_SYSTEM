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

                NotificationsEnabled = true,

                EmailNotificationsEnabled = true,

                InSystemNotificationsEnabled = true,

                TaskAssignmentAlertsEnabled = true,

                ProjectDeadlineRemindersEnabled = true,

                SprintUpdateNotificationsEnabled = true,

                AiRecommendationAlertsEnabled = true,

                UserActivityNotificationsEnabled = true,

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
        // CREATE DEFAULT SETTINGS IF NONE EXIST
        // -----------------------------------------------------

        if (setting == null)
        {
            setting = new NotificationSetting
            {
                Id = Guid.NewGuid(),

                UserId = userId,

                NotificationsEnabled =
                    request.NotificationsEnabled,

                EmailNotificationsEnabled =
                    request.EmailNotificationsEnabled,

                InSystemNotificationsEnabled =
                    request.InSystemNotificationsEnabled,

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

            setting.NotificationsEnabled =
                request.NotificationsEnabled;

            setting.EmailNotificationsEnabled =
                request.EmailNotificationsEnabled;

            setting.InSystemNotificationsEnabled =
                request.InSystemNotificationsEnabled;

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

            NotificationsEnabled =
                setting.NotificationsEnabled,

            EmailNotificationsEnabled =
                setting.EmailNotificationsEnabled,

            InSystemNotificationsEnabled =
                setting.InSystemNotificationsEnabled,

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

            CreatedAt =
                setting.CreatedAt,

            UpdatedAt =
                setting.UpdatedAt
        };
    }
}