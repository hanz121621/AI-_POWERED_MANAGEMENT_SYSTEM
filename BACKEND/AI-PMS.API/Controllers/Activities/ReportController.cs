using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.Interfaces.Activities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Reports
{
    [ApiController]
    [Route("api/reports")]
    [Authorize(Roles = "Admin")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(
            IReportService reportService)
        {
            _reportService = reportService;
        }

        // =====================================================
        // VIEW SYSTEM REPORT
        // GET: api/reports/system
        // =====================================================

        [HttpGet("system")]
        public async Task<ActionResult<SystemReportDto>>
            GetSystemReport(
                [FromQuery] DateTime? startDate = null,
                [FromQuery] DateTime? endDate = null,
                [FromQuery] Guid? projectId = null,
                [FromQuery] Guid? teamId = null,
                [FromQuery] Guid? userId = null)
        {
            var report =
                await _reportService.GetSystemReportAsync(
                    startDate,
                    endDate,
                    projectId,
                    teamId,
                    userId);

            if (!report.Success)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    report);
            }

            return Ok(report);
        }
    }
}