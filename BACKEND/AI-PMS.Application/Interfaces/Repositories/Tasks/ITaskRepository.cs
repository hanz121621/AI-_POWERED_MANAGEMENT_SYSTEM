using AI_PMS.Domain.Entities.Tasks;

namespace AI_PMS.Application.Interfaces.Repositories.Tasks
{
    public interface ITaskRepository
    {
        Task AddAsync(TaskItem task);

        Task<TaskItem?> GetByIdAsync(Guid id);

        Task<TaskItem?> GetByTitleAsync(
            Guid sprintId,
            string title);

        Task<List<TaskItem>> GetAllAsync();

        Task<List<TaskItem>> GetSprintTasksAsync(
            Guid sprintId);

        Task<List<TaskItem>> GetContributorSDTasksAsync(
           Guid contributorSDId);

        Task UpdateAsync(TaskItem task);

        Task DeleteAsync(TaskItem task);
    }
}
