using AI_PMS.Application.Interfaces.Repositories.Activities;

using AI_PMS.Domain.Entities.Activities;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Activities
{
    public class ActivityLogRepository : IActivityLogRepository
    {
        private readonly ApplicationDbContext _context;

        public ActivityLogRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE
        // =========================================================

        public async Task<ActivityLog> AddAsync(
            ActivityLog activity)
        {
            await _context.ActivityLogs.AddAsync(activity);
            await _context.SaveChangesAsync();

            return activity;
        }

        // =========================================================
        // GET BY ID
        // =========================================================

        public async Task<ActivityLog?> GetByIdAsync(
            Guid id)
        {
            return await _context.ActivityLogs
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        // =========================================================
        // GET ALL
        // =========================================================

        public async Task<List<ActivityLog>> GetAllAsync()
        {
            return await _context.ActivityLogs
                .AsNoTracking()
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // GET BY USER
        // =========================================================

        public async Task<List<ActivityLog>> GetByUserAsync(
            Guid userId)
        {
            return await _context.ActivityLogs
                .AsNoTracking()
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // GET BY DATE RANGE
        // =========================================================

        public async Task<List<ActivityLog>> GetByDateRangeAsync(
            DateTime? startDate,
            DateTime? endDate)
        {
            var query = _context.ActivityLogs
                .AsNoTracking()
                .AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(a =>
                    a.CreatedAt >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(a =>
                    a.CreatedAt <= endDate.Value);
            }

            return await query
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }


        // =========================================================
        // GET BY ENTITY
        // =========================================================

        public async Task<List<ActivityLog>> GetByEntityAsync(
            Guid entityId)
        {
            return await _context.ActivityLogs
                .AsNoTracking()
                .Where(a => a.EntityId == entityId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }
        public async Task<List<ActivityLog>> GetByProjectAsync(
    Guid projectId)
{
    return await _context.ActivityLogs
        .AsNoTracking()
        .Where(a => a.ProjectId == projectId)
        .OrderByDescending(a => a.CreatedAt)
        .ToListAsync();
}

public async Task<List<ActivityLog>> GetByProjectsAsync(
    List<Guid> projectIds)
{
    if (projectIds == null || projectIds.Count == 0)
    {
        return new List<ActivityLog>();
    }

    return await _context.ActivityLogs
        .AsNoTracking()
        .Where(a =>
            a.ProjectId.HasValue &&
            projectIds.Contains(a.ProjectId.Value))
        .OrderByDescending(a => a.CreatedAt)
        .ToListAsync();
}
public async Task<List<ActivityLog>> GetFeedAsync(
    List<Guid> projectIds,
    Guid? projectId = null,
    Guid? teamId = null,
    string? activityType = null,
    DateTime? startDate = null,
    DateTime? endDate = null)
{
    if (projectIds == null || projectIds.Count == 0)
    {
        return new List<ActivityLog>();
    }

    var query = _context.ActivityLogs
        .AsNoTracking()
        .Where(a =>
            a.ProjectId.HasValue &&
            projectIds.Contains(a.ProjectId.Value));

    if (projectId.HasValue)
    {
        query = query.Where(a =>
            a.ProjectId == projectId.Value);
    }

    if (teamId.HasValue)
    {
        query = query.Where(a =>
            a.TeamId == teamId.Value);
    }

    if (!string.IsNullOrWhiteSpace(activityType))
    {
        query = query.Where(a =>
            a.ActivityType == activityType);
    }

    if (startDate.HasValue)
    {
        query = query.Where(a =>
            a.CreatedAt >= startDate.Value);
    }

    if (endDate.HasValue)
    {
        query = query.Where(a =>
            a.CreatedAt <= endDate.Value);
    }

    return await query
        .OrderByDescending(a => a.CreatedAt)
        .ToListAsync();
}
    }
}