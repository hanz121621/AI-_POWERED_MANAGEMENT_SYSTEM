using AI_PMS.Application.DTOs.Risks;

namespace AI_PMS.Application.Interfaces.Risks
{
    public interface IRiskIssueService
    {
        Task<IEnumerable<RiskIssueDto>> GetProjectRisksAndIssuesAsync(
            Guid projectId,
            Guid managerId,
            RiskIssueFilterDto? filter = null,
            CancellationToken cancellationToken = default);
    }
}