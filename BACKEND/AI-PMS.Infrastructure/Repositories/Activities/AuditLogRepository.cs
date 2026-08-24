using AI_PMS.Application.Interfaces.Repositories.Activities;
using AI_PMS.Domain.Entities.Activities;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Activities
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly ApplicationDbContext _context;

        public AuditLogRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE
        // =========================================================

        public async Task<AuditLog> AddAsync(
            AuditLog auditLog)
        {
            await _context.AuditLogs.AddAsync(auditLog);
            await _context.SaveChangesAsync();

            return auditLog;
        }

        // =========================================================
        // GET ALL
        // =========================================================

        public async Task<List<AuditLog>> GetAllAsync()
        {
            return await _context.AuditLogs
                .AsNoTracking()
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // GET BY USER
        // =========================================================

        public async Task<List<AuditLog>> GetByUserAsync(
            Guid userId)
        {
            return await _context.AuditLogs
                .AsNoTracking()
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // GET BY ENTITY
        // =========================================================

        public async Task<List<AuditLog>> GetByEntityAsync(
            Guid entityId)
        {
            return await _context.AuditLogs
                .AsNoTracking()
                .Where(a => a.EntityId == entityId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // GET BY DATE RANGE
        // =========================================================

        public async Task<List<AuditLog>> GetByDateRangeAsync(
            DateTime? startDate,
            DateTime? endDate)
        {
            var query = _context.AuditLogs
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
        // GET BY ACTION
        // =========================================================

        public async Task<List<AuditLog>> GetByActionAsync(
            string action)
        {
            if (string.IsNullOrWhiteSpace(action))
            {
                return new List<AuditLog>();
            }

            var normalizedAction = action.Trim().ToLower();

            return await _context.AuditLogs
                .AsNoTracking()
                .Where(a =>
                    a.Action.ToLower() == normalizedAction)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }
    }
}