using AI_PMS.Domain.Entities.Activities;

namespace AI_PMS.Application.Interfaces.Repositories.Activities
{
    public interface IActivityLogRepository
    {
        Task<ActivityLog> AddAsync(ActivityLog activity);

        Task<ActivityLog?> GetByIdAsync(Guid id);

        Task<List<ActivityLog>> GetAllAsync();

        Task<List<ActivityLog>> GetByUserAsync(Guid userId);

        Task<List<ActivityLog>> GetByDateRangeAsync(
            DateTime? startDate,
            DateTime? endDate);

        Task<List<ActivityLog>> GetByEntityAsync(
            Guid entityId);

        Task<List<ActivityLog>> GetByProjectAsync(
            Guid projectId);

        Task<List<ActivityLog>> GetByProjectsAsync(
            List<Guid> projectIds);

        Task<List<ActivityLog>> GetFeedAsync(
            List<Guid> projectIds,
            Guid? projectId = null,
            Guid? teamId = null,
            string? activityType = null,
            DateTime? startDate = null,
            DateTime? endDate = null);
             
             
    }
}