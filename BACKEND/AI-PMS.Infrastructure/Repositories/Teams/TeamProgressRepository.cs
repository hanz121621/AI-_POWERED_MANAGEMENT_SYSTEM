
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Teams
{
    public class TeamProgressRepository
        : ITeamProgressRepository
    {
        private readonly ApplicationDbContext _context;

        public TeamProgressRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // GET AUTHORIZED TEAM
        // =========================================================

        public async Task<Team?> GetAuthorizedTeamAsync(
            Guid teamId,
            Guid managerId)
        {
            return await _context.Teams
                .AsNoTracking()
                .FirstOrDefaultAsync(t =>
                    t.Id == teamId &&
                    t.ManagerId == managerId &&
                    t.IsActive);
        }


        // =========================================================
        // GET AUTHORIZED PROJECT
        // =========================================================

        public async Task<Project?> GetAuthorizedProjectAsync(
            Guid teamId,
            Guid managerId)
        {
            return await _context.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p =>
                    p.TeamId == teamId &&
                    p.ManagerId == managerId);
        }


        // =========================================================
        // GET CURRENT TEAM LEADER
        // =========================================================

        public async Task<TeamMember?> GetTeamLeaderAsync(
            Guid teamId)
        {
            return await _context.TeamMembers
                .AsNoTracking()
                .Include(tm => tm.User)
                .Where(tm =>
                    tm.TeamId == teamId &&
                    tm.IsTeamLeader &&
                    tm.IsActive &&
                    tm.User != null &&
                    tm.User.IsActive)
                .FirstOrDefaultAsync();
        }


        // =========================================================
        // GET ACTIVE SPRINT
        // =========================================================

        public async Task<Sprint?> GetActiveSprintAsync(
            Guid teamId)
        {
            var now = DateTime.UtcNow;

            return await _context.Sprints
                .AsNoTracking()
                .Where(s =>
                    s.TeamId == teamId &&
                    !s.IsDeleted &&
                    s.StartDate <= now &&
                    s.EndDate >= now)
                .OrderByDescending(s => s.StartDate)
                .FirstOrDefaultAsync();
        }


        // =========================================================
        // GET SPRINT TASKS
        // =========================================================

        public async Task<List<TaskItem>> GetSprintTasksAsync(
            Guid sprintId)
        {
            return await _context.Tasks
                .AsNoTracking()
                .Where(t =>
                    t.SprintId == sprintId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }
    }
}
