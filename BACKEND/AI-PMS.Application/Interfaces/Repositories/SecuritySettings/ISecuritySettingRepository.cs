using AI_PMS.Domain.Entities.SecuritySettings;

namespace AI_PMS.Application.Interfaces.Repositories.SecuritySettings;

public interface ISecuritySettingRepository
{
    Task<SecuritySetting?> GetAsync();

    Task<SecuritySetting> AddAsync(
        SecuritySetting setting);

    Task UpdateAsync(
        SecuritySetting setting);
}