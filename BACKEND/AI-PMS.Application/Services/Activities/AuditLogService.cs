using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Domain.Entities.Activities;
using AI_PMS.Application.Interfaces.Repositories.Activities;

namespace AI_PMS.Application.Services.Activities
{
    public class AuditLogService : IAuditLogService
    {
        private readonly IAuditLogRepository _repository;

        public AuditLogService(
            IAuditLogRepository repository)
        {
            _repository = repository;
        }

        // =========================================================
        // CREATE AUDIT LOG
        // =========================================================

        public async Task<AuditLogDto> CreateAsync(
            Guid userId,
            string action,
            string? entityType = null,
            Guid? entityId = null,
            string? description = null,
            string? ipAddress = null,
            string? userAgent = null)
        {
            var auditLog = new AuditLog
            {
                UserId = userId,
                Action = action.Trim(),
                EntityType = entityType?.Trim(),
                EntityId = entityId,
                Description = description?.Trim(),
                IpAddress = ipAddress?.Trim(),
                UserAgent = userAgent?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            var created =
                await _repository.AddAsync(auditLog);

            return MapToDto(created);
        }

        // =========================================================
        // GET ALL
        // =========================================================

        public async Task<List<AuditLogDto>> GetAllAsync()
        {
            var logs =
                await _repository.GetAllAsync();

            return logs
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // GET BY USER
        // =========================================================

        public async Task<List<AuditLogDto>> GetByUserAsync(
            Guid userId)
        {
            var logs =
                await _repository.GetByUserAsync(userId);

            return logs
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // GET BY ENTITY
        // =========================================================

        public async Task<List<AuditLogDto>> GetByEntityAsync(
            Guid entityId)
        {
            var logs =
                await _repository.GetByEntityAsync(entityId);

            return logs
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // GET BY DATE RANGE
        // =========================================================

        public async Task<List<AuditLogDto>> GetByDateRangeAsync(
            DateTime? startDate,
            DateTime? endDate)
        {
            var logs =
                await _repository.GetByDateRangeAsync(
                    startDate,
                    endDate);

            return logs
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // GET BY ACTION
        // =========================================================

        public async Task<List<AuditLogDto>> GetByActionAsync(
            string action)
        {
            var logs =
                await _repository.GetByActionAsync(action);

            return logs
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // MAPPING
        // =========================================================

        private static AuditLogDto MapToDto(
            AuditLog log)
        {
            return new AuditLogDto
            {
                Id = log.Id,
                UserId = log.UserId,
                Action = log.Action,
                EntityType = log.EntityType,
                EntityId = log.EntityId,
                Description = log.Description,
                IpAddress = log.IpAddress,
                UserAgent = log.UserAgent,
                CreatedAt = log.CreatedAt
            };
        }
    }
}
