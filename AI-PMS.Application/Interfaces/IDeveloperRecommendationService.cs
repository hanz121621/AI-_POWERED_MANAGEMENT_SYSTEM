using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface IDeveloperRecommendationService
{
    Task<DeveloperRecommendationResponse>
        GetRecommendationsAsync(
            DeveloperRecommendationRequest request);
}