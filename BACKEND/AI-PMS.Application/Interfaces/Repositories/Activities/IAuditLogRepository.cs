using AI_PMS.Domain.Entities.Activities;

namespace AI_PMS.Application.Interfaces.Repositories.Activities;

public interface IAuditLogRepository
{
    Task<AuditLog> AddAsync(AuditLog auditLog);
    Task<List<AuditLog>> GetAllAsync();
    Task<List<AuditLog>> GetByUserAsync(Guid userId);
    Task<List<AuditLog>> GetByEntityAsync(Guid entityId);
    Task<List<AuditLog>> GetByDateRangeAsync(DateTime? startDate, DateTime? endDate);
    Task<List<AuditLog>> GetByActionAsync(string action);
}

