using AI_PMS.Application.DTOs.NotificationSettings;

namespace AI_PMS.Application.Interfaces.NotificationSettings;

public interface INotificationSettingService
{
    Task<NotificationSettingDto> GetAsync();

    Task<NotificationSettingDto> UpdateAsync(
        UpdateNotificationSettingRequestDto request);
}