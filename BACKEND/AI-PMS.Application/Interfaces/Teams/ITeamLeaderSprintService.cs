using AI_PMS.Application.DTOs.Teams;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Interfaces.Teams
{
    // =========================================================
    // TEAM LEADER SPRINT SERVICE
    // =========================================================

    public interface ITeamLeaderSprintService
    {
        // =========================================================
        // TL-SPRINT-001
        // VIEW SPRINT TASKS
        // =========================================================

        Task<TeamLeaderSprintTasksDto?>
            GetSprintTasksAsync(
                Guid teamLeaderId,
                Guid sprintId,
                ProjectTaskStatus? status = null,
                string? priority = null,
                Guid? assignedUserId = null,
                DateTime? deadlineFrom = null,
                DateTime? deadlineTo = null,
                string? search = null,
                bool sortDescending = false);

        // =========================================================
        // TL-SPRINT-002
        // VIEW SPRINT GOALS AND PROGRESS
        // =========================================================

        Task<TeamLeaderSprintProgressDto?>
            GetSprintProgressAsync(
                Guid teamLeaderId,
                Guid sprintId);
    }
}