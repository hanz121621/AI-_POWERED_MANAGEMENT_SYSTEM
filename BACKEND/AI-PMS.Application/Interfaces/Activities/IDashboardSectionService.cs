using AI_PMS.Application.DTOs.Activities;

namespace AI_PMS.Application.Interfaces.Activities
{
    public interface IDashboardSectionService
    {
        Task<DashboardAnalyticsDto> GetSectionAsync(
            string section,
            DateTime? startDate = null,
            DateTime? endDate = null,
            Guid? projectId = null,
            Guid? teamId = null,
            Guid? userId = null);
    }
}