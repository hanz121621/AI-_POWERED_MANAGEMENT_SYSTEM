using AI_PMS.Application.Interfaces.Repositories.Reports;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Reports
{
    public class SprintProgressRepository : ISprintProgressRepository
    {
        private readonly ApplicationDbContext _context;

        public SprintProgressRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ProjectBelongsToManagerAsync(
            Guid projectId,
            Guid managerId,
            CancellationToken cancellationToken = default)
        {
            return await _context.Projects
                .AsNoTracking()
                .AnyAsync(
                    p =>
                        p.Id == projectId &&
                        p.ManagerId == managerId,
                    cancellationToken);
        }

        public async Task<Sprint?> GetSprintAsync(
            Guid projectId,
            Guid sprintId,
            CancellationToken cancellationToken = default)
        {
            return await _context.Sprints
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    s =>
                        s.Id == sprintId &&
                        s.ProjectId == projectId &&
                        !s.IsDeleted,
                    cancellationToken);
        }

        public async Task<List<TaskItem>> GetSprintTasksAsync(
            Guid sprintId,
            CancellationToken cancellationToken = default)
        {
            return await _context.Tasks
                .AsNoTracking()
                .Where(t => t.SprintId == sprintId)
                .ToListAsync(cancellationToken);
        }
    }
}