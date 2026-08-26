using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.Interfaces.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Projects.Controllers
{
    [ApiController]
    [Route("api/projects/{projectId:guid}/specification")]
    [Authorize(Roles = "Manager")]
    public class ProjectSpecificationsController : ControllerBase
    {
        private readonly IProjectSpecificationService _service;

        public ProjectSpecificationsController(
            IProjectSpecificationService service)
        {
            _service = service;
        }

        // =========================================================
        // CREATE
        // =========================================================

        [HttpPost]
        public async Task<IActionResult> Create(
            Guid projectId,
            [FromBody] CreateProjectSpecificationDto dto)
        {
            try
            {
                var managerId = GetCurrentUserId();

                var result =
                    await _service.CreateAsync(
                        projectId,
                        dto,
                        managerId);

                return Ok(new
                {
                    message =
                        "Project specification created successfully.",
                    data = result
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
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }

        // =========================================================
        // GET
        // =========================================================

        [HttpGet]
        public async Task<IActionResult> Get(
            Guid projectId)
        {
            try
            {
                var managerId = GetCurrentUserId();

                var result =
                    await _service.GetByProjectIdAsync(
                        projectId,
                        managerId);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message =
                            "Project specification not found."
                    });
                }

                return Ok(result);
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
                return Forbid(ex.Message);
            }
        }

        // =========================================================
        // UPDATE
        // =========================================================

        [HttpPut]
        public async Task<IActionResult> Update(
            Guid projectId,
            [FromBody] CreateProjectSpecificationDto dto)
        {
            try
            {
                var managerId = GetCurrentUserId();

                var result =
                    await _service.UpdateAsync(
                        projectId,
                        dto,
                        managerId);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message =
                            "Project specification not found."
                    });
                }

                return Ok(new
                {
                    message =
                        "Project specification updated successfully.",
                    data = result
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
                return Forbid(ex.Message);
            }
        }

        // =========================================================
        // DELETE
        // =========================================================

        [HttpDelete]
        public async Task<IActionResult> Delete(
            Guid projectId)
        {
            try
            {
                var managerId = GetCurrentUserId();

                var deleted =
                    await _service.DeleteAsync(
                        projectId,
                        managerId);

                if (!deleted)
                {
                    return NotFound(new
                    {
                        message =
                            "Project specification not found."
                    });
                }

                return Ok(new
                {
                    message =
                        "Project specification deleted successfully."
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
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }

        // =========================================================
        // CURRENT USER
        // =========================================================

        private Guid GetCurrentUserId()
        {
            var userId =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(
                    userId,
                    out var managerId))
            {
                throw new UnauthorizedAccessException(
                    "Invalid manager identity.");
            }

            return managerId;
        }
    }
}