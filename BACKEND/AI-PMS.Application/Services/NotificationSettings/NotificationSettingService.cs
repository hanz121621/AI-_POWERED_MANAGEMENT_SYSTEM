using AI_PMS.Application.DTOs.NotificationSettings;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Auth;
using AI_PMS.Application.Interfaces.NotificationSettings;
using AI_PMS.Application.Interfaces.Repositories.NotificationSettings;
using AI_PMS.Domain.Entities.NotificationSettings;

namespace AI_PMS.Application.Services.NotificationSettings;

public class NotificationSettingService
    : INotificationSettingService
{
    private readonly INotificationSettingRepository
        _notificationSettingRepository;

    private readonly IAuditLogService
        _auditLogService;

    private readonly ICurrentUserService
        _currentUserService;

    public NotificationSettingService(
        INotificationSettingRepository notificationSettingRepository,
        IAuditLogService auditLogService,
        ICurrentUserService currentUserService)
    {
        _notificationSettingRepository =
            notificationSettingRepository;

        _auditLogService =
            auditLogService;

        _currentUserService =
            currentUserService;
    }

    // =========================================================
    // GET
    // =========================================================

    public async Task<NotificationSettingDto> GetAsync()
    {
        var setting =
            await _notificationSettingRepository.GetAsync();

        if (setting == null)
        {
            setting = new NotificationSetting();

            setting =
                await _notificationSettingRepository
                    .AddAsync(setting);
        }

        return MapToDto(setting);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public async Task<NotificationSettingDto> UpdateAsync(
        UpdateNotificationSettingRequestDto request)
    {
        var setting =
            await _notificationSettingRepository.GetAsync();

        if (setting == null)
        {
            setting = new NotificationSetting();

            setting =
                await _notificationSettingRepository
                    .AddAsync(setting);
        }

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

        // =====================================================
        // AUDIT LOG
        // =====================================================

        var userId =
            _currentUserService.UserId;

        if (userId != Guid.Empty)
        {
            await _auditLogService.CreateAsync(
                userId,
                "NotificationSettingsUpdated",
                "NotificationSetting",
                setting.Id,
                "Notification settings were updated.");
        }

        return MapToDto(setting);
    }

    // =========================================================
    // MAPPING
    // =========================================================

    private static NotificationSettingDto MapToDto(
        NotificationSetting setting)
    {
        return new NotificationSettingDto
        {
            Id = setting.Id,

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