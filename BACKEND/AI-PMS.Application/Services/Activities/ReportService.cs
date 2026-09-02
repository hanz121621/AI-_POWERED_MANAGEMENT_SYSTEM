using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Application.Interfaces.Repositories.Projects;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Repositories.Users;

namespace AI_PMS.Application.Services.Activities
{
    public class ReportService : IReportService
    {
        private readonly IUserRepository _userRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly ITaskRepository _taskRepository;

        public ReportService(
            IUserRepository userRepository,
            IProjectRepository projectRepository,
            ITeamRepository teamRepository,
            ITaskRepository taskRepository)
        {
            _userRepository = userRepository;
            _projectRepository = projectRepository;
            _teamRepository = teamRepository;
            _taskRepository = taskRepository;
        }

        public async Task<SystemReportDto> GetSystemReportAsync(
            DateTime? startDate = null,
            DateTime? endDate = null,
            Guid? projectId = null,
            Guid? teamId = null,
            Guid? userId = null)
        {
            try
            {
                // =====================================================
                // GET CURRENT SYSTEM DATA
                // =====================================================

                var users = await _userRepository.GetAllAsync();
                var projects = await _projectRepository.GetAllAsync();
                var teams = await _teamRepository.GetAllAsync();
                var tasks = await _taskRepository.GetAllAsync();


                // =====================================================
                // DATE FILTER
                // =====================================================

                if (startDate.HasValue)
                {
                    users = users
                        .Where(u => u.CreatedAt >= startDate.Value)
                        .ToList();

                    projects = projects
                        .Where(p => p.CreatedAt >= startDate.Value)
                        .ToList();

                    tasks = tasks
                        .Where(t => t.CreatedAt >= startDate.Value)
                        .ToList();
                }

                if (endDate.HasValue)
                {
                    var endDateExclusive =
                        endDate.Value.Date.AddDays(1);

                    users = users
                        .Where(u => u.CreatedAt < endDateExclusive)
                        .ToList();

                    projects = projects
                        .Where(p => p.CreatedAt < endDateExclusive)
                        .ToList();

                    tasks = tasks
                        .Where(t => t.CreatedAt < endDateExclusive)
                        .ToList();
                }


                // =====================================================
                // PROJECT FILTER
                // =====================================================

                if (projectId.HasValue)
                {
                    projects = projects
                        .Where(p => p.Id == projectId.Value)
                        .ToList();
                }


                // =====================================================
                // TEAM FILTER
                // =====================================================

                if (teamId.HasValue)
                {
                    projects = projects
                        .Where(p => p.TeamId == teamId.Value)
                        .ToList();

                    teams = teams
                        .Where(t => t.Id == teamId.Value)
                        .ToList();
                }


                // =====================================================
                // USER FILTER
                // =====================================================

                if (userId.HasValue)
                {
                    users = users
                        .Where(u => u.Id == userId.Value)
                        .ToList();

                    projects = projects
                        .Where(p => p.ManagerId == userId.Value)
                        .ToList();

                    tasks = tasks
                        .Where(t =>
                            t.AssignedContributorSDId == userId.Value ||
                            t.CreatedBy == userId.Value)
                        .ToList();
                }


                // =====================================================
                // USER STATISTICS
                // =====================================================

                var totalUsers = users.Count;

                var activeUsers =
                    users.Count(u => u.IsActive);

                var inactiveUsers =
                    users.Count(u => !u.IsActive);


                // =====================================================
                // PROJECT STATISTICS
                // =====================================================

                var totalProjects = projects.Count;

                var activeProjects =
                    projects.Count(p =>
                        p.Status != null &&
                        p.Status.Name.Equals(
                            "Active",
                            StringComparison.OrdinalIgnoreCase));

                var archivedProjects =
                    projects.Count(p =>
                        p.Status != null &&
                        p.Status.Name.Equals(
                            "Archived",
                            StringComparison.OrdinalIgnoreCase));

                var completedProjects =
                    projects.Count(p =>
                        p.Status != null &&
                        p.Status.Name.Equals(
                            "Completed",
                            StringComparison.OrdinalIgnoreCase));


                // =====================================================
                // PROJECT STATUS SUMMARY
                // =====================================================

                var projectStatusSummary = projects
                    .Where(p => p.Status != null)
                    .GroupBy(p => p.Status!.Name)
                    .Select(g => new ProjectStatusReportDto
                    {
                        StatusId = Guid.Empty,
                        StatusName = g.Key,
                        ProjectCount = g.Count()
                    })
                    .ToList();


                // =====================================================
                // TEAM STATISTICS
                // =====================================================

                var totalTeams = teams.Count;

                var activeTeamMembers = 0;

                // We do not invent team-member activity data here.
                // This can be connected to TeamRepository later.


                // =====================================================
                // TASK STATISTICS
                // =====================================================

                var totalTasks = tasks.Count;

                var completedTasks = tasks.Count(t =>
                    t.Status.ToString().Equals(
                        "Completed",
                        StringComparison.OrdinalIgnoreCase));

                var inProgressTasks = tasks.Count(t =>
                    t.Status.ToString().Equals(
                        "InProgress",
                        StringComparison.OrdinalIgnoreCase));

                var todoTasks = tasks.Count(t =>
                    t.Status.ToString().Equals(
                        "Todo",
                        StringComparison.OrdinalIgnoreCase));

                var pendingTasks = todoTasks;

                var blockedTasks = tasks.Count(t =>
                    t.Status.ToString().Equals(
                        "Blocked",
                        StringComparison.OrdinalIgnoreCase));


                // =====================================================
                // TASK COMPLETION PERCENTAGE
                // =====================================================

                decimal taskCompletionPercentage = 0;

                if (totalTasks > 0)
                {
                    taskCompletionPercentage =
                        Math.Round(
                            (decimal)completedTasks /
                            totalTasks *
                            100,
                            2);
                }


                // =====================================================
                // ACTIVITY STATISTICS
                // =====================================================

                // Activity data is not currently used by this service.
                // Therefore we return zero instead of inventing data.

                var totalActivities = 0;

                var activeUsersWithActivity = 0;


                // =====================================================
                // AI STATISTICS
                // =====================================================

                // AI usage data is not currently connected to this report.

                var totalAIUsage = 0;


                // =====================================================
                // RETURN REPORT
                // =====================================================

                return new SystemReportDto
                {
                    // Users
                    TotalUsers = totalUsers,
                    ActiveUsers = activeUsers,
                    InactiveUsers = inactiveUsers,

                    // Projects
                    TotalProjects = totalProjects,
                    ActiveProjects = activeProjects,
                    ArchivedProjects = archivedProjects,
                    CompletedProjects = completedProjects,

                    // Project status
                    ProjectStatusSummary = projectStatusSummary,

                    // Teams
                    TotalTeams = totalTeams,
                    ActiveTeamMembers = activeTeamMembers,

                    // Tasks
                    TotalTasks = totalTasks,
                    CompletedTasks = completedTasks,
                    InProgressTasks = inProgressTasks,
                    TodoTasks = todoTasks,
                    PendingTasks = pendingTasks,
                    BlockedTasks = blockedTasks,

                    TaskCompletionPercentage =
                        taskCompletionPercentage,

                    // Activity
                    TotalActivities = totalActivities,
                    ActiveUsersWithActivity =
                        activeUsersWithActivity,

                    // AI
                    TotalAIUsage = totalAIUsage,

                    // Report information
                    GeneratedAt = DateTime.UtcNow,

                    Success = true,

                    Message =
                        "System report generated successfully.",

                    // Feature availability
                    ActivityLogAvailable = false,
                    AIUsageAvailable = false
                };
            }
            catch (Exception)
            {
                return new SystemReportDto
                {
                    Success = false,

                    Message =
                        "Unable to generate system reports. Please try again.",

                    GeneratedAt = DateTime.UtcNow
                };
            }
        }
    }
}
