using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface ITaskAnalysisService
{
    Task<TaskAnalysisResponse> AnalyzeTaskAsync(
        TaskAnalysisRequest request);
}