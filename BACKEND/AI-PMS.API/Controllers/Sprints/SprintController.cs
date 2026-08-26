
using System.Security.Claims;
using AI_PMS.Application.DTOs.Sprints;
using AI_PMS.Application.Interfaces.Sprints;
using AI_PMS.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Sprints
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Manager")]
    public class SprintController : ControllerBase
    {
        private readonly ISprintService _sprintService;

        public SprintController(ISprintService sprintService)
        {
            _sprintService = sprintService;
        }

        // =========================================================
        // CREATE SPRINT
        // POST: api/Sprint
        // =========================================================

        [HttpPost]
        public async Task<IActionResult> CreateSprint(
            [FromBody] CreateSprintDto dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var managerId = GetCurrentManagerId();

            if (!managerId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "Invalid manager identity."
                });
            }

            var result = await _sprintService.CreateSprintAsync(
                managerId.Value,
                dto);

            if (!result.Success)
            {
                if (result.Message == "Project not found.")
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message.Contains(
                    "not authorized",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return Forbid();
                }

                return Conflict(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message
            });
        }

        // =========================================================
        // GET ALL SPRINTS
        // GET: api/Sprint
        // =========================================================

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _sprintService.GetAllSprintsAsync();

            return Ok(result);
        }

        // =========================================================
        // GET SPRINT BY ID
        // GET: api/Sprint/{id}
        // =========================================================

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var sprint =
                await _sprintService.GetSprintByIdAsync(id);

            if (sprint == null)
            {
                return NotFound(new
                {
                    message = "Sprint not found."
                });
            }

            return Ok(sprint);
        }

        // =========================================================
        // GET PROJECT SPRINTS
        // GET: api/Sprint/project/{projectId}
        // =========================================================

        [HttpGet("project/{projectId:guid}")]
        public async Task<IActionResult> GetProjectSprints(
            Guid projectId)
        {
            var sprints =
                await _sprintService.GetProjectSprintsAsync(
                    projectId);

            return Ok(sprints);
        }

        // =========================================================
        // UPDATE SPRINT
        // PUT: api/Sprint/{id}
        // =========================================================

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(
            Guid id,
            [FromBody] UpdateSprintDto dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var managerId = GetCurrentManagerId();

            if (!managerId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "Invalid manager identity."
                });
            }

            var result =
                await _sprintService.UpdateSprintAsync(
                    id,
                    dto);

            if (!result.Success &&
                result.Message == "Sprint not found.")
            {
                return NotFound(new
                {
                    message = result.Message
                });
            }

            if (!result.Success &&
                result.Message.StartsWith(
                    "No changes",
                    StringComparison.OrdinalIgnoreCase))
            {
                return Conflict(new
                {
                    message = result.Message
                });
            }

            if (!result.Success &&
                result.Message.Contains(
                    "not authorized",
                    StringComparison.OrdinalIgnoreCase))
            {
                return Forbid();
            }

            if (!result.Success)
            {
                return Conflict(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message
            });
        }

        // =========================================================
        // SPRINT-003
        // ASSIGN SPRINT TO TEAM
        //
        // PUT: api/Sprint/{sprintId}/team/{teamId}
        // =========================================================

        [HttpPut("{sprintId:guid}/team/{teamId:guid}")]
        public async Task<IActionResult> AssignSprintToTeam(
            Guid sprintId,
            Guid teamId)
        {
            var managerId = GetCurrentManagerId();

            if (!managerId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "Manager identity could not be determined."
                });
            }

            var result =
                await _sprintService.AssignSprintToTeamAsync(
                    managerId.Value,
                    sprintId,
                    teamId);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                sprintId,
                teamId
            });
        }

        // =========================================================
        // DELETE SPRINT
        // DELETE: api/Sprint/{id}
        // SOFT DELETE ONLY
        // =========================================================

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success =
                await _sprintService.DeleteSprintAsync(id);

            if (!success)
            {
                return NotFound(new
                {
                    message = "Sprint not found."
                });
            }

            return Ok(new
            {
                message = "Sprint deleted successfully."
            });
        }

        // =========================================================
        // SPRINT-004
        // START SPRINT
        //
        // PUT: api/Sprint/{sprintId}/start
        // =========================================================

        [HttpPut("{sprintId:guid}/start")]
        public async Task<IActionResult> StartSprint(
            Guid sprintId)
        {
            var managerId = GetCurrentManagerId();

            if (!managerId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "Manager identity could not be determined."
                });
            }

            if (sprintId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid Sprint."
                });
            }

            var result =
                await _sprintService.StartSprintAsync(
                    managerId.Value,
                    sprintId);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message
            });
        }

        // =========================================================
        // SPRINT-006
        // COMPLETE SPRINT
        //
        // POST: api/Sprint/{sprintId}/complete
        // =========================================================

        [HttpPost("{sprintId:guid}/complete")]
        public async Task<IActionResult> CompleteSprint(
            Guid sprintId)
        {
            var managerId = GetCurrentManagerId();

            if (!managerId.HasValue)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid manager identity."
                });
            }

            if (sprintId == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid Sprint."
                });
            }

            var result =
                await _sprintService.CompleteSprintAsync(
                    managerId.Value,
                    sprintId);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return Ok(new
            {
                success = true,
                message = result.Message
            });
        }

        // =========================================================
        // SPRINT BACKLOG
        //
        // GET:
        // api/Sprint/{projectId}/{sprintId}/backlog
        //
        // Query parameters:
        // status
        // priority
        // assignedDeveloperId
        // deadline
        // createdAfter
        // search
        // descending
        // =========================================================

        [HttpGet("{projectId:guid}/{sprintId:guid}/backlog")]
        public async Task<IActionResult> GetSprintBacklog(
            Guid projectId,
            Guid sprintId,
            [FromQuery] ProjectTaskStatus? status = null,
            [FromQuery] string? priority = null,
            [FromQuery] Guid? assignedDeveloperId = null,
            [FromQuery] DateTime? deadline = null,
            [FromQuery] DateTime? createdAfter = null,
            [FromQuery] string? search = null,
            [FromQuery] bool descending = false)
        {
            try
            {
                var managerId = GetCurrentManagerId();

                if (!managerId.HasValue)
                {
                    return Unauthorized(new
                    {
                        message =
                            "Manager identity could not be determined."
                    });
                }

                if (projectId == Guid.Empty)
                {
                    return BadRequest(new
                    {
                        message = "Invalid project."
                    });
                }

                if (sprintId == Guid.Empty)
                {
                    return BadRequest(new
                    {
                        message = "Invalid sprint."
                    });
                }

                var result =
                    await _sprintService.GetSprintBacklogAsync(
                        managerId.Value,
                        sprintId,
                        status,
                        priority,
                        assignedDeveloperId,
                        deadline,
                        createdAfter,
                        search,
                        descending);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message = "Sprint backlog not found."
                    });
                }

                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
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
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "An error occurred while retrieving the sprint backlog."
                    });
            }
        }

        // =========================================================
        // CURRENT MANAGER ID
        // =========================================================

        private Guid? GetCurrentManagerId()
        {
            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub");

            if (string.IsNullOrWhiteSpace(userIdClaim))
                return null;

            return Guid.TryParse(
                userIdClaim,
                out var managerId)
                ? managerId
                : null;
        }
    }
}
