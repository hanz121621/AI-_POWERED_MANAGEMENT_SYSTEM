using AI_PMS.Application.DTOs.NotificationSettings;

namespace AI_PMS.Application.Interfaces.NotificationSettings;

public interface INotificationSettingService
{
    // =========================================================
    // GET MY NOTIFICATION SETTINGS
    // =========================================================

    Task<NotificationSettingDto> GetAsync(
        Guid userId);

    // =========================================================
    // UPDATE MY NOTIFICATION SETTINGS
    // =========================================================

    Task<NotificationSettingDto> UpdateAsync(
        Guid userId,
        UpdateNotificationSettingRequestDto request);
}
