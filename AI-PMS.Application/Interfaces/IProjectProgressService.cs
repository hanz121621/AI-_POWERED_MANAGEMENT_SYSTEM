using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface IProjectProgressService
{
    Task<ProjectProgressResponse> PredictProgressAsync(
        ProjectProgressRequest request);

    Task<ProjectProgressResponse> PredictProgressForProjectAsync(
        Guid projectId);
}