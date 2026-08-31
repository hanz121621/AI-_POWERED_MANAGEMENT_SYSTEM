using AI_PMS.Application.DTOs.Activities;

namespace AI_PMS.Application.Interfaces.Activities;

public interface IReportService
{
    Task<SystemReportDto> GetSystemReportAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? projectId = null,
        Guid? teamId = null,
        Guid? userId = null);
}
