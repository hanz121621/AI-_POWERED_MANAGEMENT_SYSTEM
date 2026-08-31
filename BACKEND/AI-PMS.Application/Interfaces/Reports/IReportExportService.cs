using AI_PMS.Application.DTOs.Reports;

namespace AI_PMS.Application.Interfaces.Reports
{
    public interface IReportExportService
    {
        Task<ReportExportFormatsDto> GetAvailableFormatsAsync();

        Task<ReportExportFileDto?> ExportProjectDashboardAsync(
            Guid managerId,
            Guid projectId,
            string format,
            CancellationToken cancellationToken = default);

        Task<ReportExportFileDto?> ExportProjectTimelineAsync(
            Guid managerId,
            Guid projectId,
            string format,
            CancellationToken cancellationToken = default);

        Task<ReportExportFileDto?> ExportSprintProgressAsync(
            Guid managerId,
            Guid projectId,
            Guid sprintId,
            string format,
            CancellationToken cancellationToken = default);
    }
}
