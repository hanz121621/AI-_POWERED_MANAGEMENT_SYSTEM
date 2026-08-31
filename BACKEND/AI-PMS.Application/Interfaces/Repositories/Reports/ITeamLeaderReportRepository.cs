using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Entities.Teams;

namespace AI_PMS.Application.Interfaces.Repositories.Reports
{
    public interface ITeamLeaderReportRepository
    {
        // =========================================================
        // TEAM LEADER AUTHORIZATION
        // =========================================================

        Task<TeamMember?> GetTeamLeaderMembershipAsync(
            Guid teamLeaderId);

        // =========================================================
        // TEAM
        // =========================================================

        Task<Team?> GetTeamWithMembersAsync(
            Guid teamId);

        // =========================================================
        // PROJECT
        // =========================================================

        Task<Project?> GetProjectForTeamAsync(
            Guid projectId,
            Guid teamId);

        Task<List<Project>> GetTeamProjectsAsync(
            Guid teamId);

        // =========================================================
        // TASKS
        // =========================================================

        Task<List<TaskItem>> GetTeamTasksAsync(
            Guid teamId);

        Task<List<TaskItem>> GetProjectTasksAsync(
            Guid projectId);

        // =========================================================
        // TASK AUTHORIZATION
        // =========================================================

        Task<TaskItem?> GetTeamTaskAsync(
            Guid taskId,
            Guid teamId);
    }
}