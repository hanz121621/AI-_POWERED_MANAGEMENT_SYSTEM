using AI_PMS.Application.DTOs.Sprints;

using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Interfaces.Sprints
{
    public interface ISprintService
    {
        // =========================================================
        // CREATE
        // =========================================================

        Task<(bool Success, string Message)> CreateSprintAsync(
            Guid managerId,
            CreateSprintDto dto);

        // =========================================================
        // GET
        // =========================================================

        Task<IEnumerable<SprintDto>> GetAllSprintsAsync();

        Task<SprintDto?> GetSprintByIdAsync(
            Guid id);

        Task<IEnumerable<SprintDto>> GetProjectSprintsAsync(
            Guid projectId);

        // =========================================================
        // UPDATE
        // =========================================================

        Task<(bool Success, string Message)> UpdateSprintAsync(
            Guid id,
            UpdateSprintDto dto);

        // =========================================================
        // DELETE
        // =========================================================

        Task<bool> DeleteSprintAsync(
            Guid id);

        // =========================================================
        // SPRINT-003
        // ASSIGN SPRINT TO TEAM
        // =========================================================

        Task<(bool Success, string Message)> AssignSprintToTeamAsync(
            Guid managerId,
            Guid sprintId,
            Guid teamId);

  Task<(bool Success, string Message)>
         StartSprintAsync(
        Guid managerId,
        Guid sprintId);

Task<(bool Success, string Message)> CompleteSprintAsync(
    Guid managerId,
    Guid sprintId);

    // =========================================================
// CONTRIBUTOR SPRINT PARTICIPATION
// Developer + Staff
// =========================================================

// DEV-SPRINT-001 / STAFF-SPRINT-001
Task<IEnumerable<SprintDto>> GetMySprintsAsync(
    Guid contributorId);

// DEV-SPRINT-001 / STAFF-SPRINT-001
Task<object?> GetMySprintTasksAsync(
    Guid contributorId,
    Guid sprintId);

// DEV-SPRINT-002 / STAFF-SPRINT-002
Task<SprintProgressDto?> GetMySprintProgressAsync(
    Guid contributorId,
    Guid sprintId);

    // =========================================================
// SPRINT-007
// VIEW SPRINT BACKLOG
// =========================================================

Task<SprintBacklogDto?> GetSprintBacklogAsync(
    Guid managerId,
    Guid sprintId,
    ProjectTaskStatus? status = null,
    string? priority = null,
    Guid? assignedUserId = null,
    DateTime? deadlineFrom = null,
    DateTime? deadlineTo = null,
    string? search = null,
    bool sortDescending = false);
    }

    
}
