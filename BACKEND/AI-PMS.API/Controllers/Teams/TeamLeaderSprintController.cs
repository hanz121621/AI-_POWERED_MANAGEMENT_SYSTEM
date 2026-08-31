
using AI_PMS.Application.Interfaces.Teams;
using AI_PMS.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Teams
{
    [ApiController]
    [Route("api/team-leader/sprints")]
    [Authorize(Roles = "TeamLeader")]
    public class TeamLeaderSprintController : ControllerBase
    {
        private readonly ITeamLeaderSprintService _sprintService;

        public TeamLeaderSprintController(
            ITeamLeaderSprintService sprintService)
        {
            _sprintService = sprintService;
        }

        // =========================================================
        // TL-SPRINT-001
        // VIEW SPRINT TASKS
        // =========================================================
        //
        // GET:
        // api/team-leader/sprints/{sprintId}/tasks
        //
        // Optional query parameters:
        // status
        // priority
        // assignedContributorId
        // deadlineFrom
        // deadlineTo
        // search
        // sortDescending
        //
        // =========================================================

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
            // -----------------------------------------------------
            // GET CURRENT USER
            // -----------------------------------------------------

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

            // -----------------------------------------------------
            // VALIDATE SPRINT ID
            // -----------------------------------------------------

            if (sprintId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid sprint ID."
                });
            }

            // -----------------------------------------------------
            // CONVERT PRIORITY
            // -----------------------------------------------------
            //
            // The service interface currently expects:
            // string? priority
            //
            // The controller receives:
            // TaskPriority? priority
            //
            // Therefore convert the enum to string.
            // -----------------------------------------------------

            string? priorityValue =
                priority.HasValue
                    ? priority.Value.ToString()
                    : null;

            // -----------------------------------------------------
            // SERVICE
            // -----------------------------------------------------

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

            // -----------------------------------------------------
            // RESULT: NULL
            // -----------------------------------------------------
            //
            // The current service returns null when:
            // - sprint does not exist
            // - Team Leader has no access
            // - sprint has no team
            // - invalid IDs
            //
            // Since the service currently does not distinguish
            // these cases, return NotFound here.
            // -----------------------------------------------------

            if (result == null)
            {
                return NotFound(new
                {
                    message =
                        "Sprint not found or access denied."
                });
            }

            // -----------------------------------------------------
            // SUCCESS
            // -----------------------------------------------------

            return Ok(new
            {
                data = result
            });
        }

        // =========================================================
        // TL-SPRINT-002
        // VIEW SPRINT GOALS AND PROGRESS
        // =========================================================
        //
        // GET:
        // api/team-leader/sprints/{sprintId}/progress
        //
        // =========================================================

        [HttpGet("{sprintId:guid}/progress")]
        public async Task<IActionResult> GetSprintProgress(
            Guid sprintId)
        {
            // -----------------------------------------------------
            // GET CURRENT USER
            // -----------------------------------------------------

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

            // -----------------------------------------------------
            // VALIDATE SPRINT ID
            // -----------------------------------------------------

            if (sprintId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid sprint ID."
                });
            }

            // -----------------------------------------------------
            // SERVICE
            // -----------------------------------------------------

            var result =
                await _sprintService.GetSprintProgressAsync(
                    teamLeaderId,
                    sprintId);

            // -----------------------------------------------------
            // RESULT: NULL
            // -----------------------------------------------------
            //
            // The current service returns null when:
            // - sprint does not exist
            // - Team Leader has no access
            // - sprint has no team
            // - invalid IDs
            //
            // -----------------------------------------------------

            if (result == null)
            {
                return NotFound(new
                {
                    message =
                        "Sprint not found or access denied."
                });
            }

            // -----------------------------------------------------
            // SUCCESS
            // -----------------------------------------------------

            return Ok(new
            {
                data = result
            });
        }
    }
}
