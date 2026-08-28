using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface ITeamPerformanceService
{
    Task<TeamPerformanceResponse> AnalyzeTeamPerformanceAsync(
        TeamPerformanceRequest request);

    Task<TeamPerformanceResponse> AnalyzeTeamPerformanceForProjectAsync(
        Guid projectId);
}