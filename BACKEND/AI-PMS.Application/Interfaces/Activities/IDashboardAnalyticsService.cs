using AI_PMS.Application.DTOs.Activities;

namespace AI_PMS.Application.Interfaces.Activities
{
    public interface IDashboardAnalyticsService
    {
        Task<DashboardAnalyticsDto> GetDashboardAnalyticsAsync(
            DateTime? startDate = null,
            DateTime? endDate = null,
            Guid? projectId = null,
            Guid? teamId = null,
            Guid? userId = null);
    }
}
