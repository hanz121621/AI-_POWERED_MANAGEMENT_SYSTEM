using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.Interfaces.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Reports
{
    [ApiController]
    [Route("api/reports")]
    [Authorize(Roles = "Manager")]
    public class SprintProgressController : ControllerBase
    {
        private readonly ISprintProgressService
            _sprintProgressService;

        public SprintProgressController(
            ISprintProgressService sprintProgressService)
        {
            _sprintProgressService =
                sprintProgressService;
        }

        // =========================================================
        // REPORT-004
        // VIEW SPRINT PROGRESS
        // =========================================================

        [HttpGet(
            "projects/{projectId:guid}/sprints/{sprintId:guid}/progress")]
        public async Task<ActionResult<SprintProgressDto>>
            GetSprintProgress(
                Guid projectId,
                Guid sprintId,
                CancellationToken cancellationToken)
        {
            // =====================================================
            // GET CURRENT MANAGER
            // =====================================================

            var managerIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(
                    managerIdClaim,
                    out var managerId))
            {
                return Unauthorized(
                    new
                    {
                        message =
                            "Invalid manager identity."
                    });
            }

            try
            {
                var result =
                    await _sprintProgressService
                        .GetSprintProgressAsync(
                            projectId,
                            sprintId,
                            managerId,
                            cancellationToken);

                if (result == null)
                {
                    return NotFound(
                        new
                        {
                            message =
                                "Sprint progress not found."
                        });
                }

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(
                    new
                    {
                        message = ex.Message
                    });
            }
            catch (UnauthorizedAccessException )
            {
                return Forbid();
            }
        }
    }
}