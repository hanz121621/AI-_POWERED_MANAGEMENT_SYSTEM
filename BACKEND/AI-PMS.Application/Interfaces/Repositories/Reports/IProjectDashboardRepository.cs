using AI_PMS.Domain.Entities.Activities;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Entities.Teams;

namespace AI_PMS.Application.Interfaces.Repositories.Reports
{
    public interface IProjectDashboardRepository
    {
        Task<Project?> GetAuthorizedProjectAsync(
            Guid projectId,
            Guid managerId);

        Task<Sprint?> GetActiveSprintAsync(
            Guid projectId);

        Task<List<Sprint>> GetProjectSprintsAsync(
            Guid projectId);

        Task<List<TaskItem>> GetProjectTasksAsync(
            Guid projectId);

        Task<Team?> GetProjectTeamAsync(
            Guid projectId);

        Task<TeamMember?> GetTeamLeaderAsync(
            Guid teamId);

        Task<List<ActivityLog>> GetProjectActivitiesAsync(
            Guid projectId);
    }
}
