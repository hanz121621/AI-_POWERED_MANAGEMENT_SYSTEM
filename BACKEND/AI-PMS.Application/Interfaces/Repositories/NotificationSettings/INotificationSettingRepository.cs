using AI_PMS.Domain.Entities.NotificationSettings;

namespace AI_PMS.Application.Interfaces.Repositories.NotificationSettings;

public interface INotificationSettingRepository
{
    // =========================================================
    // GET USER SETTINGS
    // =========================================================

    Task<NotificationSetting?> GetAsync(
        Guid userId);

    // =========================================================
    // CREATE
    // =========================================================

    Task<NotificationSetting> AddAsync(
        NotificationSetting setting);

    // =========================================================
    // UPDATE
    // =========================================================

    Task UpdateAsync(
        NotificationSetting setting);
}