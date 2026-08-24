using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.Interfaces.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Projects
{
    [ApiController]
    [Route("api/projects")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IProjectAssignmentService _assignmentService;

        public ProjectsController(
            IProjectService projectService,
            IProjectAssignmentService assignmentService)
        {
            _projectService = projectService;
            _assignmentService = assignmentService;
        }

        // =========================================================
        // GET ALL PROJECTS
        // PROJ-001
        // =========================================================

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var projects =
                    await _projectService.GetAllAsync();

                return Ok(projects);
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
        // GET ACTIVE PROJECTS
        // =========================================================

        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            try
            {
                var projects =
                    await _projectService.GetActiveAsync();

                return Ok(projects);
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to load active projects. Please try again."
                    });
            }
        }


        // =========================================================
        // GET ARCHIVED PROJECTS
        // PROJ-002
        // =========================================================

        [HttpGet("archived")]
        public async Task<IActionResult> GetArchived()
        {
            try
            {
                var projects =
                    await _projectService.GetArchivedAsync();

                return Ok(projects);
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to load archived projects. Please try again."
                    });
            }
        }


        // =========================================================
        // GET PROJECT BY ID
        // PROJ-006
        // =========================================================

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var project =
                    await _projectService.GetByIdAsync(id);

                if (project == null)
                {
                    return NotFound(new
                    {
                        message = "Project not found."
                    });
                }

                return Ok(project);
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
        // CREATE PROJECT
        // PROJ-003
        // =========================================================

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateProjectDto dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            try
            {
                var createdBy = GetCurrentUserId();

                if (createdBy == null)
                {
                    return Unauthorized(new
                    {
                        message = "Unable to identify current user."
                    });
                }

                var project =
                    await _projectService.CreateAsync(
                        dto,
                        createdBy.Value);

                if (project == null)
                {
                    return BadRequest(new
                    {
                        message =
                            "Unable to create project. Please check the project information and configuration."
                    });
                }

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = project.Id },
                    project);
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to create project. Please try again."
                    });
            }
        }


        // =========================================================
        // UPDATE PROJECT
        // PROJ-004
        // =========================================================

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(
            Guid id,
            [FromBody] UpdateProjectDto dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            try
            {
                var result =
                    await _projectService.UpdateAsync(
                        id,
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

                    return BadRequest(new
                    {
                        message = result.Message,
                        project = result.Project
                    });
                }

                return Ok(result);
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to update project. Please try again."
                    });
            }
        }


        // =========================================================
        // DELETE PROJECT
        // PROJ-005
        // =========================================================

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var deleted =
                    await _projectService.DeleteAsync(id);

                if (!deleted)
                {
                    return NotFound(new
                    {
                        message = "Project not found."
                    });
                }

                return Ok(new
                {
                    message =
                        "Project deleted successfully."
                });
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to delete project. Please try again."
                    });
            }
        }


        // =========================================================
        // APPROVE PROJECT
        // =========================================================

        [HttpPost("{id:guid}/approve")]
        public async Task<IActionResult> Approve(Guid id)
        {
            try
            {
                var approved =
                    await _projectService.ApproveAsync(id);

                if (!approved)
                {
                    return BadRequest(new
                    {
                        message =
                            "Unable to approve project. The configured status transition may not be allowed."
                    });
                }

                return Ok(new
                {
                    message =
                        "Project approved successfully."
                });
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to approve project. Please try again."
                    });
            }
        }


        // =========================================================
        // REJECT PROJECT
        // =========================================================

        [HttpPost("{id:guid}/reject")]
        public async Task<IActionResult> Reject(Guid id)
        {
            try
            {
                var rejected =
                    await _projectService.RejectAsync(id);

                if (!rejected)
                {
                    return BadRequest(new
                    {
                        message =
                            "Unable to reject project. The configured status transition may not be allowed."
                    });
                }

                return Ok(new
                {
                    message =
                        "Project rejected successfully."
                });
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to reject project. Please try again."
                    });
            }
        }


        // =========================================================
        // CHANGE PROJECT STATUS
        // PROJ-008
        // =========================================================

        [HttpPut("{id:guid}/status")]
        public async Task<IActionResult> ChangeStatus(
            Guid id,
            [FromBody] ChangeProjectStatusRequest request)
        {
            if (request.StatusId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid project status."
                });
            }

            try
            {
                var result =
                    await _projectService.ChangeStatusAsync(
                        id,
                        request.StatusId);

                if (!result.Success)
                {
                    if (result.Message == "Project not found.")
                    {
                        return NotFound(new
                        {
                            message = result.Message
                        });
                    }

                    return BadRequest(new
                    {
                        message = result.Message,
                        project = result.Project
                    });
                }

                return Ok(result);
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to update project status. Please try again."
                    });
            }
        }


        // =========================================================
        // ASSIGN PROJECT TO MANAGER
        // =========================================================

        [HttpPost("{id:guid}/assign-manager")]
        public async Task<IActionResult> AssignManager(
            Guid id,
            [FromBody] AssignManagerRequest request)
        {
            if (request.ManagerId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid manager."
                });
            }

            try
            {
                var assigned =
                    await _projectService.AssignManagerAsync(
                        id,
                        request.ManagerId);

                if (!assigned)
                {
                    return BadRequest(new
                    {
                        message =
                            "Unable to assign manager. The project may not exist or already has a manager."
                    });
                }

                return Ok(new
                {
                    message =
                        "Project manager assigned successfully."
                });
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to assign project manager. Please try again."
                    });
            }
        }


        // =========================================================
        // CHANGE PROJECT MANAGER
        // =========================================================

        [HttpPut("{id:guid}/manager")]
        public async Task<IActionResult> ChangeManager(
            Guid id,
            [FromBody] AssignManagerRequest request)
        {
            if (request.ManagerId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid manager."
                });
            }

            try
            {
                var result =
                    await _assignmentService.ChangeManagerAsync(
                        new AssignProjectDto
                        {
                            ProjectId = id,
                            ManagerId = request.ManagerId
                        });

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

        [HttpGet("{id:guid}/manager")]
        public async Task<IActionResult> GetAssignedManager(
            Guid id)
        {
            try
            {
                var managerId =
                    await _assignmentService
                        .GetAssignedManagerAsync(id);

                if (managerId == null)
                {
                    return NotFound(new
                    {
                        message =
                            "Project manager not found."
                    });
                }

                return Ok(new
                {
                    projectId = id,
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
                            "Unable to load project manager."
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


        // =========================================================
        // CURRENT USER ID
        // =========================================================

        private Guid? GetCurrentUserId()
        {
            var userId =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return null;

            return Guid.TryParse(
                userId,
                out var id)
                ? id
                : null;
        }
    }


    // =============================================================
    // REQUEST MODELS
    // =============================================================

    public class ChangeProjectStatusRequest
    {
        public Guid StatusId { get; set; }
    }


    public class AssignManagerRequest
    {
        public Guid ManagerId { get; set; }
    }
}