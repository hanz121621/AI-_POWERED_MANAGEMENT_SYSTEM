using AI_PMS.Application.Interfaces.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Projects
{
    [ApiController]
    [Route("api/project-participation")]
    [Authorize(Roles = "Contributor")]
    public class ProjectParticipationController
        : ControllerBase
    {
        private readonly IProjectParticipationService
            _projectParticipationService;

        public ProjectParticipationController(
            IProjectParticipationService
                projectParticipationService)
        {
            _projectParticipationService =
                projectParticipationService;
        }


        // =========================================================
        // DEV-PROJECT-001
        // STAFF-PROJECT-001
        //
        // VIEW ASSIGNED PROJECTS
        // =========================================================

        [HttpGet("my-projects")]
        public async Task<IActionResult>
            GetMyProjects()
        {
            try
            {
                var userId =
                    GetCurrentUserId();

                if (!userId.HasValue)
                {
                    return Unauthorized(new
                    {
                        message =
                            "Unable to identify authenticated contributor."
                    });
                }

                var projects =
                    await _projectParticipationService
                        .GetAssignedProjectsAsync(
                            userId.Value);

                if (!projects.Any())
                {
                    return Ok(new
                    {
                        message =
                            "No assigned projects available.",
                        data = projects
                    });
                }

                return Ok(new
                {
                    message =
                        "Assigned projects retrieved successfully.",
                    count = projects.Count(),
                    data = projects
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
                            "Unable to load projects. Please try again."
                    });
            }
        }


        // =========================================================
        // DEV-PROJECT-002
        // STAFF-PROJECT-002
        //
        // VIEW PROJECT DETAILS
        // =========================================================

        [HttpGet("my-projects/{projectId:guid}")]
        public async Task<IActionResult>
            GetProjectDetails(
                Guid projectId)
        {
            try
            {
                var userId =
                    GetCurrentUserId();

                if (!userId.HasValue)
                {
                    return Unauthorized(new
                    {
                        message =
                            "Unable to identify authenticated contributor."
                    });
                }

                var project =
                    await _projectParticipationService
                        .GetProjectDetailsAsync(
                            projectId,
                            userId.Value);

                if (project == null)
                {
                    return NotFound(new
                    {
                        message =
                            "Project not found."
                    });
                }

                return Ok(new
                {
                    message =
                        "Project details retrieved successfully.",
                    data = project
                });
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new
                    {
                        message =
                            "Access denied."
                    });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
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
                            "Unable to load project details. Please try again."
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