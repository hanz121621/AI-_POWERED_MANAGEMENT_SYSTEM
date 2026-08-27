
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Entities.Teams;

namespace AI_PMS.Application.Interfaces.Repositories.Teams
{
    public interface ITeamProgressRepository
    {
        // =========================================================
        // AUTHORIZATION
        // =========================================================

        Task<Team?> GetAuthorizedTeamAsync(
            Guid teamId,
            Guid managerId);

        Task<Project?> GetAuthorizedProjectAsync(
            Guid teamId,
            Guid managerId);


        // =========================================================
        // TEAM LEADER
        // =========================================================

        Task<TeamMember?> GetTeamLeaderAsync(
            Guid teamId);


        // =========================================================
        // ACTIVE SPRINT
        // =========================================================

        Task<Sprint?> GetActiveSprintAsync(
            Guid teamId);


        // =========================================================
        // SPRINT TASKS
        // =========================================================

        Task<List<TaskItem>> GetSprintTasksAsync(
            Guid sprintId);
    }
}
