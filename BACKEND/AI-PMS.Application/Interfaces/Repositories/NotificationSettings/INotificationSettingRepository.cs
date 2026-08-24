using AI_PMS.Domain.Entities.NotificationSettings;

namespace AI_PMS.Application.Interfaces.Repositories.NotificationSettings;

public interface INotificationSettingRepository
{
    Task<NotificationSetting?> GetAsync();

    Task<NotificationSetting> AddAsync(
        NotificationSetting setting);

    Task UpdateAsync(
        NotificationSetting setting);
}