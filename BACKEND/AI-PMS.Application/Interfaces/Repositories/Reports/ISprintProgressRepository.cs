using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;

namespace AI_PMS.Application.Interfaces.Repositories.Reports
{
    public interface ISprintProgressRepository
    {
        Task<Sprint?> GetSprintAsync(
            Guid projectId,
            Guid sprintId,
            CancellationToken cancellationToken = default);

        Task<List<TaskItem>> GetSprintTasksAsync(
            Guid sprintId,
            CancellationToken cancellationToken = default);

        Task<bool> ProjectBelongsToManagerAsync(
            Guid projectId,
            Guid managerId,
            CancellationToken cancellationToken = default);
    }
}
