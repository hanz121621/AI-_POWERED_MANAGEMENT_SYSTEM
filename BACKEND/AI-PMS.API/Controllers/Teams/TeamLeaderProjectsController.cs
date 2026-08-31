using AI_PMS.Application.Interfaces.Teams;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Teams
{
    [ApiController]
    [Route("api/team-leader/projects")]
    [Authorize(Roles = "TeamLeader")]
    public class TeamLeaderProjectsController : ControllerBase
    {
        private readonly ITeamLeaderProjectService
            _service;

        public TeamLeaderProjectsController(
            ITeamLeaderProjectService service)
        {
            _service = service;
        }

        // =========================================================
        // TL-PROJECT-001
        // VIEW ASSIGNED PROJECTS
        // =========================================================

        [HttpGet]
        public async Task<IActionResult>
            GetAssignedProjects()
        {
            try
            {
                var teamLeaderId =
                    GetCurrentUserId();

                if (teamLeaderId == null)
                {
                    return Unauthorized(new
                    {
                        message =
                            "Unable to identify current user."
                    });
                }

                var projects =
                    await _service
                        .GetAssignedProjectsAsync(
                            teamLeaderId.Value);

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
            catch
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
        // TL-PROJECT-002
        // VIEW PROJECT DETAILS
        // =========================================================

        [HttpGet("{projectId:guid}")]
        public async Task<IActionResult>
            GetProjectDetails(
                Guid projectId)
        {
            try
            {
                var teamLeaderId =
                    GetCurrentUserId();

                if (teamLeaderId == null)
                {
                    return Unauthorized(new
                    {
                        message =
                            "Unable to identify current user."
                    });
                }

                var project =
                    await _service
                        .GetProjectDetailsAsync(
                            teamLeaderId.Value,
                            projectId);

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
            catch (InvalidOperationException ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = ex.Message
                    });
            }
            catch
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