using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Repositories.Activities;
using AI_PMS.Application.Interfaces.Repositories.Projects;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Domain.Entities.Activities;

namespace AI_PMS.Application.Services.Activities
{
    public class ActivityLogService : IActivityLogService
    {
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly IUserRepository _userRepository;
        private readonly IProjectRepository _projectRepository;

        public ActivityLogService(
            IActivityLogRepository activityLogRepository,
            IUserRepository userRepository,
            IProjectRepository projectRepository)
        {
            _activityLogRepository = activityLogRepository;
            _userRepository = userRepository;
            _projectRepository = projectRepository;
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
            string? description = null,
            Guid? projectId = null,
            Guid? teamId = null)
        {
            var activity = new ActivityLog
            {
                UserId = userId,
                ProjectId = projectId,
                TeamId = teamId,

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
        // COMM-004
        // GET MANAGER ACTIVITY FEED
        // =========================================================

        public async Task<List<ActivityLogDto>> GetManagerFeedAsync(
            Guid managerId,
            Guid? projectId = null,
            Guid? teamId = null,
            string? activityType = null,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            // -----------------------------------------------------
            // 1. Find projects assigned to this Manager
            // -----------------------------------------------------

            var projects =
                await _projectRepository.GetByManagerAsync(managerId);

            if (projects == null || projects.Count == 0)
            {
                return new List<ActivityLogDto>();
            }

            var authorizedProjectIds =
                projects
                    .Select(p => p.Id)
                    .ToList();

            // -----------------------------------------------------
            // 2. If a project filter was supplied, verify access
            // -----------------------------------------------------

            if (projectId.HasValue)
            {
                if (!authorizedProjectIds.Contains(projectId.Value))
                {
                    // Do not expose unauthorized project information.
                    return new List<ActivityLogDto>();
                }

                authorizedProjectIds =
                    new List<Guid> { projectId.Value };
            }

            // -----------------------------------------------------
            // 3. Retrieve activities only from authorized projects
            // -----------------------------------------------------

            var activities =
                await _activityLogRepository.GetByProjectsAsync(
                    authorizedProjectIds);

            // -----------------------------------------------------
            // 4. Apply filters to actual stored activity records
            // -----------------------------------------------------

            if (teamId.HasValue)
            {
                activities = activities
                    .Where(a => a.TeamId == teamId.Value)
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(activityType))
            {
                activities = activities
                    .Where(a =>
                        a.ActivityType != null &&
                        a.ActivityType.Equals(
                            activityType.Trim(),
                            StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            if (startDate.HasValue)
            {
                activities = activities
                    .Where(a => a.CreatedAt >= startDate.Value)
                    .ToList();
            }

            if (endDate.HasValue)
            {
                activities = activities
                    .Where(a => a.CreatedAt <= endDate.Value)
                    .ToList();
            }

            // -----------------------------------------------------
            // 5. Return newest activity first
            // -----------------------------------------------------

            activities = activities
                .OrderByDescending(a => a.CreatedAt)
                .ToList();

            return await MapListAsync(activities);
        }

        // =========================================================
        // COMM-004
        // GET SINGLE ACTIVITY
        // =========================================================

        public async Task<ActivityLogDto?> GetManagerActivityByIdAsync(
            Guid managerId,
            Guid activityId)
        {
            var activity =
                await _activityLogRepository.GetByIdAsync(activityId);

            if (activity == null)
            {
                return null;
            }

            // -----------------------------------------------------
            // Activity must belong to a project
            // authorized for this Manager.
            // -----------------------------------------------------

            if (!activity.ProjectId.HasValue)
            {
                return null;
            }

            var projects =
                await _projectRepository.GetByManagerAsync(managerId);

            var authorized =
                projects.Any(p =>
                    p.Id == activity.ProjectId.Value);

            if (!authorized)
            {
                return null;
            }

            return await MapToDtoAsync(activity);
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

                ProjectId = activity.ProjectId,
                TeamId = activity.TeamId,

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
