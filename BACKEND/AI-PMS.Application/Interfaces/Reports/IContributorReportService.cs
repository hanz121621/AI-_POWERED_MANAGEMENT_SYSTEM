
using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Interfaces.Reports
{
    public interface IContributorReportService
    {
        // =========================================================
        // DEV-REPORT-001
        // STAFF-REPORT-001
        // PERSONAL PERFORMANCE REPORT
        // =========================================================

        Task<ContributorPerformanceReportDto>
            GetPersonalPerformanceReportAsync(
                Guid userId,
                DateTime? startDate = null,
                DateTime? endDate = null);

        // =========================================================
        // DEV-REPORT-002
        // STAFF-REPORT-002
        // TASK HISTORY
        // =========================================================

        Task<List<ContributorTaskHistoryDto>>
            GetTaskHistoryAsync(
                Guid userId,
                Guid? projectId = null,
                Guid? sprintId = null,
                ProjectTaskStatus? status = null,
                DateTime? startDate = null,
                DateTime? endDate = null);

        // =========================================================
        // VIEW SINGLE TASK HISTORY
        // =========================================================

        Task<ContributorTaskHistoryDto?>
            GetTaskHistoryByIdAsync(
                Guid userId,
                Guid taskId);
    }
}
