using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Teams
{
    // =========================================================
    // TEAM LEADER SPRINT REPOSITORY
    // =========================================================

    public class TeamLeaderSprintRepository
        : ITeamLeaderSprintRepository
    {
        private readonly ApplicationDbContext _context;

        public TeamLeaderSprintRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // GET SPRINT
        // =====================================================

        public async Task<Sprint?> GetSprintAsync(
            Guid sprintId)
        {
            return await _context.Sprints
                .AsNoTracking()
                .FirstOrDefaultAsync(s =>
                    s.Id == sprintId &&
                    !s.IsDeleted);
        }

        // =====================================================
        // GET SPRINT TASKS
        // =====================================================

        public async Task<List<TaskItem>> GetSprintTasksAsync(
            Guid sprintId)
        {
            return await _context.Tasks
                .AsNoTracking()
                .Where(t =>
                    t.SprintId == sprintId &&
                    !t.IsDeleted)
                .OrderBy(t => t.DueDate)
                .ThenBy(t => t.CreatedAt)
                .ToListAsync();
        }

        // =====================================================
        // VERIFY TEAM LEADER ACCESS
        // =====================================================

        public async Task<bool> HasTeamLeaderAccessAsync(
            Guid teamId,
            Guid teamLeaderId)
        {
            return await _context.TeamMembers
                .AsNoTracking()
                .AnyAsync(tm =>
                    tm.TeamId == teamId &&
                    tm.UserId == teamLeaderId &&
                    tm.IsTeamLeader &&
                    tm.IsActive);
        }

        // =====================================================
        // RECORD SPRINT ACCESS
        // =====================================================
        //
        // The current project already has activity/audit
        // functionality in other modules, but no stable
        // repository contract was found for a generic access-log
        // operation.
        //
        // Therefore this method is intentionally non-destructive.
        // It provides the repository hook required by the use case
        // without inventing a new database table/entity.
        //
        // =====================================================

        public async Task RecordSprintAccessAsync(
            Guid teamLeaderId,
            Guid sprintId)
        {
            await Task.CompletedTask;
        }
    }
}