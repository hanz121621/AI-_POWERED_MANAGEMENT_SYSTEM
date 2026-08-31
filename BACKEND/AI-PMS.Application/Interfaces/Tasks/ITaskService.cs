using AI_PMS.Application.DTOs.Tasks;
using AI_PMS.Application.DTOs.Users;

namespace AI_PMS.Application.Interfaces.Tasks
{
    public interface ITaskService
    {
        // =========================================================
        // CREATE TASK
        // =========================================================
        Task<bool> CreateTaskAsync(
            Guid managerId,
            CreateTaskDto dto);

        // =========================================================
        // VIEW ALL TASKS
        // =========================================================
        Task<IEnumerable<TaskDto>> GetAllTasksAsync();

        // =========================================================
        // VIEW TASK BY ID
        // =========================================================
        Task<TaskDto?> GetTaskByIdAsync(Guid id);

        // =========================================================
        // VIEW SPRINT TASKS
        // =========================================================
        Task<IEnumerable<TaskDto>> GetSprintTasksAsync(
            Guid sprintId);

        // =========================================================
        // VIEW CONTRIBUTOR TASKS
        // =========================================================
        Task<IEnumerable<TaskDto>> GetContributorSDTasksAsync(
            Guid contributorSDId);

        // =========================================================
        // VIEW MY WORK
        // Developer / Staff
        // =========================================================
        Task<IEnumerable<TaskDto>> GetMyWorkAsync(
            Guid contributorSDId);

        // =========================================================
        // VIEW MY SPRINT TASKS
        // Developer / Staff
        // =========================================================
        Task<object?> GetMySprintTasksAsync(
            Guid userId,
            Guid sprintId);

        // =========================================================
        // GET ASSIGNABLE CONTRIBUTORS
        // =========================================================
        Task<IEnumerable<UserDto>> GetAssignableUsersAsync();

        // =========================================================
        // MANAGER UPDATE TASK
        // =========================================================
        Task<(TaskDto? Task, string Message)> UpdateTaskAsync(
            Guid id,
            UpdateTaskDto dto);

        // =========================================================
        // DEVELOPER / STAFF UPDATE TASK STATUS
        // =========================================================
        Task<(TaskDto? Task, string Message)> UpdateMyTaskStatusAsync(
            Guid userId,
            Guid taskId,
            UpdateTaskStatusDto dto);

        // =========================================================
        // DELETE TASK
        // =========================================================
        Task<bool> DeleteTaskAsync(Guid id);
    }
}