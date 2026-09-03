using AI_PMS.Application.DTOs.SubTasks;

namespace AI_PMS.Application.Interfaces.SubTasks
{
    public interface ISubTaskService
    {
        Task<SubTaskUpdateResult> CreateSubTaskAsync(
            CreateSubTaskDto dto);

        Task<IEnumerable<SubTaskDto>> GetAllSubTasksAsync();

        Task<SubTaskDto?> GetSubTaskByIdAsync(Guid id);

        Task<IEnumerable<SubTaskDto>> GetTaskSubTasksAsync(
            Guid taskId);

        Task<SubTaskUpdateResult> UpdateSubTaskAsync(
            Guid id,
            UpdateSubTaskDto dto);

        Task<(bool Success, string Message)> DeleteSubTaskAsync(
            Guid id);

        // =========================================================
        // CONTRIBUTOR / DEVELOPER ACCESS
        // =========================================================

        Task<bool> CanContributorAccessSubTaskAsync(
            Guid userId,
            Guid subTaskId);

        Task<(
            IEnumerable<SubTaskDto> SubTasks,
            bool Success,
            string Message
        )> GetMyTaskSubTasksAsync(
            Guid userId,
            Guid taskId);

        Task<(SubTaskDto? SubTask, string Message)>
            UpdateMyAISubTaskStatusAsync(
                Guid userId,
                Guid subTaskId,
                UpdateAISubTaskStatusDto dto);
    }
}