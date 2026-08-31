
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Entities.Teams;

namespace AI_PMS.Application.Interfaces.Repositories.Teams
{
    public interface ITeamLeaderWorkMonitoringRepository
    {
        Task<Team?> GetAuthorizedTeamAsync(
            Guid teamId,
            Guid managerId);

        Task<TeamMember?> GetTeamLeaderAsync(
            Guid teamId);

        Task<Project?> GetAuthorizedProjectAsync(
            Guid teamId,
            Guid managerId);

        Task<Sprint?> GetActiveSprintAsync(
            Guid teamId);

        Task<List<TaskItem>> GetSprintTasksAsync(
            Guid sprintId);
    }
}

