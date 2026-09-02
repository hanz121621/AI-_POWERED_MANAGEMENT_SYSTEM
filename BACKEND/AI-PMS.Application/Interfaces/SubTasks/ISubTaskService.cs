using AI_PMS.Application.DTOs.SubTasks;

namespace AI_PMS.Application.Interfaces.SubTasks
{
    public interface ISubTaskService
    {
        // =========================================================
        // CREATE SUBTASK
        // =========================================================
        Task<SubTaskUpdateResult> CreateSubTaskAsync(
            CreateSubTaskDto dto);

        // =========================================================
        // GET ALL SUBTASKS
        // =========================================================
        Task<IEnumerable<SubTaskDto>> GetAllSubTasksAsync();

        // =========================================================
        // GET SUBTASK BY ID
        // =========================================================
        Task<SubTaskDto?> GetSubTaskByIdAsync(
            Guid id);

        // =========================================================
        // GET SUBTASKS BY TASK
        // =========================================================
        Task<IEnumerable<SubTaskDto>> GetTaskSubTasksAsync(
            Guid taskId);

        // =========================================================
        // UPDATE SUBTASK
        // =========================================================
        Task<SubTaskUpdateResult> UpdateSubTaskAsync(
            Guid id,
            UpdateSubTaskDto dto);

        // =========================================================
        // SOFT DELETE SUBTASK
        // =========================================================
        Task<(bool Success, string Message)> DeleteSubTaskAsync(
            Guid id);
    }
}
