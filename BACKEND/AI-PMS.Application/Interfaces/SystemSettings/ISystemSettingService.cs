using AI_PMS.Application.DTOs.SystemSettings;

namespace AI_PMS.Application.Interfaces.SystemSettings;

public interface ISystemSettingService
{
    Task<SystemSettingDto> GetAsync();

    Task<SystemSettingDto> UpdateAsync(
        UpdateSystemSettingRequestDto request);
}
