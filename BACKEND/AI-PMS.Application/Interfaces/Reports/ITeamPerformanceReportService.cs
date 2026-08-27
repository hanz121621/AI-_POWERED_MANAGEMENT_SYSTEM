using AI_PMS.Application.DTOs.Reports;

namespace AI_PMS.Application.Interfaces.Reports
{
    public interface ITeamPerformanceReportService
    {
        Task<TeamPerformanceReportDto> GetTeamPerformanceReportAsync(
            Guid teamId,
            DateTime? startDate = null,
            DateTime? endDate = null);
    }
}