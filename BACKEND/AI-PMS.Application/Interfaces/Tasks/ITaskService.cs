using AI_PMS.Application.DTOs.Tasks;
using AI_PMS.Application.DTOs.Users;

namespace AI_PMS.Application.Interfaces.Tasks
{
    public interface ITaskService
    {
       Task<bool> CreateTaskAsync(
    Guid managerId,
    CreateTaskDto dto);

        Task<IEnumerable<TaskDto>> GetAllTasksAsync();

        Task<TaskDto?> GetTaskByIdAsync(Guid id);
        Task<string?> GenerateTaskSuggestionAsync(Guid taskId);
        Task<IEnumerable<TaskDto>> GetSprintTasksAsync(Guid sprintId);

        Task<IEnumerable<TaskDto>> GetDeveloperTasksAsync(Guid developerId);

        Task<IEnumerable<UserDto>> GetAssignableUsersAsync();

        Task<(TaskDto? Task, string Message)> UpdateTaskAsync(
            Guid id,
            UpdateTaskDto dto);

        Task<bool> DeleteTaskAsync(Guid id);
    }
}