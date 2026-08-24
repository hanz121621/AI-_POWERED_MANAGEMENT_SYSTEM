using AI_PMS.Application.DTOs.Activities;

namespace AI_PMS.Application.Interfaces.Activities
{
    public interface IAuditLogService
    {
        Task<AuditLogDto> CreateAsync(
            Guid userId,
            string action,
            string? entityType = null,
            Guid? entityId = null,
            string? description = null,
            string? ipAddress = null,
            string? userAgent = null);

        Task<List<AuditLogDto>> GetAllAsync();

        Task<List<AuditLogDto>> GetByUserAsync(
            Guid userId);

        Task<List<AuditLogDto>> GetByEntityAsync(
            Guid entityId);

        Task<List<AuditLogDto>> GetByDateRangeAsync(
            DateTime? startDate,
            DateTime? endDate);

        Task<List<AuditLogDto>> GetByActionAsync(
            string action);
    }
}