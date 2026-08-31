using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.Interfaces.Reports;
using AI_PMS.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Reports
{
    [ApiController]
    [Route("api/team-leader/reports/task-history")]
    [Authorize(Roles = "TeamLeader")]
    public class TeamLeaderTaskHistoryController
        : ControllerBase
    {
        private readonly ITeamLeaderTaskHistoryService
            _service;

        public TeamLeaderTaskHistoryController(
            ITeamLeaderTaskHistoryService service)
        {
            _service = service;
        }

        // =========================================================
        // GET TEAM TASK HISTORY
        // =========================================================

        [HttpGet]
        public async Task<ActionResult<List<TeamLeaderTaskHistoryDto>>>
            GetTaskHistory(
                [FromQuery] Guid? teamMemberId = null,
                [FromQuery] Guid? projectId = null,
                [FromQuery] Guid? sprintId = null,
                [FromQuery] ProjectTaskStatus? status = null,
                [FromQuery] DateTime? startDate = null,
                [FromQuery] DateTime? endDate = null,
                CancellationToken cancellationToken = default)
        {
            try
            {
                var userId =
                    GetCurrentUserId();

                var result =
                    await _service.GetTaskHistoryAsync(
                        userId,
                        teamMemberId,
                        projectId,
                        sprintId,
                        status,
                        startDate,
                        endDate,
                        cancellationToken);

                if (result.Count == 0)
                {
                    return Ok(new
                    {
                        success = true,
                        message =
                            "No team task history available.",
                        data = result
                    });
                }

                return Ok(new
                {
                    success = true,
                    message =
                        "Team task history retrieved successfully.",
                    data = result
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch
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
        // GET SINGLE TASK HISTORY
        // =========================================================

        [HttpGet("{taskId:guid}")]
        public async Task<ActionResult<TeamLeaderTaskHistoryDto>>
            GetTaskHistoryById(
                Guid taskId,
                CancellationToken cancellationToken = default)
        {
            try
            {
                var userId =
                    GetCurrentUserId();

                var result =
                    await _service.GetTaskHistoryByIdAsync(
                        userId,
                        taskId,
                        cancellationToken);

                if (result == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message =
                            "Task history not found."
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
            catch
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
        // CURRENT USER
        // =========================================================

        private Guid GetCurrentUserId()
        {
            var claim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(claim, out var userId))
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            return userId;
        }
    }
}