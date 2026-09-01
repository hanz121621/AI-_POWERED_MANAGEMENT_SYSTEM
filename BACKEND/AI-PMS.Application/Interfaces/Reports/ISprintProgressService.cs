using AI_PMS.Application.DTOs.Reports;

namespace AI_PMS.Application.Interfaces.Reports
{
    public interface ISprintProgressService
    {
        Task<SprintProgressDto?> GetSprintProgressAsync(
            Guid projectId,
            Guid sprintId,
            Guid managerId,
            CancellationToken cancellationToken = default);
    }
}