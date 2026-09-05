using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AI_PMS.Application.DTOs.AI;
using AI_PMS.Domain.Entities.Tasks;
namespace AI_PMS.Application.Interfaces.AI
{
    public interface IAiSuggestionService
    {
     Task<AiSuggestionResponseDto> GenerateSuggestionForProjectAsync(GenerateAiSuggestionRequestDto request);
        Task<string> TestAiConnectionAsync(string prompt);
        Task<ProjectAiContextDto> GetProjectContextAsync(Guid projectId, Guid managerId);
        Task<AiRiskPredictionDto> PredictProjectRiskAsync(Guid projectId, Guid managerId);
        Task<AiProjectSummaryDto> GenerateProjectSummaryAsync(Guid projectId, Guid managerId);
        
        // 🌟 NEW AI-003 & AI-009 METHODS
        Task<List<AiRecommendationDto>> GenerateProjectRecommendationsAsync(Guid projectId, Guid managerId);
        Task<List<AiBottleneckDto>> DetectProjectBottlenecksAsync(Guid projectId, Guid managerId);
        Task<AiDeadlinePredictionDto> PredictDeadlineAsync(Guid projectId, Guid managerId);
        Task<AiTeamPerformanceDto> AnalyzeTeamPerformanceAsync(Guid projectId, Guid managerId);
Task<AiProgressPredictionDto> PredictProjectProgressAsync(Guid projectId, Guid managerId);
Task<AiSprintPlanningDto> GenerateSprintPlanningSuggestionsAsync(Guid projectId, Guid managerId);
    }
}