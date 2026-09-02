using AI_PMS.Domain.Entities.TaskComments;

namespace AI_PMS.Application.Interfaces.Repositories.TaskComments
{
    public interface ITaskCommentRepository
    {
        Task AddAsync(TaskComment comment);

        Task<TaskComment?> GetByIdAsync(Guid id);

        Task<List<TaskComment>> GetByTaskIdAsync(Guid taskId);

        Task UpdateAsync(TaskComment comment);

        Task SoftDeleteAsync(TaskComment comment);
    }
}