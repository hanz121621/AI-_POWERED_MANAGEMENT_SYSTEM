using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;

namespace AI_PMS.Application.Interfaces.Repositories.Teams
{
    // =========================================================
    // TEAM LEADER SPRINT REPOSITORY
    // =========================================================

    public interface ITeamLeaderSprintRepository
    {
        // =====================================================
        // GET SPRINT
        // =====================================================

        Task<Sprint?> GetSprintAsync(
            Guid sprintId);

        // =====================================================
        // GET SPRINT TASKS
        // =====================================================

        Task<List<TaskItem>> GetSprintTasksAsync(
            Guid sprintId);

        // =====================================================
        // VERIFY TEAM LEADER ACCESS
        // =====================================================

        Task<bool> HasTeamLeaderAccessAsync(
            Guid teamId,
            Guid teamLeaderId);

        // =====================================================
        // RECORD SPRINT ACCESS
        // =====================================================

        Task RecordSprintAccessAsync(
            Guid teamLeaderId,
            Guid sprintId);
    }
}