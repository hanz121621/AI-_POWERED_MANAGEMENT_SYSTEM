
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;

namespace AI_PMS.Application.Interfaces.Repositories.Reports
{
    public interface IProjectTimelineRepository
    {
        // =========================================================
        // AUTHORIZATION
        // =========================================================

        Task<Project?> GetAuthorizedProjectAsync(
            Guid projectId,
            Guid managerId);

        // =========================================================
        // SPRINTS
        // =========================================================

        Task<List<Sprint>> GetProjectSprintsAsync(
            Guid projectId);

        // =========================================================
        // TASKS
        // =========================================================

        Task<List<TaskItem>> GetProjectTasksAsync(
            Guid projectId);
    }
}
