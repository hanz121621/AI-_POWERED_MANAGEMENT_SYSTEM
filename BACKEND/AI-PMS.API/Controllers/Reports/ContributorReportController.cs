
using System.Security.Claims;
using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.Interfaces.Reports;
using AI_PMS.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Reports
{
    [ApiController]
    [Route("api/reports/contributor")]
    [Authorize(Roles = "Contributor")]
    public class ContributorReportController
        : ControllerBase
    {
        private readonly IContributorReportService
            _reportService;

        public ContributorReportController(
            IContributorReportService reportService)
        {
            _reportService = reportService;
        }

        // =========================================================
        // DEV-REPORT-001
        // STAFF-REPORT-001
        //
        // GET:
        // api/reports/contributor/performance
        // =========================================================

        [HttpGet("performance")]
        public async Task<
            ActionResult<ContributorPerformanceReportDto>>
            GetPersonalPerformanceReport(
                [FromQuery] DateTime? startDate = null,
                [FromQuery] DateTime? endDate = null)
        {
            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(
                    userIdClaim,
                    out var userId))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Authenticated user identity could not be determined."
                });
            }

            try
            {
                var report =
                    await _reportService
                        .GetPersonalPerformanceReportAsync(
                            userId,
                            startDate,
                            endDate);

                return Ok(report);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        success = false,
                        message =
                            "Unable to generate performance report. Please try again."
                    });
            }
        }

        // =========================================================
        // DEV-REPORT-002
        // STAFF-REPORT-002
        //
        // GET:
        // api/reports/contributor/tasks
        // =========================================================

        [HttpGet("tasks")]
        public async Task<
            ActionResult<List<ContributorTaskHistoryDto>>>
            GetTaskHistory(
                [FromQuery] Guid? projectId = null,
                [FromQuery] Guid? sprintId = null,
                [FromQuery] ProjectTaskStatus? status = null,
                [FromQuery] DateTime? startDate = null,
                [FromQuery] DateTime? endDate = null)
        {
            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(
                    userIdClaim,
                    out var userId))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Authenticated user identity could not be determined."
                });
            }

            try
            {
                var result =
                    await _reportService
                        .GetTaskHistoryAsync(
                            userId,
                            projectId,
                            sprintId,
                            status,
                            startDate,
                            endDate);

                if (result.Count == 0)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "No task history available.",
                        data = result
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Task history retrieved successfully.",
                    data = result
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        success = false,
                        message =
                            "Unable to load task history. Please try again."
                    });
            }
        }

        // =========================================================
        // VIEW SINGLE TASK HISTORY
        //
        // GET:
        // api/reports/contributor/tasks/{taskId}
        // =========================================================

        [HttpGet("tasks/{taskId:guid}")]
        public async Task<
            ActionResult<ContributorTaskHistoryDto>>
            GetTaskHistoryById(
                Guid taskId)
        {
            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(
                    userIdClaim,
                    out var userId))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Authenticated user identity could not be determined."
                });
            }

            try
            {
                var result =
                    await _reportService
                        .GetTaskHistoryByIdAsync(
                            userId,
                            taskId);

                if (result == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message =
                            "Task history is no longer available."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message =
                        "Task history retrieved successfully.",
                    data = result
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        success = false,
                        message =
                            "Unable to load task history. Please try again."
                    });
            }
        }
    }
}
