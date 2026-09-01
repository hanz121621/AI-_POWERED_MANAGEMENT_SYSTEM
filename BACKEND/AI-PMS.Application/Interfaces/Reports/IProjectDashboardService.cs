using AI_PMS.Application.DTOs.Reports;

namespace AI_PMS.Application.Interfaces.Reports
{
    public interface IProjectDashboardService
    {
        Task<(
            bool Success,
            string Message,
            ProjectDashboardDto? Data
        )> GetProjectDashboardAsync(
            Guid managerId,
            Guid projectId);
    }
}