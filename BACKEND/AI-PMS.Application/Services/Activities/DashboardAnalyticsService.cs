
using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Repositories.Activities;

namespace AI_PMS.Application.Services.Activities
{
    public class DashboardAnalyticsService
        : IDashboardAnalyticsService
    {
        private readonly IDashboardAnalyticsRepository
            _dashboardAnalyticsRepository;

        public DashboardAnalyticsService(
            IDashboardAnalyticsRepository
                dashboardAnalyticsRepository)
        {
            _dashboardAnalyticsRepository =
                dashboardAnalyticsRepository;
        }

        // ============================================================
        // GET DASHBOARD ANALYTICS
        // ============================================================

        public async Task<DashboardAnalyticsDto>
            GetDashboardAnalyticsAsync(
                DateTime? startDate = null,
                DateTime? endDate = null,
                Guid? projectId = null,
                Guid? teamId = null,
                Guid? userId = null)
        {
            return await _dashboardAnalyticsRepository
                .GetDashboardAnalyticsAsync(
                    startDate,
                    endDate,
                    projectId,
                    teamId,
                    userId);
        }
    }
}
