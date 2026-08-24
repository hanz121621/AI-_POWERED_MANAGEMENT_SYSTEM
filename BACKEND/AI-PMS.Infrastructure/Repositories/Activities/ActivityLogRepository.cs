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
    }
}