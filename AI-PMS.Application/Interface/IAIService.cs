using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface IAIService
{
    Task<AIResponse> GenerateResponseAsync(AIRequest request);
}