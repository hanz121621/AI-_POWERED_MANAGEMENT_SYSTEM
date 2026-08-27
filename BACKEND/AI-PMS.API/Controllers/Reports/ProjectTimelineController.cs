using AI_PMS.Application.Interfaces.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Reports
{
[ApiController]
[Route("api/reports/projects")]
[Authorize(Roles = "Manager")]
public class ProjectTimelineController : ControllerBase
{
private readonly IProjectTimelineService _service;

    public ProjectTimelineController(
        IProjectTimelineService service)
    {
        _service = service;
    }

    // =========================================================
    // REPORT-002
    // VIEW PROJECT TIMELINE
    // =========================================================

    [HttpGet("{projectId:guid}/timeline")]
    public async Task<IActionResult> GetProjectTimeline(
        Guid projectId)
    {
        try
        {
            // =================================================
            // GET AUTHENTICATED MANAGER
            // =================================================

            var managerId =
                GetCurrentUserId();

            if (!managerId.HasValue)
            {
                return Unauthorized(new
                {
                    message =
                        "Unable to identify authenticated manager."
                });
            }

            // =================================================
            // GET TIMELINE
            // =================================================

            var result =
                await _service.GetProjectTimelineAsync(
                    managerId.Value,
                    projectId);

            // =================================================
            // UNAUTHORIZED / NOT FOUND
            // =================================================

            if (!result.Success)
            {
                return NotFound(new
                {
                    message = result.Message
                });
            }

            // =================================================
            // SUCCESS
            // =================================================

            return Ok(new
            {
                message = result.Message,
                data = result.Data
            });
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
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message =
                        "Unable to retrieve project timeline. Please try again."
                });
        }
    }

    // =========================================================
    // CURRENT AUTHENTICATED USER
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

