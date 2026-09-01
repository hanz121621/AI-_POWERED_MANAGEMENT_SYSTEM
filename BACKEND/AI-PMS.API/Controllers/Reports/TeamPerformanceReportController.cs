using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.Interfaces.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Reports
{
    [ApiController]
    [Route("api/reports")]
    [Authorize(Roles = "Manager")]
    public class TeamPerformanceReportController : ControllerBase
    {
        private readonly ITeamPerformanceReportService
            _teamPerformanceReportService;

        public TeamPerformanceReportController(
            ITeamPerformanceReportService
                teamPerformanceReportService)
        {
            _teamPerformanceReportService =
                teamPerformanceReportService;
        }

        // =====================================================
        // REPORT-003
        // VIEW TEAM PERFORMANCE REPORT
        //
        // GET:
        // api/reports/team-performance/{teamId}
        // =====================================================

        [HttpGet("team-performance/{teamId:guid}")]
        public async Task<ActionResult<TeamPerformanceReportDto>>
            GetTeamPerformanceReport(
                Guid teamId,
                [FromQuery] DateTime? startDate = null,
                [FromQuery] DateTime? endDate = null)
        {
            var report =
                await _teamPerformanceReportService
                    .GetTeamPerformanceReportAsync(
                        teamId,
                        startDate,
                        endDate);

            if (!report.Success)
            {
                return NotFound(report);
            }

            return Ok(report);
        }
    }
}