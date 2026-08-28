using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface IRiskPredictionService
{
    Task<RiskPredictionResponse> PredictRiskAsync(
        RiskPredictionRequest request);
}