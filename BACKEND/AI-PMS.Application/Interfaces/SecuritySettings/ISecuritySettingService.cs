using AI_PMS.Application.DTOs.SecuritySettings;

namespace AI_PMS.Application.Interfaces.SecuritySettings;

public interface ISecuritySettingService
{
    Task<SecuritySettingDto> GetAsync();

    Task<SecuritySettingDto> UpdateAsync(
        UpdateSecuritySettingRequestDto request);
}