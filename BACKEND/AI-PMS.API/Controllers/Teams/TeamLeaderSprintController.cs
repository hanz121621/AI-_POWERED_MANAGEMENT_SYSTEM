
using AI_PMS.Application.Interfaces.Teams;
using AI_PMS.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Teams
{
    [ApiController]
    [Route("api/team-leader/sprints")]
    [Authorize(Roles = "Contributor")]
    public class TeamLeaderSprintController : ControllerBase
    {
        private readonly ITeamLeaderSprintService _sprintService;

        public TeamLeaderSprintController(
            ITeamLeaderSprintService sprintService)
        {
            _sprintService = sprintService;
        }

        [HttpGet("{sprintId:guid}/tasks")]
        public async Task<IActionResult> GetSprintTasks(
            Guid sprintId,
            [FromQuery] ProjectTaskStatus? status = null,
            [FromQuery] TaskPriority? priority = null,
            [FromQuery] Guid? assignedContributorId = null,
            [FromQuery] DateTime? deadlineFrom = null,
            [FromQuery] DateTime? deadlineTo = null,
            [FromQuery] string? search = null,
            [FromQuery] bool sortDescending = false)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null ||
                !Guid.TryParse(
                    userIdClaim.Value,
                    out var teamLeaderId))
            {
                return Unauthorized(new
                {
                    message = "Invalid Team Leader identity."
                });
            }

            if (sprintId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid sprint ID."
                });
            }

            string? priorityValue =
                priority.HasValue
                    ? priority.Value.ToString()
                    : null;

            var result =
                await _sprintService.GetSprintTasksAsync(
                    teamLeaderId,
                    sprintId,
                    status,
                    priorityValue,
                    assignedContributorId,
                    deadlineFrom,
                    deadlineTo,
                    search,
                    sortDescending);

            if (result == null)
            {
                return NotFound(new
                {
                    message = "Sprint not found or access denied."
                });
            }

            return Ok(new
            {
                data = result
            });
        }

        [HttpGet("{sprintId:guid}/progress")]
        public async Task<IActionResult> GetSprintProgress(
            Guid sprintId)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null ||
                !Guid.TryParse(
                    userIdClaim.Value,
                    out var teamLeaderId))
            {
                return Unauthorized(new
                {
                    message = "Invalid Team Leader identity."
                });
            }

            if (sprintId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid sprint ID."
                });
            }

            var result =
                await _sprintService.GetSprintProgressAsync(
                    teamLeaderId,
                    sprintId);

            if (result == null)
            {
                return NotFound(new
                {
                    message = "Sprint not found or access denied."
                });
            }

            return Ok(new
            {
                data = result
            });
        }
    }
}
