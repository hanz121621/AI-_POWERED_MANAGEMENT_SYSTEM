using AI_PMS.Application.DTOs.Activities;

namespace AI_PMS.Application.Interfaces.Activities
{
    public interface IActivityLogService
    {
        // =========================================================
        // CREATE ACTIVITY
        // =========================================================

        Task<ActivityLogDto> CreateAsync(
            Guid userId,
            string action,
            string? activityType = null,
            Guid? entityId = null,
            string? entityType = null,
            string? description = null,
            Guid? projectId = null,
            Guid? teamId = null);

        // =========================================================
        // GENERAL READ
        // =========================================================

        Task<List<ActivityLogDto>> GetAllAsync();

        Task<List<ActivityLogDto>> GetByUserAsync(
            Guid userId);

        Task<List<ActivityLogDto>> GetByDateRangeAsync(
            DateTime? startDate,
            DateTime? endDate);

        Task<List<ActivityLogDto>> GetByEntityAsync(
            Guid entityId);

        // =========================================================
        // PROJECT MANAGER ACTIVITY FEED
        // COMM-004
        // =========================================================

        Task<List<ActivityLogDto>> GetManagerFeedAsync(
            Guid managerId,
            Guid? projectId = null,
            Guid? teamId = null,
            string? activityType = null,
            DateTime? startDate = null,
            DateTime? endDate = null);

        // =========================================================
        // SINGLE ACTIVITY FOR MANAGER
        // COMM-004
        // =========================================================

        Task<ActivityLogDto?> GetManagerActivityByIdAsync(
            Guid managerId,
            Guid activityId);
    }
}