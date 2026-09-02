using AI_PMS.Application.Interfaces.Repositories.Reports;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Reports
{
    public class TeamLeaderReportRepository
        : ITeamLeaderReportRepository
    {
        private readonly ApplicationDbContext _context;

        public TeamLeaderReportRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // TEAM LEADER AUTHORIZATION
        // =========================================================

        public async Task<TeamMember?> GetTeamLeaderMembershipAsync(
            Guid teamLeaderId)
        {
            return await _context.TeamMembers
                .AsNoTracking()
                .Include(tm => tm.Team)
                .Include(tm => tm.User)
                .Include(tm => tm.ContributorType)
                .Include(tm => tm.ContributorSubType)
                .FirstOrDefaultAsync(tm =>
                    tm.UserId == teamLeaderId &&
                    tm.IsTeamLeader &&
                    tm.IsActive &&
                    tm.User != null &&
                    tm.User.IsActive &&
                    tm.Team != null &&
                    tm.Team.IsActive);
        }

        // =========================================================
        // TEAM
        // =========================================================

        public async Task<Team?> GetTeamWithMembersAsync(
            Guid teamId)
        {
            return await _context.Teams
                .AsNoTracking()
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.User)
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.ContributorType)
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.ContributorSubType)
                .FirstOrDefaultAsync(t =>
                    t.Id == teamId &&
                    t.IsActive);
        }

        // =========================================================
        // PROJECT
        // =========================================================

        public async Task<Project?> GetProjectForTeamAsync(
            Guid projectId,
            Guid teamId)
        {
            return await _context.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p =>
                    p.Id == projectId &&
                    p.TeamId == teamId);
        }

        public async Task<List<Project>> GetTeamProjectsAsync(
            Guid teamId)
        {
            return await _context.Projects
                .AsNoTracking()
                .Where(p =>
                    p.TeamId == teamId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // TEAM TASKS
        // =========================================================

        public async Task<List<TaskItem>> GetTeamTasksAsync(
            Guid teamId)
        {
            return await _context.Tasks
                .AsNoTracking()
                .Where(t =>
                    _context.Sprints.Any(s =>
                        s.Id == t.SprintId &&
                        s.TeamId == teamId &&
                        !s.IsDeleted))
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // PROJECT TASKS
        // =========================================================

        public async Task<List<TaskItem>> GetProjectTasksAsync(
            Guid projectId)
        {
            return await _context.Tasks
                .AsNoTracking()
                .Where(t =>
                    _context.Sprints.Any(s =>
                        s.Id == t.SprintId &&
                        s.ProjectId == projectId &&
                        !s.IsDeleted))
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // SINGLE TEAM TASK
        // =========================================================

        public async Task<TaskItem?> GetTeamTaskAsync(
            Guid taskId,
            Guid teamId)
        {
            return await _context.Tasks
                .AsNoTracking()
                .FirstOrDefaultAsync(t =>
                    t.Id == taskId &&
                    _context.Sprints.Any(s =>
                        s.Id == t.SprintId &&
                        s.TeamId == teamId &&
                        !s.IsDeleted));
        }
    }
}