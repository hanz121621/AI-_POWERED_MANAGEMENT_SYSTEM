using AI_PMS.Application.DTOs.Risks;
using AI_PMS.Application.Interfaces.Risks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Projects
{
    [ApiController]
    [Route("api/projects/{projectId:guid}/risks-issues")]
    [Authorize(Roles = "Manager")]
    public class RiskIssuesController : ControllerBase
    {
        private readonly IRiskIssueService _riskIssueService;

        public RiskIssuesController(
            IRiskIssueService riskIssueService)
        {
            _riskIssueService = riskIssueService;
        }

        // =========================================================
        // REPORT-003
        // VIEW RISKS AND ISSUES
        // =========================================================

        [HttpGet]
        public async Task<IActionResult> GetProjectRisksAndIssues(
            Guid projectId,
            [FromQuery] RiskIssueFilterDto? filter,
            CancellationToken cancellationToken)
        {
            try
            {
                // =================================================
                // GET AUTHENTICATED MANAGER
                // =================================================

                var managerId = GetCurrentUserId();

                if (!managerId.HasValue)
                {
                    return Unauthorized(new
                    {
                        message =
                            "Unable to identify authenticated manager."
                    });
                }

                // =================================================
                // GET RISKS AND ISSUES
                // =================================================

                var records =
                    await _riskIssueService
                        .GetProjectRisksAndIssuesAsync(
                            projectId,
                            managerId.Value,
                            filter,
                            cancellationToken);

                // =================================================
                // SUCCESS
                // =================================================

                return Ok(new
                {
                    message =
                        "Project risks and issues retrieved successfully.",

                    projectId,

                    count = records.Count(),

                    data = records
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
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
            catch (OperationCanceledException)
            {
                return StatusCode(
                    StatusCodes.Status499ClientClosedRequest,
                    new
                    {
                        message =
                            "The request was cancelled."
                    });
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to retrieve project risks and issues. Please try again."
                    });
            }
        }

        // =========================================================
        // CURRENT USER ID
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