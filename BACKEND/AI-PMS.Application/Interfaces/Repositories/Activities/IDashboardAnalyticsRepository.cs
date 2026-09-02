using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Interfaces.Repositories.Activities;

public interface IDashboardAnalyticsRepository
{
    // ============================================================
    // COMPLETE DASHBOARD ANALYTICS
    // ============================================================

    Task<DashboardAnalyticsDto> GetDashboardAnalyticsAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? projectId = null,
        Guid? teamId = null,
        Guid? userId = null);


    // ============================================================
    // USERS
    // ============================================================

    Task<int> GetTotalUsersAsync(
        Guid? userId = null);

    Task<int> GetActiveUsersAsync(
        Guid? userId = null);

    Task<int> GetInactiveUsersAsync(
        Guid? userId = null);


    // ============================================================
    // PROJECTS
    // ============================================================

    Task<int> GetTotalProjectsAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? projectId = null,
        Guid? teamId = null,
        Guid? userId = null);

    Task<int> GetActiveProjectsAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? projectId = null,
        Guid? teamId = null,
        Guid? userId = null);

    Task<int> GetCompletedProjectsAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? projectId = null,
        Guid? teamId = null,
        Guid? userId = null);

    Task<int> GetArchivedProjectsAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? projectId = null,
        Guid? teamId = null,
        Guid? userId = null);

    Task<List<(Guid StatusId, string StatusName, int Count)>>
        GetProjectStatusAnalyticsAsync(
            DateTime? startDate = null,
            DateTime? endDate = null,
            Guid? projectId = null,
            Guid? teamId = null,
            Guid? userId = null);


    // ============================================================
    // TEAMS
    // ============================================================

    Task<int> GetTotalTeamsAsync(
        Guid? teamId = null,
        Guid? userId = null);

    Task<int> GetActiveTeamMembersAsync(
        Guid? teamId = null);


    // ============================================================
    // TASKS
    // ============================================================

    Task<int> GetTotalTasksAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? projectId = null,
        Guid? userId = null);

    Task<int> GetCompletedTasksAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? projectId = null,
        Guid? userId = null);

    Task<int> GetInProgressTasksAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? projectId = null,
        Guid? userId = null);

    Task<int> GetTodoTasksAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? projectId = null,
        Guid? userId = null);
}
