using AI_PMS.Domain.Entities.Tasks;

namespace AI_PMS.Application.Interfaces.Repositories.Reports
{
    public interface ITeamLeaderTaskHistoryRepository
    {
        Task<bool> IsTeamLeaderAsync(
            Guid userId,
            CancellationToken cancellationToken = default);

        Task<Guid?> GetTeamIdAsync(
            Guid teamLeaderId,
            CancellationToken cancellationToken = default);

        Task<List<TaskItem>> GetTeamTasksAsync(
            Guid teamId,
            CancellationToken cancellationToken = default);

        Task<TaskItem?> GetTeamTaskByIdAsync(
            Guid teamId,
            Guid taskId,
            CancellationToken cancellationToken = default);
    }
}