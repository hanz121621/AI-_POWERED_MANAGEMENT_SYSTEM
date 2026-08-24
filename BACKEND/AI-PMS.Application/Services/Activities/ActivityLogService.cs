using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Domain.Entities.Activities;
using AI_PMS.Application.Interfaces.Repositories.Activities;
using AI_PMS.Application.Interfaces.Repositories.Users;

namespace AI_PMS.Application.Services.Activities
{
    public class ActivityLogService : IActivityLogService
    {
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly IUserRepository _userRepository;

        public ActivityLogService(
            IActivityLogRepository activityLogRepository,
            IUserRepository userRepository)
        {
            _activityLogRepository = activityLogRepository;
            _userRepository = userRepository;
        }

        // =========================================================
        // CREATE
        // =========================================================

        public async Task<ActivityLogDto> CreateAsync(
            Guid userId,
            string action,
            string? activityType = null,
            Guid? entityId = null,
            string? entityType = null,
            string? description = null)
        {
            var activity = new ActivityLog
            {
                UserId = userId,
                Action = action.Trim(),
                ActivityType = activityType?.Trim(),
                EntityId = entityId,
                EntityType = entityType?.Trim(),
                Description = description?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            var created =
                await _activityLogRepository.AddAsync(activity);

            return await MapToDtoAsync(created);
        }

        // =========================================================
        // GET ALL
        // =========================================================

        public async Task<List<ActivityLogDto>> GetAllAsync()
        {
            var activities =
                await _activityLogRepository.GetAllAsync();

            return await MapListAsync(activities);
        }

        // =========================================================
        // GET BY USER
        // =========================================================

        public async Task<List<ActivityLogDto>> GetByUserAsync(
            Guid userId)
        {
            var activities =
                await _activityLogRepository.GetByUserAsync(userId);

            return await MapListAsync(activities);
        }

        // =========================================================
        // GET BY DATE RANGE
        // =========================================================

        public async Task<List<ActivityLogDto>> GetByDateRangeAsync(
            DateTime? startDate,
            DateTime? endDate)
        {
            var activities =
                await _activityLogRepository.GetByDateRangeAsync(
                    startDate,
                    endDate);

            return await MapListAsync(activities);
        }

        // =========================================================
        // GET BY ENTITY
        // =========================================================

        public async Task<List<ActivityLogDto>> GetByEntityAsync(
            Guid entityId)
        {
            var activities =
                await _activityLogRepository.GetByEntityAsync(
                    entityId);

            return await MapListAsync(activities);
        }

        // =========================================================
        // MAP ENTITY → DTO
        // =========================================================

        private async Task<ActivityLogDto> MapToDtoAsync(
            ActivityLog activity)
        {
            var user =
                await _userRepository.GetByIdAsync(activity.UserId);

            return new ActivityLogDto
            {
                Id = activity.Id,
                UserId = activity.UserId,
                UserName = user?.FullName ?? "Unknown User",
                Action = activity.Action,
                ActivityType = activity.ActivityType,
                EntityId = activity.EntityId,
                EntityType = activity.EntityType,
                Description = activity.Description,
                CreatedAt = activity.CreatedAt
            };
        }

        // =========================================================
        // MAP LIST
        // =========================================================

        private async Task<List<ActivityLogDto>> MapListAsync(
            List<ActivityLog> activities)
        {
            var result = new List<ActivityLogDto>();

            foreach (var activity in activities)
            {
                result.Add(
                    await MapToDtoAsync(activity));
            }

            return result;
        }
    }
}