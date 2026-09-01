using AI_PMS.Application.Interfaces.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Reports
{
    [ApiController]
    [Route("api/projects")]
    [Authorize(Roles = "Manager")]
    public class ProjectDashboardController : ControllerBase
    {
        private readonly IProjectDashboardService _dashboardService;

        public ProjectDashboardController(
            IProjectDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        // =========================================================
        // REPORT-001
        // VIEW PROJECT DASHBOARD
        // =========================================================

        [HttpGet("{projectId:guid}/dashboard")]
        public async Task<IActionResult> GetProjectDashboard(
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
                // GET DASHBOARD
                // =================================================

                var result =
                    await _dashboardService
                        .GetProjectDashboardAsync(
                            managerId.Value,
                            projectId);

                // =================================================
                // AUTHORIZATION / NOT FOUND
                // =================================================

                if (!result.Success)
                {
                    return StatusCode(
                        StatusCodes.Status403Forbidden,
                        new
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
                            "Unable to load project dashboard. Please try again."
                    });
            }
        }

        // =========================================================
        // CURRENT USER
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