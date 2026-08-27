using AI_PMS.Application.Interfaces.Repositories.Risks;
using AI_PMS.Domain.Entities.Risks;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Risks
{
    public class RiskIssueRepository : IRiskIssueRepository
    {
        private readonly ApplicationDbContext _context;

        public RiskIssueRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // GET PROJECT MANAGER
        // =========================================================

        public async Task<Guid?> GetProjectManagerIdAsync(
            Guid projectId,
            CancellationToken cancellationToken = default)
        {
            return await _context.Projects
                .AsNoTracking()
                .Where(p => p.Id == projectId)
                .Select(p => p.ManagerId)
                .FirstOrDefaultAsync(cancellationToken);
        }

        // =========================================================
        // GET PROJECT RISKS AND ISSUES
        // =========================================================

        public async Task<IEnumerable<RiskIssue>> GetByProjectAsync(
            Guid projectId,
            CancellationToken cancellationToken = default)
        {
            return await _context.RiskIssues
                .AsNoTracking()

                // Risk / Issue configurable values
                .Include(x => x.Type)
                .Include(x => x.Severity)
                .Include(x => x.Priority)
                .Include(x => x.Status)

                // Reporter / resolver
                .Include(x => x.ReportedBy)
                .Include(x => x.ResolvedBy)

                // Related Sprint
                .Include(x => x.Sprint)

                // Related Task
                .Include(x => x.Task)

                // Only records belonging to requested project
                .Where(x => x.ProjectId == projectId)

                // Latest reports first
                .OrderByDescending(x => x.ReportedAt)

                .ToListAsync(cancellationToken);
        }
    }
}