using AI_PMS.Application.DTOs.Activities;

namespace AI_PMS.Application.Interfaces.Activities
{
    public interface IActivityLogService
    {
        Task<ActivityLogDto> CreateAsync(
            Guid userId,
            string action,
            string? activityType = null,
            Guid? entityId = null,
            string? entityType = null,
            string? description = null);

        Task<List<ActivityLogDto>> GetAllAsync();

        Task<List<ActivityLogDto>> GetByUserAsync(
            Guid userId);

        Task<List<ActivityLogDto>> GetByDateRangeAsync(
            DateTime? startDate,
            DateTime? endDate);

        Task<List<ActivityLogDto>> GetByEntityAsync(
            Guid entityId);
    }
}