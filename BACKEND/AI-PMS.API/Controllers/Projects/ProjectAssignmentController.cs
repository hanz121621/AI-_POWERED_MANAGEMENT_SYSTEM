using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.Interfaces.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Projects
{
    [ApiController]
    [Route("api/project-assignments")]
    [Authorize]
    public class ProjectAssignmentController : ControllerBase
    {
        private readonly IProjectAssignmentService _assignmentService;

        public ProjectAssignmentController(
            IProjectAssignmentService assignmentService)
        {
            _assignmentService = assignmentService;
        }

        // =========================================================
        // ASSIGN PROJECT TO MANAGER
        // =========================================================

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Assign(
            [FromBody] AssignProjectDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (dto.ProjectId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Project ID is required."
                });
            }

            if (dto.ManagerId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Manager ID is required."
                });
            }

            try
            {
                var result =
                    await _assignmentService.AssignProjectAsync(dto);

                if (!result)
                {
                    return BadRequest(new
                    {
                        message =
                            "Unable to assign project to manager."
                    });
                }

                return Ok(new
                {
                    message =
                        "Project assigned to manager successfully."
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
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
                            "Unable to assign project. Please try again."
                    });
            }
        }

        // =========================================================
        // CHANGE PROJECT MANAGER
        // =========================================================

        [HttpPut("manager")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ChangeManager(
            [FromBody] AssignProjectDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (dto.ProjectId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Project ID is required."
                });
            }

            if (dto.ManagerId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Manager ID is required."
                });
            }

            try
            {
                var result =
                    await _assignmentService.ChangeManagerAsync(dto);

                if (!result)
                {
                    return BadRequest(new
                    {
                        message =
                            "Unable to change project manager."
                    });
                }

                return Ok(new
                {
                    message =
                        "Project manager changed successfully."
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
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
                            "Unable to change project manager. Please try again."
                    });
            }
        }

        // =========================================================
        // GET ASSIGNED MANAGER
        // =========================================================

        [HttpGet("{projectId:guid}/manager")]
        public async Task<IActionResult> GetAssignedManager(
            Guid projectId)
        {
            try
            {
                var managerId =
                    await _assignmentService
                        .GetAssignedManagerAsync(projectId);

                if (managerId == null)
                {
                    return NotFound(new
                    {
                        message =
                            "No manager is assigned to this project."
                    });
                }

                return Ok(new
                {
                    projectId,
                    managerId
                });
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to load project assignment."
                    });
            }
        }

        // =========================================================
        // GET PROJECTS ASSIGNED TO MANAGER
        // =========================================================

        [HttpGet("manager/{managerId:guid}")]
        public async Task<IActionResult> GetManagerProjects(
            Guid managerId)
        {
            try
            {
                var projects =
                    await _assignmentService
                        .GetManagerProjectsAsync(managerId);

                return Ok(projects);
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to load manager projects."
                    });
            }
        }
    }
}