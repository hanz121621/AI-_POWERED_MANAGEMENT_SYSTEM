using System.Security.Claims;
using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.Interfaces.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Reports
{
    [ApiController]
    [Route("api/reports/export")]
    [Authorize(Roles = "Manager")]
    public class ReportExportController : ControllerBase
    {
        private readonly IReportExportService _reportExportService;

        public ReportExportController(
            IReportExportService reportExportService)
        {
            _reportExportService = reportExportService;
        }

        // =========================================================
        // REPORT-006
        // GET AVAILABLE EXPORT FORMATS
        // =========================================================

        [HttpGet("formats")]
        public async Task<ActionResult<ReportExportFormatsDto>>
            GetAvailableFormats()
        {
            try
            {
                var result =
                    await _reportExportService
                        .GetAvailableFormatsAsync();

                return Ok(new
                {
                    message = "Available report export formats retrieved successfully.",
                    data = result
                });
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to retrieve report export formats."
                    });
            }
        }

        // =========================================================
        // EXPORT PROJECT DASHBOARD
        // =========================================================

        [HttpGet("projects/{projectId:guid}/dashboard")]
        public async Task<IActionResult> ExportProjectDashboard(
            Guid projectId,
            [FromQuery] string format,
            CancellationToken cancellationToken)
        {
            var managerId = GetCurrentUserId();

            if (!managerId.HasValue)
            {
                return Unauthorized(new
                {
                    message =
                        "Unable to identify authenticated manager."
                });
            }

            if (string.IsNullOrWhiteSpace(format))
            {
                return BadRequest(new
                {
                    message =
                        "Export format is required."
                });
            }

            try
            {
                var result =
                    await _reportExportService
                        .ExportProjectDashboardAsync(
                            managerId.Value,
                            projectId,
                            format,
                            cancellationToken);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message =
                            "Project dashboard could not be found or you are not authorized to access this project."
                    });
                }

                return File(
                    result.Content,
                    result.ContentType,
                    result.FileName);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new
                    {
                        message = ex.Message
                    });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (NotSupportedException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to export project dashboard."
                    });
            }
        }

        // =========================================================
        // EXPORT PROJECT TIMELINE
        // =========================================================

        [HttpGet("projects/{projectId:guid}/timeline")]
        public async Task<IActionResult> ExportProjectTimeline(
            Guid projectId,
            [FromQuery] string format,
            CancellationToken cancellationToken)
        {
            var managerId = GetCurrentUserId();

            if (!managerId.HasValue)
            {
                return Unauthorized(new
                {
                    message =
                        "Unable to identify authenticated manager."
                });
            }

            if (string.IsNullOrWhiteSpace(format))
            {
                return BadRequest(new
                {
                    message =
                        "Export format is required."
                });
            }

            try
            {
                var result =
                    await _reportExportService
                        .ExportProjectTimelineAsync(
                            managerId.Value,
                            projectId,
                            format,
                            cancellationToken);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message =
                            "Project timeline could not be found or you are not authorized to access this project."
                    });
                }

                return File(
                    result.Content,
                    result.ContentType,
                    result.FileName);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new
                    {
                        message = ex.Message
                    });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (NotSupportedException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to export project timeline."
                    });
            }
        }

        // =========================================================
        // EXPORT SPRINT PROGRESS
        // =========================================================

        [HttpGet(
            "projects/{projectId:guid}/sprints/{sprintId:guid}/progress")]
        public async Task<IActionResult> ExportSprintProgress(
            Guid projectId,
            Guid sprintId,
            [FromQuery] string format,
            CancellationToken cancellationToken)
        {
            var managerId = GetCurrentUserId();

            if (!managerId.HasValue)
            {
                return Unauthorized(new
                {
                    message =
                        "Unable to identify authenticated manager."
                });
            }

            if (string.IsNullOrWhiteSpace(format))
            {
                return BadRequest(new
                {
                    message =
                        "Export format is required."
                });
            }

            try
            {
                var result =
                    await _reportExportService
                        .ExportSprintProgressAsync(
                            managerId.Value,
                            projectId,
                            sprintId,
                            format,
                            cancellationToken);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message =
                            "Sprint progress could not be found or you are not authorized to access this project."
                    });
                }

                return File(
                    result.Content,
                    result.ContentType,
                    result.FileName);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new
                    {
                        message = ex.Message
                    });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (NotSupportedException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to export sprint progress."
                    });
            }
        }

        // =========================================================
        // CURRENT MANAGER
        // =========================================================

        private Guid? GetCurrentUserId()
        {
            var userId =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
            {
                return null;
            }

            return Guid.TryParse(
                userId,
                out var id)
                ? id
                : null;
        }
    }
}