using AI_PMS.Application.DTOs;
namespace AI_PMS.Application.Interfaces;
public interface ITeamLeaderAIService
{
    Task<TeamLeaderAIResponse> AnalyzeProjectAsync(
        Guid projectId);
}
