using AI_PMS.Domain.Entities.SubTasks;

namespace AI_PMS.Application.Interfaces.Repositories.SubTasks
{
    public interface ISubTaskRepository
    {
        Task AddAsync(SubTask subTask);

        Task<SubTask?> GetByIdAsync(Guid id);

        Task<SubTask?> GetByTitleAsync(
            Guid taskId,
            string title);

        Task<List<SubTask>> GetAllAsync();

        Task<List<SubTask>> GetByTaskIdAsync(
            Guid taskId);

        Task UpdateAsync(SubTask subTask);

        Task SoftDeleteAsync(SubTask subTask);
    }
}