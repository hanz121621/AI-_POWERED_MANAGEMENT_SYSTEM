using AI_PMS.Application.DTOs.UserPreferences;

namespace AI_PMS.Application.Interfaces.UserPreferences;

public interface IUserPreferenceService
{
    Task<UserPreferenceDto> GetAsync(Guid userId);

    Task<UserPreferenceDto> UpdateAsync(
        Guid userId,
        UpdateUserPreferenceDto request);
}