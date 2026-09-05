using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.Interfaces.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AI_PMS.Application.DTOs.AI;
using AI_PMS.Application.Interfaces.AI;

namespace AI_PMS.API.Controllers.Projects
{
    [ApiController]
    [Route("api/projects")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IProjectAssignmentService _assignmentService;
        private readonly IAiSuggestionService _aiSuggestionService;


        public ProjectsController(
            IProjectService projectService,
            IProjectAssignmentService assignmentService,
            IAiSuggestionService aiSuggestionService)
        {
            _projectService = projectService;
            _assignmentService = assignmentService;
            _aiSuggestionService = aiSuggestionService;
        }

        // =====================================================
        // AI-001
        // GET AI PROJECT SUGGESTION
        // =====================================================

        // GET: api/projects/{id}/ai-suggestion
        [HttpGet("{id:guid}/ai-suggestion")]
        public async Task<IActionResult> GetAiSuggestion(Guid id)
        {
            try
            {
                var project = await _projectService.GetByIdAsync(id);

                if (project == null)
                {
                    return NotFound(new
                    {
                        message = "Project not found."
                    });
                }

                // Map the project to the DTO expected by the AI service
                var request = new GenerateAiSuggestionRequestDto
                {
                    ProjectId = project.Id,
                    ProjectName = project.Name,
                    ProjectDescription = project.Description,
                    CurrentStatus = project.StatusName ?? "Unknown",
                    ActiveTasks = 0,
                    Deadline = project.Deadline.ToString("yyyy-MM-dd")
                };

                var suggestion =
                    await _aiSuggestionService.GenerateSuggestionForProjectAsync(request);

                if (suggestion == null)
                {
                    return StatusCode(
                        StatusCodes.Status503ServiceUnavailable,
                        new
                        {
                            message = "AI suggestion service is currently unavailable."
                        });
                }

                return Ok(new
                {
                    projectId = project.Id,
                    suggestion = suggestion
                });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = "Unable to generate AI project suggestion.",
                        error = ex.Message
                    });
            }
        }
        // =========================================================
        // PM-004
        // VIEW ASSIGNED PROJECTS
        // MANAGER
        // =========================================================

        [HttpGet("my-projects")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetMyProjects()
        {
            try
            {
                var managerId = GetCurrentUserId();

                if (!managerId.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = "Invalid manager identity."
                    });
                }

                var projects =
                    await _projectService.GetAssignedProjectsAsync(
                        managerId.Value);

                if (!projects.Any())
                {
                    return Ok(new
                    {
                        message =
                            "No projects are currently assigned to you.",
                        data = projects
                    });
                }

                return Ok(new
                {
                    message =
                        "Assigned projects retrieved successfully.",
                    data = projects
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new
                {
                    message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message =
                        "An error occurred while retrieving assigned projects."
                });
            }
        }

        // =========================================================
        // DEVELOPER
        // VIEW ASSIGNED PROJECTS
        // =========================================================

        [HttpGet("my-developer-projects")]
        [Authorize(Roles = "Contributor")]
        public async Task<IActionResult> GetMyDeveloperProjects()
        {
            try
            {
                var developerId = GetCurrentUserId();

                // =====================================================
                // DEBUG AUTHENTICATION
                // =====================================================

                Console.WriteLine("========================================");
                Console.WriteLine("GET MY DEVELOPER PROJECTS");
                Console.WriteLine(
                    $"IsAuthenticated: {User.Identity?.IsAuthenticated}");
                Console.WriteLine(
                    $"Name: {User.Identity?.Name}");
                Console.WriteLine(
                    $"NameIdentifier: {User.FindFirstValue(ClaimTypes.NameIdentifier)}");
                Console.WriteLine(
                    $"Role: {User.FindFirstValue(ClaimTypes.Role)}");
                Console.WriteLine(
                    $"DeveloperId: {developerId}");
                Console.WriteLine("========================================");

                // =====================================================
                // VALIDATE AUTHENTICATED USER
                // =====================================================

                if (!developerId.HasValue)
                {
                    Console.WriteLine(
                        "DEVELOPER PROJECTS: Invalid developer identity.");

                    return Unauthorized(new
                    {
                        message = "Invalid developer identity."
                    });
                }

                // =====================================================
                // GET PROJECTS
                // =====================================================

                var projects =
                    await _projectService.GetDeveloperProjectsAsync(
                        developerId.Value);

                // =====================================================
                // SUCCESS
                // =====================================================

                return Ok(new
                {
                    message = projects.Any()
                        ? "Developer projects retrieved successfully."
                        : "No projects are assigned to your teams.",
                    data = projects
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                Console.WriteLine(
                    "========================================");
                Console.WriteLine(
                    "GET MY DEVELOPER PROJECTS - UNAUTHORIZED");
                Console.WriteLine(
                    $"Message: {ex.Message}");
                Console.WriteLine(
                    $"StackTrace: {ex.StackTrace}");
                Console.WriteLine(
                    "========================================");

                return Unauthorized(new
                {
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    "========================================");
                Console.WriteLine(
                    "GET MY DEVELOPER PROJECTS - ERROR");
                Console.WriteLine(
                    $"Message: {ex.Message}");
                Console.WriteLine(
                    $"InnerException: {ex.InnerException?.Message}");
                Console.WriteLine(
                    $"StackTrace: {ex.StackTrace}");
                Console.WriteLine(
                    "========================================");

                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "An error occurred while retrieving developer projects.",
                        error = ex.Message,
                        innerError = ex.InnerException?.Message
                    });
            }
        }

        // =========================================================
        // PM-005
        // UPDATE PROJECT TIMELINE
        // =========================================================

        [HttpPut("{projectId:guid}/timeline")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> UpdateTimeline(
            Guid projectId,
            [FromBody] UpdateProjectTimelineDto dto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            if (dto == null)
            {
                return BadRequest(new
                {
                    message = "Timeline information is required."
                });
            }

            try
            {
                // Get authenticated Manager from JWT
                var managerId = GetCurrentUserId();

                if (!managerId.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = "Invalid manager identity."
                    });
                }

                var result =
                    await _projectService.UpdateTimelineAsync(
                        projectId,
                        dto,
                        managerId.Value);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message = "Project not found."
                    });
                }

                return Ok(new
                {
                    message =
                        "Project timeline updated successfully.",
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
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new
                    {
                        message = ex.Message
                    });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message =
                        "An error occurred while updating the project timeline."
                });
            }
        }

        // =========================================================
        // PM-006
        // SET / UPDATE PROJECT DEADLINE
        // =========================================================

        [HttpPut("{projectId:guid}/deadline")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> UpdateDeadline(
            Guid projectId,
            [FromBody] UpdateProjectDeadlineDto dto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            if (dto == null)
            {
                return BadRequest(new
                {
                    message = "Deadline information is required."
                });
            }

            try
            {
                // Get authenticated Manager from JWT
                var managerId = GetCurrentUserId();

                if (!managerId.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = "Invalid manager identity."
                    });
                }

                var result =
                    await _projectService.UpdateDeadlineAsync(
                        projectId,
                        dto,
                        managerId.Value);

                if (!result.Success)
                {
                    if (result.Message == "Project not found.")
                    {
                        return NotFound(new
                        {
                            message = result.Message,
                            data = result.Project
                        });
                    }

                    return Conflict(new
                    {
                        message = result.Message,
                        data = result.Project
                    });
                }

                return Ok(new
                {
                    message =
                        "Project deadline updated successfully.",
                    data = result.Project
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
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new
                    {
                        message = ex.Message
                    });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message =
                        "An error occurred while updating the project deadline."
                });
            }
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
            catch (Exception ex)
            {
                Console.WriteLine("======================================");
                Console.WriteLine("GET /api/projects FAILED");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine(
                    $"InnerException: {ex.InnerException?.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                Console.WriteLine("======================================");

                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = "Unable to load projects.",
                        error = ex.Message,
                        innerError = ex.InnerException?.Message
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
            {
                return ValidationProblem(ModelState);
            }

            try
            {
                var createdBy = GetCurrentUserId();

                if (!createdBy.HasValue)
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
            {
                return ValidationProblem(ModelState);
            }

            try
            {
                var updatedBy = GetCurrentUserId();

                if (!updatedBy.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = "Unable to identify current user."
                    });
                }

                var result =
                    await _projectService.UpdateAsync(
                        id,
                        dto,
                        updatedBy.Value);

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
        // COMM-004
        // SOFT DELETE + ACTIVITY LOG
        // =========================================================

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                // =====================================================
                // GET AUTHENTICATED USER
                // =====================================================

                var deletedBy = GetCurrentUserId();

                if (!deletedBy.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = "Unable to identify current user."
                    });
                }

                // =====================================================
                // SOFT DELETE PROJECT
                // =====================================================

                var deleted =
                    await _projectService.DeleteAsync(
                        id,
                        deletedBy.Value);

                if (!deleted)
                {
                    return NotFound(new
                    {
                        message =
                            "Project not found or has already been deleted."
                    });
                }

                // =====================================================
                // SUCCESS
                // =====================================================

                return Ok(new
                {
                    message =
                        "Project deleted successfully."
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new
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
                var approvedBy = GetCurrentUserId();

                if (!approvedBy.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = "Unable to identify current user."
                    });
                }

                var approved =
                    await _projectService.ApproveAsync(
                        id,
                        approvedBy.Value);

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
                var rejectedBy = GetCurrentUserId();

                if (!rejectedBy.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = "Unable to identify current user."
                    });
                }

                var rejected =
                    await _projectService.RejectAsync(
                        id,
                        rejectedBy.Value);

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
        // AI-002: PREDICT PROJECT RISK
        // =========================================================
        [HttpGet("{id:guid}/ai-risk")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> PredictProjectRisk(Guid id)
        {
            try
            {
                var managerId = GetCurrentUserId();

                if (!managerId.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = "Invalid user identity."
                    });
                }

                var prediction =
                    await _aiSuggestionService.PredictProjectRiskAsync(
                        id,
                        managerId.Value);

                return Ok(new
                {
                    success = true,
                    projectId = id,
                    data = prediction
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = "Unable to generate AI risk prediction.",
                        error = ex.Message
                    });
            }
        }

        // =========================================================
        // AI-008: GENERATE PROJECT SUMMARY
        // =========================================================
        [HttpGet("{id:guid}/ai-summary")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GenerateProjectSummary(Guid id)
        {
            try
            {
                var managerId = GetCurrentUserId();

                if (!managerId.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = "Invalid user identity."
                    });
                }

                var summary =
                    await _aiSuggestionService.GenerateProjectSummaryAsync(
                        id,
                        managerId.Value);

                return Ok(new
                {
                    success = true,
                    projectId = id,
                    data = summary
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = "Unable to generate AI project summary.",
                        error = ex.Message
                    });
            }
        }

        // =========================================================
        // AI-003: GENERATE PROJECT RECOMMENDATIONS
        // =========================================================
        [HttpGet("{id:guid}/ai-recommendations")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GenerateRecommendations(Guid id)
        {
            try
            {
                var managerId = GetCurrentUserId();

                if (!managerId.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = "Invalid user identity."
                    });
                }

                var recommendations =
                    await _aiSuggestionService
                        .GenerateProjectRecommendationsAsync(
                            id,
                            managerId.Value);

                return Ok(new
                {
                    success = true,
                    projectId = id,
                    data = recommendations
                });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to generate project recommendations.",
                        error = ex.Message
                    });
            }
        }
        
        // =========================================================
        // AI-009: DETECT PROJECT BOTTLENECKS
        // =========================================================
        [HttpGet("{id:guid}/ai-bottlenecks")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> DetectBottlenecks(Guid id)
        {
            try
            {
                var managerId = GetCurrentUserId();

                if (!managerId.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = "Invalid user identity."
                    });
                }

                var bottlenecks =
                    await _aiSuggestionService
                        .DetectProjectBottlenecksAsync(
                            id,
                            managerId.Value);

                return Ok(new
                {
                    success = true,
                    projectId = id,
                    data = bottlenecks
                });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to detect project bottlenecks.",
                        error = ex.Message
                    });
            }
        }

        // =========================================================
        // PM-007
        // MANAGE PROJECT STATUS
        // =========================================================

        [HttpPut("{id:guid}/status")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> ChangeStatus(
            Guid id,
            [FromBody] ChangeProjectStatusRequest request)
        {
            if (request == null)
            {
                return BadRequest(new
                {
                    message = "Status information is required."
                });
            }

            if (request.StatusId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid project status."
                });
            }

            try
            {
                // =====================================================
                // GET AUTHENTICATED MANAGER
                // =====================================================

                var managerId = GetCurrentUserId();

                if (!managerId.HasValue)
                {
                    return Unauthorized(new
                    {
                        message =
                            "Unable to identify authenticated manager."
                    });
                }

                // =====================================================
                // CHANGE STATUS
                // =====================================================

                var result =
                    await _projectService.ChangeStatusAsync(
                        id,
                        request.StatusId,
                        managerId.Value,
                        request.Notes);

                // =====================================================
                // PROJECT NOT FOUND
                // =====================================================

                if (!result.Success &&
                    result.Message == "Project not found.")
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                // =====================================================
                // BUSINESS VALIDATION
                // =====================================================

                if (!result.Success)
                {
                    return BadRequest(new
                    {
                        message = result.Message,
                        project = result.Project
                    });
                }

                // =====================================================
                // SUCCESS
                // =====================================================

                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception)
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
            if (request == null ||
                request.ManagerId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid manager."
                });
            }

            try
            {
                var assignedBy = GetCurrentUserId();

                if (!assignedBy.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = "Unable to identify current user."
                    });
                }

                var assigned =
                    await _projectService.AssignManagerAsync(
                        id,
                        request.ManagerId,
                        assignedBy.Value);

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
            if (request == null ||
                request.ManagerId == Guid.Empty)
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
        // DEBUG AUTHENTICATION
        // =========================================================

        [HttpGet("debug-auth")]
        public IActionResult DebugAuth()
        {
            return Ok(new
            {
                isAuthenticated =
                    User.Identity?.IsAuthenticated,

                name =
                    User.Identity?.Name,

                nameIdentifier =
                    User.FindFirstValue(
                        ClaimTypes.NameIdentifier),

                role =
                    User.FindFirstValue(
                        ClaimTypes.Role),

                allClaims = User.Claims.Select(c => new
                {
                    type = c.Type,
                    value = c.Value
                })
            });
        }
        // =========================================================
        // AI-004: ANALYZE TEAM PERFORMANCE
        // =========================================================
        [HttpGet("{id:guid}/ai-team-performance")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> AnalyzeTeamPerformance(Guid id)
        {
            var managerId = GetCurrentUserId();
            if (!managerId.HasValue) return Unauthorized(new { message = "Invalid user identity." });
            try {
                var result = await _aiSuggestionService.AnalyzeTeamPerformanceAsync(id, managerId.Value);
                return Ok(new { success = true, projectId = id, data = result });
            } catch (Exception ex) { return StatusCode(500, new { message = "Unable to analyze team performance.", error = ex.Message }); }
        }

        // =========================================================
        // AI-005: PREDICT PROJECT PROGRESS
        // =========================================================
        [HttpGet("{id:guid}/ai-progress-prediction")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> PredictProjectProgress(Guid id)
        {
            var managerId = GetCurrentUserId();
            if (!managerId.HasValue) return Unauthorized(new { message = "Invalid user identity." });
            try {
                var result = await _aiSuggestionService.PredictProjectProgressAsync(id, managerId.Value);
                return Ok(new { success = true, projectId = id, data = result });
            } catch (Exception ex) { return StatusCode(500, new { message = "Unable to predict progress.", error = ex.Message }); }
        }

        // =========================================================
        // AI-006: AI DEADLINE PREDICTION
        // =========================================================
        [HttpGet("{id:guid}/ai-deadline-prediction")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> PredictDeadline(Guid id)
        {
            var managerId = GetCurrentUserId();
            if (!managerId.HasValue) return Unauthorized(new { message = "Invalid user identity." });
            try {
                var result = await _aiSuggestionService.PredictDeadlineAsync(id, managerId.Value);
                return Ok(new { success = true, projectId = id, data = result });
            } catch (Exception ex) { return StatusCode(500, new { message = "Unable to predict deadline.", error = ex.Message }); }
        }

        // =========================================================
        // AI-007: GENERATE SPRINT PLANNING SUGGESTIONS
        // =========================================================
        [HttpGet("{id:guid}/ai-sprint-planning")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GenerateSprintPlanning(Guid id)
        {
            var managerId = GetCurrentUserId();
            if (!managerId.HasValue) return Unauthorized(new { message = "Invalid user identity." });
            try {
                var result = await _aiSuggestionService.GenerateSprintPlanningSuggestionsAsync(id, managerId.Value);
                return Ok(new { success = true, projectId = id, data = result });
            } catch (Exception ex) { return StatusCode(500, new { message = "Unable to generate sprint suggestions.", error = ex.Message }); }
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
        // CURRENT AUTHENTICATED USER ID
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

    // =============================================================
    // REQUEST MODELS
    // =============================================================

    public class ChangeProjectStatusRequest
    {
        public Guid StatusId { get; set; }

        public string? Notes { get; set; }
    }

    public class AssignManagerRequest
    {
        public Guid ManagerId { get; set; }
    }
}
