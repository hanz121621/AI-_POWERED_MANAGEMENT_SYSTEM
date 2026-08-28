using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface IAIUsageStatisticsService
{
    Task<AIUsageStatisticsResponse> GetStatisticsAsync(
        CancellationToken cancellationToken = default);
}