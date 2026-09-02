using AI_PMS.Application.DTOs.Tasks;

namespace AI_PMS.Application.Interfaces.Tasks
{
    public interface ITeamLeaderTaskService
    {
        // =========================================================
        // TASK-001
        // CREATE TASK
        // =========================================================

        Task<(bool Success, string Message, TaskDto? Task)>
            CreateTaskAsync(
                Guid teamLeaderId,
                CreateTeamLeaderTaskDto dto);

        // =========================================================
        // TASK-002
        // UPDATE TASK
        // =========================================================

        Task<(bool Success, string Message, TaskDto? Task)>
            UpdateTaskAsync(
                Guid teamLeaderId,
                Guid taskId,
                UpdateTeamLeaderTaskDto dto);

        // =========================================================
        // TASK-003
        // DELETE TASK
        // =========================================================

        Task<(bool Success, string Message)>
            DeleteTaskAsync(
                Guid teamLeaderId,
                Guid taskId);

        // =========================================================
        // TASK-004
        // ASSIGN TASK TO CONTRIBUTOR
        // =========================================================

        Task<(bool Success, string Message, TaskDto? Task)>
            AssignTaskAsync(
                Guid teamLeaderId,
                Guid taskId,
                Guid contributorId);

                Task<(bool Success, string Message, TaskDto? Task)>
    SetTaskPriorityAsync(
        Guid teamLeaderId,
        Guid taskId,
        SetTaskPriorityDto dto);

        Task<(bool Success, string Message, TaskDto? Task)>
    SetTaskDeadlineAsync(
        Guid teamLeaderId,
        Guid taskId,
        SetTaskDeadlineDto dto);

        // =========================================================
// TASK-007
// VIEW TASKS
// TEAM LEADER
// =========================================================

Task<(bool Success, string Message, List<TaskDto> Tasks)>
    GetTeamLeaderTasksAsync(
        Guid teamLeaderId,
        Guid sprintId);

// =========================================================
// TASK-008
// UPDATE TASK STATUS
// TEAM LEADER
// =========================================================

Task<(bool Success, string Message, TaskDto? Task)>
    UpdateTaskStatusAsync(
        Guid teamLeaderId,
        Guid taskId,
        UpdateTaskStatusDto dto);
    }
}