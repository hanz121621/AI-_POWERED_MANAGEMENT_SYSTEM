using AI_PMS.Application.Interfaces.Repositories.Reports;
using AI_PMS.Domain.Entities.Activities;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Reports
{
    public class ProjectDashboardRepository
        : IProjectDashboardRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectDashboardRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // AUTHORIZED PROJECT
        // =========================================================

        public async Task<Project?> GetAuthorizedProjectAsync(
            Guid projectId,
            Guid managerId)
        {
            return await _context.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p =>
                    p.Id == projectId &&
                    p.ManagerId == managerId);
        }

        // =========================================================
        // ACTIVE SPRINT
        // =========================================================

        public async Task<Sprint?> GetActiveSprintAsync(
            Guid projectId)
        {
            var now = DateTime.UtcNow;

            return await _context.Sprints
                .AsNoTracking()
                .Where(s =>
                    s.ProjectId == projectId &&
                    !s.IsDeleted &&
                    (
                        s.Status == Domain.Enums.SprintStatus.Active ||
                        (
                            s.StartDate <= now &&
                            s.EndDate >= now
                        )
                    ))
                .OrderByDescending(s => s.StartDate)
                .FirstOrDefaultAsync();
        }

        // =========================================================
        // PROJECT SPRINTS
        // =========================================================

        public async Task<List<Sprint>> GetProjectSprintsAsync(
            Guid projectId)
        {
            return await _context.Sprints
                .AsNoTracking()
                .Where(s =>
                    s.ProjectId == projectId &&
                    !s.IsDeleted)
                .OrderByDescending(s => s.StartDate)
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
        // PROJECT TEAM
        // =========================================================

        public async Task<Team?> GetProjectTeamAsync(
            Guid projectId)
        {
            var teamId = await _context.Projects
                .AsNoTracking()
                .Where(p => p.Id == projectId)
                .Select(p => p.TeamId)
                .FirstOrDefaultAsync();

            if (!teamId.HasValue)
            {
                return null;
            }

            return await _context.Teams
                .AsNoTracking()
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.User)
                .FirstOrDefaultAsync(t =>
                    t.Id == teamId.Value &&
                    t.IsActive);
        }

        // =========================================================
        // TEAM LEADER
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
        // PROJECT ACTIVITIES
        // =========================================================

        public async Task<List<ActivityLog>> GetProjectActivitiesAsync(
            Guid projectId)
        {
            var sprintIds = await _context.Sprints
                .AsNoTracking()
                .Where(s =>
                    s.ProjectId == projectId &&
                    !s.IsDeleted)
                .Select(s => s.Id)
                .ToListAsync();

            var taskIds = await _context.Tasks
                .AsNoTracking()
                .Where(t =>
                    sprintIds.Contains(t.SprintId))
                .Select(t => t.Id)
                .ToListAsync();

            var teamId = await _context.Projects
                .AsNoTracking()
                .Where(p => p.Id == projectId)
                .Select(p => p.TeamId)
                .FirstOrDefaultAsync();

            var entityIds = new List<Guid>
            {
                projectId
            };

            entityIds.AddRange(sprintIds);
            entityIds.AddRange(taskIds);

            if (teamId.HasValue)
            {
                entityIds.Add(teamId.Value);
            }

            return await _context.ActivityLogs
                .AsNoTracking()
                .Where(a =>
                    a.EntityId.HasValue &&
                    entityIds.Contains(a.EntityId.Value))
                .OrderByDescending(a => a.CreatedAt)
                .Take(20)
                .ToListAsync();
        }
    }
}