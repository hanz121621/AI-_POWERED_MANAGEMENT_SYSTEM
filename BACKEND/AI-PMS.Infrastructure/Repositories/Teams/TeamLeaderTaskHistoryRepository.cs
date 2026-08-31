using AI_PMS.Application.Interfaces.Repositories.Reports;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Reports
{
    public class TeamLeaderTaskHistoryRepository
        : ITeamLeaderTaskHistoryRepository
    {
        private readonly ApplicationDbContext _context;

        public TeamLeaderTaskHistoryRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // VERIFY TEAM LEADER
        // =========================================================

        public async Task<bool> IsTeamLeaderAsync(
            Guid userId,
            CancellationToken cancellationToken = default)
        {
            return await _context.TeamMembers
                .AsNoTracking()
                .AnyAsync(tm =>
                    tm.UserId == userId &&
                    tm.IsTeamLeader &&
                    tm.IsActive &&
                    tm.User != null &&
                    tm.User.IsActive,
                    cancellationToken);
        }

        // =========================================================
        // GET TEAM ID
        // =========================================================

        public async Task<Guid?> GetTeamIdAsync(
            Guid teamLeaderId,
            CancellationToken cancellationToken = default)
        {
            return await _context.TeamMembers
                .AsNoTracking()
                .Where(tm =>
                    tm.UserId == teamLeaderId &&
                    tm.IsTeamLeader &&
                    tm.IsActive)
                .Select(tm => (Guid?)tm.TeamId)
                .FirstOrDefaultAsync(cancellationToken);
        }

        // =========================================================
        // TEAM TASKS
        // =========================================================

        public async Task<List<TaskItem>> GetTeamTasksAsync(
            Guid teamId,
            CancellationToken cancellationToken = default)
        {
            return await _context.Tasks
                .AsNoTracking()
                .Where(task =>
                    _context.Sprints.Any(s =>
                        s.Id == task.SprintId &&
                        !s.IsDeleted &&
                        _context.Projects.Any(p =>
                            p.Id == s.ProjectId &&
                            p.TeamId == teamId)))
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        // =========================================================
        // SINGLE TEAM TASK
        // =========================================================

        public async Task<TaskItem?> GetTeamTaskByIdAsync(
            Guid teamId,
            Guid taskId,
            CancellationToken cancellationToken = default)
        {
            return await _context.Tasks
                .AsNoTracking()
                .Where(task =>
                    task.Id == taskId &&
                    _context.Sprints.Any(s =>
                        s.Id == task.SprintId &&
                        !s.IsDeleted &&
                        _context.Projects.Any(p =>
                            p.Id == s.ProjectId &&
                            p.TeamId == teamId)))
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}