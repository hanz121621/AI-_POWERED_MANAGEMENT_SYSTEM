using AI_PMS.Application.DTOs.AIPreferences;
using AI_PMS.Application.DTOs.DashboardPreferences;

namespace AI_PMS.Application.Interfaces.Preferences;

public interface IPreferenceService
{
    Task<DashboardPreferenceDto> GetDashboardPreferenceAsync(
        Guid userId);

    Task<DashboardPreferenceDto> UpdateDashboardPreferenceAsync(
        Guid userId,
        UpdateDashboardPreferenceDto dto);

    Task<AIPreferenceDto> GetAIPreferenceAsync(
        Guid userId);

    Task<AIPreferenceDto> UpdateAIPreferenceAsync(
        Guid userId,
        UpdateAIPreferenceDto dto);
}