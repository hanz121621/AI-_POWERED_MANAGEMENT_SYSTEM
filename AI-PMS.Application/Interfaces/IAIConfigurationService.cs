using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface IAIConfigurationService
{
    Task<AIConfigurationDto?> GetAsync(
        CancellationToken cancellationToken = default);

    Task<AIConfigurationDto> UpdateAsync(
        AIConfigurationDto dto,
        CancellationToken cancellationToken = default);
}