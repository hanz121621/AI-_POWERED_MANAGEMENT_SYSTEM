
using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.Interfaces.Repositories.Activities;
using AI_PMS.Domain.Enums;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Activities
{
    public class DashboardAnalyticsRepository
        : IDashboardAnalyticsRepository
    {
        private readonly ApplicationDbContext _context;

        public DashboardAnalyticsRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================================================
        // DASHBOARD ANALYTICS
        // ============================================================

        public async Task<DashboardAnalyticsDto>
            GetDashboardAnalyticsAsync(
                DateTime? startDate = null,
                DateTime? endDate = null,
                Guid? projectId = null,
                Guid? teamId = null,
                Guid? userId = null)
        {
            var result = new DashboardAnalyticsDto
            {
                GeneratedAt = DateTime.UtcNow,
                Success = true,
                Message = "Dashboard analytics generated successfully."
            };

            

            // ========================================================
            // USERS
            // ========================================================

            var usersQuery = _context.Users
                .AsNoTracking()
                .AsQueryable();

            if (userId.HasValue)
            {
                usersQuery = usersQuery.Where(
                    u => u.Id == userId.Value);
            }

            result.TotalUsers =
                await usersQuery.CountAsync();

            result.ActiveUsers =
                await usersQuery.CountAsync(
                    u => u.IsActive);

            result.InactiveUsers =
                await usersQuery.CountAsync(
                    u => !u.IsActive);


            // ========================================================
            // PROJECTS
            // ========================================================

            var projectsQuery = _context.Projects
                .AsNoTracking()
                .Include(p => p.Status)
                .AsQueryable();

            if (projectId.HasValue)
            {
                projectsQuery = projectsQuery.Where(
                    p => p.Id == projectId.Value);
            }

            if (teamId.HasValue)
            {
                projectsQuery = projectsQuery.Where(
                    p => p.TeamId == teamId.Value);
            }

            if (userId.HasValue)
            {
                projectsQuery = projectsQuery.Where(
                    p => p.ManagerId == userId.Value);
            }

            if (startDate.HasValue)
            {
                projectsQuery = projectsQuery.Where(
                    p => p.CreatedAt >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                projectsQuery = projectsQuery.Where(
                    p => p.CreatedAt <= endDate.Value);
            }

            result.TotalProjects =
                await projectsQuery.CountAsync();

            result.ActiveProjects =
                await projectsQuery.CountAsync(
                    p =>
                        !p.Status.IsArchivedStatus &&
                        !p.Status.IsCancelledStatus);

            result.CompletedProjects =
                await projectsQuery.CountAsync(
                    p => p.CompletedAt != null);

            result.ArchivedProjects =
                await projectsQuery.CountAsync(
                    p => p.Status.IsArchivedStatus);


            // ========================================================
            // PROJECT STATUS ANALYTICS
            // ========================================================

            result.ProjectStatuses =
                await projectsQuery
                    .GroupBy(p => new
                    {
                        p.StatusId,
                        StatusName = p.Status.Name
                    })
                    .Select(g => new ProjectStatusAnalyticsDto
                    {
                        StatusId = g.Key.StatusId,
                        StatusName = g.Key.StatusName,
                        Count = g.Count()
                    })
                    .OrderBy(x => x.StatusName)
                    .ToListAsync();


            // ========================================================
            // TEAMS
            // ========================================================

            var teamsQuery = _context.Teams
                .AsNoTracking()
                .AsQueryable();

            if (teamId.HasValue)
            {
                teamsQuery = teamsQuery.Where(
                    t => t.Id == teamId.Value);
            }

            if (userId.HasValue)
            {
                teamsQuery = teamsQuery.Where(
                    t => t.ManagerId == userId.Value);
            }

            result.TotalTeams =
                await teamsQuery.CountAsync();

            // --------------------------------------------------------
            // ACTIVE TEAM MEMBERS
            // --------------------------------------------------------

            var teamMembersQuery = _context.TeamMembers
                .AsNoTracking()
                .Where(tm => tm.IsActive);

            if (teamId.HasValue)
            {
                teamMembersQuery =
                    teamMembersQuery.Where(
                        tm => tm.TeamId == teamId.Value);
            }

            if (userId.HasValue)
            {
                teamMembersQuery =
                    teamMembersQuery.Where(
                        tm =>
                            tm.Team != null &&
                            tm.Team.ManagerId == userId.Value);
            }

            result.ActiveTeamMembers =
                await teamMembersQuery.CountAsync();


            // ========================================================
            // TASKS
            // ========================================================

            var tasksQuery = _context.Tasks
                .AsNoTracking()
                .AsQueryable();

            // --------------------------------------------------------
            // PROJECT FILTER
            // --------------------------------------------------------

            if (projectId.HasValue)
            {
                var projectSprintIds =
                    _context.Sprints
                        .AsNoTracking()
                        .Where(s =>
                            s.ProjectId == projectId.Value &&
                            !s.IsDeleted)
                        .Select(s => s.Id);

                tasksQuery =
                    tasksQuery.Where(
                        t => projectSprintIds.Contains(t.SprintId));
            }

            // --------------------------------------------------------
            // TEAM FILTER
            //
            // Task -> Sprint -> Project -> Team
            // --------------------------------------------------------

            if (teamId.HasValue)
            {
                var teamSprintIds =
                    _context.Sprints
                        .AsNoTracking()
                        .Where(s =>
                            !s.IsDeleted &&
                            _context.Projects.Any(
                                p =>
                                    p.Id == s.ProjectId &&
                                    p.TeamId == teamId.Value))
                        .Select(s => s.Id);

                tasksQuery =
                    tasksQuery.Where(
                        t => teamSprintIds.Contains(t.SprintId));
            }

            // --------------------------------------------------------
            // USER FILTER
            //
            // For tasks this represents the assigned contributor.
            // --------------------------------------------------------

            if (userId.HasValue)
            {
                tasksQuery =
                    tasksQuery.Where(
                        t => t.AssignedContributorSDId == userId.Value);
            }

            // --------------------------------------------------------
            // DATE FILTER
            // --------------------------------------------------------

            if (startDate.HasValue)
            {
                tasksQuery =
                    tasksQuery.Where(
                        t => t.CreatedAt >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                tasksQuery =
                    tasksQuery.Where(
                        t => t.CreatedAt <= endDate.Value);
            }


            // ========================================================
            // TASK COUNTS
            // ========================================================

            result.TotalTasks =
                await tasksQuery.CountAsync();

            result.CompletedTasks =
                await tasksQuery.CountAsync(
                    t =>
                        t.Status ==
                        ProjectTaskStatus.Completed);

            result.InProgressTasks =
                await tasksQuery.CountAsync(
                    t =>
                        t.Status ==
                        ProjectTaskStatus.InProgress);

            result.TodoTasks =
                await tasksQuery.CountAsync(
                    t =>
                        t.Status ==
                        ProjectTaskStatus.Todo);


            // ========================================================
            // TASK COMPLETION PERCENTAGE
            // ========================================================

            if (result.TotalTasks > 0)
            {
                result.TaskCompletionPercentage =
                    Math.Round(
                        (decimal)result.CompletedTasks /
                        result.TotalTasks *
                        100,
                        2);
            }
            else
            {
                result.TaskCompletionPercentage = 0;
            }

                 return result;
    }

    // ============================================================
    // USER ANALYTICS
    // ============================================================

    public async Task<int> GetTotalUsersAsync(
        Guid? userId = null)
    {
        var query = _context.Users
            .AsNoTracking()
            .AsQueryable();

        if (userId.HasValue)
        {
            query = query.Where(
                u => u.Id == userId.Value);
        }

        return await query.CountAsync();
    }

    public async Task<int> GetActiveUsersAsync(
        Guid? userId = null)
    {
        var query = _context.Users
            .AsNoTracking()
            .AsQueryable();

        if (userId.HasValue)
        {
            query = query.Where(
                u => u.Id == userId.Value);
        }

        return await query.CountAsync(
            u => u.IsActive);
    }

    public async Task<int> GetInactiveUsersAsync(
        Guid? userId = null)
    {
        var query = _context.Users
            .AsNoTracking()
            .AsQueryable();

        if (userId.HasValue)
        {
            query = query.Where(
                u => !u.IsActive);
        }

        return await query.CountAsync();
    }
    // ============================================================
// PROJECT ANALYTICS
// ============================================================

public async Task<int> GetTotalProjectsAsync(
    DateTime? startDate = null,
    DateTime? endDate = null,
    Guid? projectId = null,
    Guid? teamId = null,
    Guid? userId = null)
{
    var query = _context.Projects
        .AsNoTracking()
        .AsQueryable();

    if (projectId.HasValue)
    {
        query = query.Where(
            p => p.Id == projectId.Value);
    }

    if (teamId.HasValue)
    {
        query = query.Where(
            p => p.TeamId == teamId.Value);
    }

    if (userId.HasValue)
    {
        query = query.Where(
            p => p.ManagerId == userId.Value);
    }

    if (startDate.HasValue)
    {
        query = query.Where(
            p => p.CreatedAt >= startDate.Value);
    }

    if (endDate.HasValue)
    {
        query = query.Where(
            p => p.CreatedAt <= endDate.Value);
    }

    return await query.CountAsync();
}


public async Task<int> GetActiveProjectsAsync(
    DateTime? startDate = null,
    DateTime? endDate = null,
    Guid? projectId = null,
    Guid? teamId = null,
    Guid? userId = null)
{
    var query = _context.Projects
        .AsNoTracking()
        .Include(p => p.Status)
        .AsQueryable();

    if (projectId.HasValue)
    {
        query = query.Where(
            p => p.Id == projectId.Value);
    }

    if (teamId.HasValue)
    {
        query = query.Where(
            p => p.TeamId == teamId.Value);
    }

    if (userId.HasValue)
    {
        query = query.Where(
            p => p.ManagerId == userId.Value);
    }

    if (startDate.HasValue)
    {
        query = query.Where(
            p => p.CreatedAt >= startDate.Value);
    }

    if (endDate.HasValue)
    {
        query = query.Where(
            p => p.CreatedAt <= endDate.Value);
    }

    return await query.CountAsync(
        p =>
            !p.Status.IsArchivedStatus &&
            !p.Status.IsCancelledStatus);
}


public async Task<int> GetCompletedProjectsAsync(
    DateTime? startDate = null,
    DateTime? endDate = null,
    Guid? projectId = null,
    Guid? teamId = null,
    Guid? userId = null)
{
    var query = _context.Projects
        .AsNoTracking()
        .AsQueryable();

    if (projectId.HasValue)
    {
        query = query.Where(
            p => p.Id == projectId.Value);
    }

    if (teamId.HasValue)
    {
        query = query.Where(
            p => p.TeamId == teamId.Value);
    }

    if (userId.HasValue)
    {
        query = query.Where(
            p => p.ManagerId == userId.Value);
    }

    if (startDate.HasValue)
    {
        query = query.Where(
            p => p.CreatedAt >= startDate.Value);
    }

    if (endDate.HasValue)
    {
        query = query.Where(
            p => p.CreatedAt <= endDate.Value);
    }

    return await query.CountAsync(
        p => p.CompletedAt != null);
}


public async Task<int> GetArchivedProjectsAsync(
    DateTime? startDate = null,
    DateTime? endDate = null,
    Guid? projectId = null,
    Guid? teamId = null,
    Guid? userId = null)
{
    var query = _context.Projects
        .AsNoTracking()
        .Include(p => p.Status)
        .AsQueryable();

    if (projectId.HasValue)
    {
        query = query.Where(
            p => p.Id == projectId.Value);
    }

    if (teamId.HasValue)
    {
        query = query.Where(
            p => p.TeamId == teamId.Value);
    }

    if (userId.HasValue)
    {
        query = query.Where(
            p => p.ManagerId == userId.Value);
    }

    if (startDate.HasValue)
    {
        query = query.Where(
            p => p.CreatedAt >= startDate.Value);
    }

    if (endDate.HasValue)
    {
        query = query.Where(
            p => p.CreatedAt <= endDate.Value);
    }

    return await query.CountAsync(
        p => p.Status.IsArchivedStatus);
}
// ============================================================
// PROJECT STATUS ANALYTICS
// ============================================================

public async Task<List<(Guid StatusId, string StatusName, int Count)>>
    GetProjectStatusAnalyticsAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? projectId = null,
        Guid? teamId = null,
        Guid? userId = null)
{
    var query = _context.Projects
        .AsNoTracking()
        .Include(p => p.Status)
        .AsQueryable();

    if (projectId.HasValue)
    {
        query = query.Where(
            p => p.Id == projectId.Value);
    }

    if (teamId.HasValue)
    {
        query = query.Where(
            p => p.TeamId == teamId.Value);
    }

    if (userId.HasValue)
    {
        query = query.Where(
            p => p.ManagerId == userId.Value);
    }

    if (startDate.HasValue)
    {
        query = query.Where(
            p => p.CreatedAt >= startDate.Value);
    }

    if (endDate.HasValue)
    {
        query = query.Where(
            p => p.CreatedAt <= endDate.Value);
    }

    var data = await query
        .GroupBy(p => new
        {
            p.StatusId,
            StatusName = p.Status.Name
        })
        .Select(g => new
        {
            g.Key.StatusId,
            g.Key.StatusName,
            Count = g.Count()
        })
        .OrderBy(x => x.StatusName)
        .ToListAsync();

    return data
        .Select(x =>
            (x.StatusId, x.StatusName, x.Count))
        .ToList();
}


// ============================================================
// TEAM ANALYTICS
// ============================================================

public async Task<int> GetTotalTeamsAsync(
    Guid? teamId = null,
    Guid? userId = null)
{
    var query = _context.Teams
        .AsNoTracking()
        .AsQueryable();

    if (teamId.HasValue)
    {
        query = query.Where(
            t => t.Id == teamId.Value);
    }

    if (userId.HasValue)
    {
        query = query.Where(
            t => t.ManagerId == userId.Value);
    }

    return await query.CountAsync();
}


public async Task<int> GetActiveTeamMembersAsync(
    Guid? teamId = null)
{
    var query = _context.TeamMembers
        .AsNoTracking()
        .Where(tm => tm.IsActive);

    if (teamId.HasValue)
    {
        query = query.Where(
            tm => tm.TeamId == teamId.Value);
    }

    return await query.CountAsync();
}


// ============================================================
// TASK ANALYTICS
// ============================================================

public async Task<int> GetTotalTasksAsync(
    DateTime? startDate = null,
    DateTime? endDate = null,
    Guid? projectId = null,
    Guid? userId = null)
{
    var query = _context.Tasks
        .AsNoTracking()
        .AsQueryable();

    if (projectId.HasValue)
    {
        var sprintIds = _context.Sprints
            .AsNoTracking()
            .Where(s =>
                s.ProjectId == projectId.Value &&
                !s.IsDeleted)
            .Select(s => s.Id);

        query = query.Where(
            t => sprintIds.Contains(t.SprintId));
    }

    if (userId.HasValue)
    {
        query = query.Where(
            t => t.AssignedContributorSDId == userId.Value);
    }

    if (startDate.HasValue)
    {
        query = query.Where(
            t => t.CreatedAt >= startDate.Value);
    }

    if (endDate.HasValue)
    {
        query = query.Where(
            t => t.CreatedAt <= endDate.Value);
    }

    return await query.CountAsync();
}


public async Task<int> GetCompletedTasksAsync(
    DateTime? startDate = null,
    DateTime? endDate = null,
    Guid? projectId = null,
    Guid? userId = null)
{
    var query = _context.Tasks
        .AsNoTracking()
        .AsQueryable();

    if (projectId.HasValue)
    {
        var sprintIds = _context.Sprints
            .AsNoTracking()
            .Where(s =>
                s.ProjectId == projectId.Value &&
                !s.IsDeleted)
            .Select(s => s.Id);

        query = query.Where(
            t => sprintIds.Contains(t.SprintId));
    }

    if (userId.HasValue)
    {
        query = query.Where(
            t => t.AssignedContributorSDId == userId.Value);
    }

    if (startDate.HasValue)
    {
        query = query.Where(
            t => t.CreatedAt >= startDate.Value);
    }

    if (endDate.HasValue)
    {
        query = query.Where(
            t => t.CreatedAt <= endDate.Value);
    }

    return await query.CountAsync(
        t => t.Status == ProjectTaskStatus.Completed);
}


public async Task<int> GetInProgressTasksAsync(
    DateTime? startDate = null,
    DateTime? endDate = null,
    Guid? projectId = null,
    Guid? userId = null)
{
    var query = _context.Tasks
        .AsNoTracking()
        .AsQueryable();

    if (projectId.HasValue)
    {
        var sprintIds = _context.Sprints
            .AsNoTracking()
            .Where(s =>
                s.ProjectId == projectId.Value &&
                !s.IsDeleted)
            .Select(s => s.Id);

        query = query.Where(
            t => sprintIds.Contains(t.SprintId));
    }

    if (userId.HasValue)
    {
        query = query.Where(
            t => t.AssignedContributorSDId == userId.Value);
    }

    if (startDate.HasValue)
    {
        query = query.Where(
            t => t.CreatedAt >= startDate.Value);
    }

    if (endDate.HasValue)
    {
        query = query.Where(
            t => t.CreatedAt <= endDate.Value);
    }

    return await query.CountAsync(
        t => t.Status == ProjectTaskStatus.InProgress);
}


public async Task<int> GetTodoTasksAsync(
    DateTime? startDate = null,
    DateTime? endDate = null,
    Guid? projectId = null,
    Guid? userId = null)
{
    var query = _context.Tasks
        .AsNoTracking()
        .AsQueryable();

    if (projectId.HasValue)
    {
        var sprintIds = _context.Sprints
            .AsNoTracking()
            .Where(s =>
                s.ProjectId == projectId.Value &&
                !s.IsDeleted)
            .Select(s => s.Id);

        query = query.Where(
            t => sprintIds.Contains(t.SprintId));
    }

    if (userId.HasValue)
    {
        query = query.Where(
            t => t.AssignedContributorSDId == userId.Value);
    }

    if (startDate.HasValue)
    {
        query = query.Where(
            t => t.CreatedAt >= startDate.Value);
    }

    if (endDate.HasValue)
    {
        query = query.Where(
            t => t.CreatedAt <= endDate.Value);
    }

    return await query.CountAsync(
        t => t.Status == ProjectTaskStatus.Todo);
}
}
}
