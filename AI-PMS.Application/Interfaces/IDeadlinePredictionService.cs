using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface IDeadlinePredictionService
{
    Task<DeadlinePredictionResponse> PredictDeadlineAsync(
        DeadlinePredictionRequest request);

    Task<DeadlinePredictionResponse> PredictDeadlineForProjectAsync(
        Guid projectId);
}