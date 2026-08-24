using System.Security.Claims;
using AI_PMS.Application.DTOs.Sprints;
using AI_PMS.Application.Interfaces.Sprints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Sprints
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Manager")]
    public class SprintController : ControllerBase
    {
        private readonly ISprintService _service;

        public SprintController(ISprintService service)
        {
            _service = service;
        }

        // =========================================================
        // CREATE SPRINT
        // POST: api/Sprint
        // Manager only
        // =========================================================
        [HttpPost]
        public async Task<IActionResult> CreateSprint(
            [FromBody] CreateSprintDto dto)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid user."
                });
            }

            var managerId =
                Guid.Parse(userIdClaim.Value);

            var result =
                await _service.CreateSprintAsync(
                    managerId,
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
            var result =
                await _service.GetAllSprintsAsync();

            return Ok(result);
        }

        // =========================================================
        // GET SPRINT BY ID
        // GET: api/Sprint/{id}
        // =========================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var sprint =
                await _service.GetSprintByIdAsync(id);

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
        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetProjectSprints(
            Guid projectId)
        {
            var sprints =
                await _service.GetProjectSprintsAsync(
                    projectId);

            return Ok(sprints);
        }

        // =========================================================
        // UPDATE SPRINT
        // PUT: api/Sprint/{id}
        // Manager only
        // =========================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            Guid id,
            [FromBody] UpdateSprintDto dto)
        {
            var result =
                await _service.UpdateSprintAsync(
                    id,
                    dto);

            // Sprint does not exist
            if (!result.Success &&
                result.Message == "Sprint not found.")
            {
                return NotFound(new
                {
                    message = result.Message
                });
            }

            // No changes
            if (!result.Success &&
                result.Message.StartsWith("No changes"))
            {
                return Conflict(new
                {
                    message = result.Message
                });
            }

            // Duplicate / validation error
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
        // DELETE SPRINT
        // DELETE: api/Sprint/{id}
        // SOFT DELETE ONLY
        // =========================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success =
                await _service.DeleteSprintAsync(id);

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
    }
}