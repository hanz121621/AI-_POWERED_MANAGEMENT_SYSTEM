using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.Interfaces.Activities;

namespace AI_PMS.Application.Services.Activities
{
    public class DashboardSectionService : IDashboardSectionService
    {
        private readonly IDashboardAnalyticsService _dashboardAnalyticsService;

        public DashboardSectionService(
            IDashboardAnalyticsService dashboardAnalyticsService)
        {
            _dashboardAnalyticsService = dashboardAnalyticsService;
        }

        public async Task<DashboardAnalyticsDto> GetSectionAsync(
            string section,
            DateTime? startDate = null,
            DateTime? endDate = null,
            Guid? projectId = null,
            Guid? teamId = null,
            Guid? userId = null)
        {
            if (string.IsNullOrWhiteSpace(section))
            {
                return new DashboardAnalyticsDto
                {
                    GeneratedAt = DateTime.UtcNow,
                    Success = false,
                    Message = "Unable to load the selected information. Please try again."
                };
            }

            var result =
                await _dashboardAnalyticsService.GetDashboardAnalyticsAsync(
                    startDate,
                    endDate,
                    projectId,
                    teamId,
                    userId);

            if (!result.Success)
            {
                result.Message =
                    "Unable to load the selected information. Please try again.";
            }

            return result;
        }
    }
}
