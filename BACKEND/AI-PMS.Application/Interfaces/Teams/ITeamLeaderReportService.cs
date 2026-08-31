using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Interfaces.Reports
{
    public interface ITeamLeaderReportService
    {
        // =========================================================
        // TL-REPORT-001
        // VIEW TEAM PERFORMANCE REPORT
        // =========================================================

        Task<TeamPerformanceReportDto>
            GetTeamPerformanceReportAsync(
                Guid teamLeaderId,
                Guid? projectId = null,
                DateTime? startDate = null,
                DateTime? endDate = null);

        // =========================================================
        // TL-REPORT-002
        // VIEW TEAM TASK HISTORY
        // =========================================================

        Task<List<TeamLeaderTaskHistoryDto>>
            GetTeamTaskHistoryAsync(
                Guid teamLeaderId,
                Guid? projectId = null,
                Guid? sprintId = null,
                Guid? teamMemberId = null,
                ProjectTaskStatus? status = null,
                DateTime? startDate = null,
                DateTime? endDate = null);

        // =========================================================
        // VIEW SINGLE TEAM TASK HISTORY
        // =========================================================

        Task<TeamLeaderTaskHistoryDto?>
            GetTeamTaskHistoryByIdAsync(
                Guid teamLeaderId,
                Guid taskId);
    }
}