using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface IRecommendationService
{
    Task<RecommendationResponse> GetRecommendationsAsync(
        RecommendationRequest request);
}