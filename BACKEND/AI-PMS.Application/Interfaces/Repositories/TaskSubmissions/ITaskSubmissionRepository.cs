using AI_PMS.Domain.Entities.TaskSubmissions;

namespace AI_PMS.Application.Interfaces.Repositories.TaskSubmissions
{
    public interface ITaskSubmissionRepository
    {
        Task AddAsync(TaskSubmission submission);

        Task<TaskSubmission?> GetByIdAsync(Guid id);

        Task<TaskSubmission?> GetLatestByTaskIdAsync(Guid taskId);

        Task<List<TaskSubmission>> GetByTaskIdAsync(Guid taskId);

        Task UpdateAsync(TaskSubmission submission);
    }
}