using AI_PMS.Domain.Entities.Risks;

namespace AI_PMS.Application.Interfaces.Repositories.Risks
{
    public interface IRiskIssueRepository
    {
        // =========================================================
        // GET PROJECT MANAGER
        // Used to verify that the authenticated Manager owns
        // the requested project.
        // =========================================================

        Task<Guid?> GetProjectManagerIdAsync(
            Guid projectId,
            CancellationToken cancellationToken = default);

        // =========================================================
        // GET PROJECT RISKS AND ISSUES
        // =========================================================

        Task<IEnumerable<RiskIssue>> GetByProjectAsync(
            Guid projectId,
            CancellationToken cancellationToken = default);
    }
}
