using AI_PMS.Application.DTOs.Tasks;
using AI_PMS.Application.Interfaces.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Tasks
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly ITeamLeaderTaskService _teamLeaderTaskService;

        public TaskController(
            ITaskService taskService,
            ITeamLeaderTaskService teamLeaderTaskService)
        {
            _taskService = taskService;
            _teamLeaderTaskService = teamLeaderTaskService;
        }

        // =====================================================
        // CREATE TASK
        // Manager only
        // =====================================================

        [HttpPost]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> CreateTask(
            [FromBody] CreateTaskDto dto)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null ||
                !Guid.TryParse(userIdClaim.Value, out var managerId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user."
                });
            }

            try
            {
                var success =
                    await _taskService.CreateTaskAsync(
                        managerId,
                        dto);

                if (!success)
                {
                    return BadRequest(new
                    {
                        message = "Sprint not found."
                    });
                }

                return Ok(new
                {
                    message = "Task created successfully."
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }

        // =====================================================
        // GET ALL TASKS
        // =====================================================

        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks =
                await _taskService.GetAllTasksAsync();

            return Ok(tasks);
        }

        // =====================================================
        // MY WORK
        // Contributor
        // =====================================================

        [HttpGet("my-work")]
        [Authorize(Roles = "Contributor")]
        public async Task<IActionResult> GetMyWork()
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null ||
                !Guid.TryParse(
                    userIdClaim.Value,
                    out var contributorSDId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user."
                });
            }

            try
            {
                var tasks =
                    await _taskService.GetMyWorkAsync(
                        contributorSDId);

                return Ok(tasks);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // =====================================================
        // VIEW MY SPRINT TASKS
        // Contributor
        // =====================================================

        [HttpGet("my-sprint/{sprintId:guid}")]
        [Authorize(Roles = "Contributor")]
        public async Task<IActionResult> GetMySprintTasks(
            Guid sprintId)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null ||
                !Guid.TryParse(
                    userIdClaim.Value,
                    out var userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user ID."
                });
            }

            try
            {
                var result =
                    await _taskService.GetMySprintTasksAsync(
                        userId,
                        sprintId);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message =
                            "Sprint not found or unavailable."
                    });
                }

                return Ok(result);
            }
            catch
            {
                return StatusCode(500, new
                {
                    message =
                        "Unable to load sprint information. Please try again."
                });
            }
        }

        // =====================================================
        // UPDATE MY TASK STATUS
        // Contributor
        // =====================================================

        [HttpPut("{id:guid}/status")]
        [Authorize(Roles = "Contributor")]
        public async Task<IActionResult> UpdateMyTaskStatus(
            Guid id,
            [FromBody] UpdateTaskStatusDto dto)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null ||
                !Guid.TryParse(
                    userIdClaim.Value,
                    out var userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user."
                });
            }

            if (dto == null)
            {
                return BadRequest(new
                {
                    message =
                        "Status information is required."
                });
            }

            try
            {
                var result =
                    await _taskService.UpdateMyTaskStatusAsync(
                        userId,
                        id,
                        dto);

                if (result.Message == "Task not found.")
                    return NotFound(new
                    {
                        message = result.Message
                    });

                if (result.Message == "Contributor not found.")
                    return Unauthorized(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "Contributor account is inactive.")
                    return Forbid();

                if (result.Message ==
                    "You cannot update this task.")
                    return Forbid();

                if (result.Message ==
                    "This task cannot be modified.")
                    return Conflict(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "Invalid task status.")
                    return BadRequest(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "This status change is not allowed.")
                    return BadRequest(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "The task already has this status.")
                    return Ok(new
                    {
                        message = result.Message,
                        task = result.Task
                    });

                if (result.Task != null)
                    return Ok(new
                    {
                        message = result.Message,
                        task = result.Task
                    });

                return BadRequest(new
                {
                    message = result.Message
                });
            }
            catch
            {
                return StatusCode(500, new
                {
                    message =
                        "Unable to update task status. Please try again."
                });
            }
        }

        // =====================================================
        // AI-001
        // GET TASK AI SUGGESTION
        // =====================================================

        [HttpGet("{id:guid}/ai-suggestion")]
        public async Task<IActionResult> GetTaskAiSuggestion(Guid id)
        {
            try
            {
                var task =
                    await _taskService.GetTaskByIdAsync(id);

                if (task == null)
                {
                    return NotFound(new
                    {
                        message = "Task not found."
                    });
                }

                var suggestion =
                    await _taskService.GenerateTaskSuggestionAsync(id);

                if (string.IsNullOrWhiteSpace(suggestion))
                {
                    return StatusCode(
                        StatusCodes.Status503ServiceUnavailable,
                        new
                        {
                            message =
                                "AI suggestion service is currently unavailable."
                        });
                }

                return Ok(new
                {
                    taskId = id,
                    suggestion
                });
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "Unable to generate AI task suggestion."
                    });
            }
        }

        // =====================================================
        // GET SPRINT TASKS
        // =====================================================

        [HttpGet("sprint/{sprintId:guid}")]
        public async Task<IActionResult> GetSprintTasks(
            Guid sprintId)
        {
            var tasks =
                await _taskService.GetSprintTasksAsync(sprintId);

            return Ok(tasks);
        }

        // =====================================================
        // VIEW TASK BY ID
        // =====================================================

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetTaskById(Guid id)
        {
            var task =
                await _taskService.GetTaskByIdAsync(id);

            if (task == null)
            {
                return NotFound(new
                {
                    message = "Task not found."
                });
            }

            if (User.IsInRole("Contributor"))
            {
                var userIdClaim =
                    User.FindFirst(
                        ClaimTypes.NameIdentifier);

                if (userIdClaim == null ||
                    !Guid.TryParse(
                        userIdClaim.Value,
                        out var userId))
                {
                    return Unauthorized(new
                    {
                        message = "Invalid user."
                    });
                }

                if (task.AssignedContributorSDId != userId)
                {
                    return Forbid();
                }
            }

            return Ok(task);
        }

        // =====================================================
        // GET CONTRIBUTOR TASKS
        // Supports both contributor and developer routes
        // =====================================================

        [HttpGet("contributor/{contributorId:guid}")]
        [HttpGet("developer/{contributorId:guid}")]
        public async Task<IActionResult> GetContributorTasks(
            Guid contributorId)
        {
            var tasks =
                await _taskService.GetContributorSDTasksAsync(
                    contributorId);

            return Ok(tasks);
        }

        // =====================================================
        // UPDATE TASK
        // Manager only
        // =====================================================

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> UpdateTask(
            Guid id,
            [FromBody] UpdateTaskDto dto)
        {
            var result =
                await _taskService.UpdateTaskAsync(
                    id,
                    dto);

            if (result.Message == "Task not found.")
            {
                return NotFound(new
                {
                    message = result.Message
                });
            }

            if (result.Task == null)
            {
                return Conflict(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                task = result.Task
            });
        }

        // =====================================================
        // DELETE TASK
        // Manager only
        // =====================================================

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var success =
                await _taskService.DeleteTaskAsync(id);

            if (!success)
            {
                return NotFound(new
                {
                    message = "Task not found."
                });
            }

            return Ok(new
            {
                message = "Task deleted successfully."
            });
        }

        // =====================================================
        // GET ASSIGNABLE USERS
        // =====================================================

        [HttpGet("assignable-users")]
        [Authorize(Roles = "Manager,Contributor")]
        public async Task<IActionResult> GetAssignableUsers()
        {
            var users =
                await _taskService.GetAssignableUsersAsync();

            return Ok(users);
        }

        // =====================================================
        // TASK-003
        // DELETE TASK
        // TEAM LEADER
        // =====================================================

        [HttpDelete("team-leader/{taskId:guid}")]
        [Authorize(Roles = "TeamLeader")]
        public async Task<IActionResult> TeamLeaderDeleteTask(
            Guid taskId)
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier);

            if (userIdClaim == null ||
                !Guid.TryParse(
                    userIdClaim.Value,
                    out var teamLeaderId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user."
                });
            }

            try
            {
                var result =
                    await _teamLeaderTaskService
                        .DeleteTaskAsync(
                            teamLeaderId,
                            taskId);

                if (result.Message == "Task not found.")
                    return NotFound(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "Completed tasks cannot be deleted. Archive the task instead.")
                    return Conflict(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "You are not authorised to delete this task.")
                    return Forbid();

                if (result.Success)
                    return Ok(new
                    {
                        message = result.Message
                    });

                return BadRequest(new
                {
                    message = result.Message
                });
            }
            catch
            {
                return StatusCode(500, new
                {
                    message =
                        "Unable to delete task. Please try again."
                });
            }
        }

        // =====================================================
        // TASK-005
        // SET TASK PRIORITY
        // TEAM LEADER
        // =====================================================

        [HttpPut("{taskId:guid}/priority")]
        [Authorize(Roles = "TeamLeader")]
        public async Task<IActionResult> SetTaskPriority(
            Guid taskId,
            [FromBody] SetTaskPriorityDto dto)
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
                    message = "Invalid user."
                });
            }

            if (dto == null)
            {
                return BadRequest(new
                {
                    message = "Invalid priority value."
                });
            }

            try
            {
                var result =
                    await _teamLeaderTaskService
                        .SetTaskPriorityAsync(
                            teamLeaderId,
                            taskId,
                            dto);

                if (result.Message == "Task not found.")
                    return NotFound(new
                    {
                        message = result.Message
                    });

                if (result.Message == "Invalid priority value.")
                    return BadRequest(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "You are not authorised to change this task priority.")
                    return Forbid();

                if (result.Message ==
                    "The task already has this priority.")
                    return Ok(new
                    {
                        message = result.Message,
                        task = result.Task
                    });

                if (result.Success &&
                    result.Task != null)
                    return Ok(new
                    {
                        message = result.Message,
                        task = result.Task
                    });

                return BadRequest(new
                {
                    message = result.Message
                });
            }
            catch
            {
                return StatusCode(500, new
                {
                    message =
                        "Unable to update task priority. Please try again."
                });
            }
        }

        // =====================================================
        // TASK-006
        // SET TASK DEADLINE
        // TEAM LEADER
        // =====================================================

        [HttpPut("team-leader/{taskId:guid}/deadline")]
        [Authorize(Roles = "TeamLeader")]
        public async Task<IActionResult> SetTaskDeadline(
            Guid taskId,
            [FromBody] SetTaskDeadlineDto dto)
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
                    message = "Invalid user."
                });
            }

            if (dto == null)
            {
                return BadRequest(new
                {
                    message = "Invalid deadline date."
                });
            }

            try
            {
                var result =
                    await _teamLeaderTaskService
                        .SetTaskDeadlineAsync(
                            teamLeaderId,
                            taskId,
                            dto);

                if (result.Message == "Task not found.")
                    return NotFound(new
                    {
                        message = result.Message
                    });

                if (result.Message == "Invalid deadline date.")
                    return BadRequest(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "Task deadline conflicts with sprint schedule.")
                    return BadRequest(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "You are not authorised to update this task deadline.")
                    return Forbid();

                if (result.Message ==
                    "The task already has this deadline.")
                    return Ok(new
                    {
                        message = result.Message,
                        task = result.Task
                    });

                if (result.Success &&
                    result.Task != null)
                    return Ok(new
                    {
                        message = result.Message,
                        task = result.Task
                    });

                return BadRequest(new
                {
                    message = result.Message
                });
            }
            catch
            {
                return StatusCode(500, new
                {
                    message =
                        "Unable to update task deadline. Please try again."
                });
            }
        }

        // =====================================================
        // TASK-007
        // VIEW TASKS
        // TEAM LEADER
        // =====================================================

        [HttpGet("team-leader/sprint/{sprintId:guid}")]
        [Authorize(Roles = "TeamLeader")]
        public async Task<IActionResult> GetTeamLeaderTasks(
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
                    message = "Invalid user."
                });
            }

            try
            {
                var result =
                    await _teamLeaderTaskService
                        .GetTeamLeaderTasksAsync(
                            teamLeaderId,
                            sprintId);

                if (result.Message == "Access denied.")
                    return Forbid();

                if (result.Message == "No tasks found.")
                    return Ok(new
                    {
                        message = result.Message,
                        tasks = result.Tasks
                    });

                if (result.Success)
                    return Ok(new
                    {
                        message = result.Message,
                        tasks = result.Tasks
                    });

                return BadRequest(new
                {
                    message = result.Message
                });
            }
            catch
            {
                return StatusCode(500, new
                {
                    message =
                        "Unable to load tasks. Please try again."
                });
            }
        }

        // =====================================================
        // TASK-008
        // UPDATE TASK STATUS
        // TEAM LEADER
        // =====================================================

        [HttpPut("team-leader/{taskId:guid}/status")]
        [Authorize(Roles = "TeamLeader")]
        public async Task<IActionResult> UpdateTaskStatus(
            Guid taskId,
            [FromBody] UpdateTaskStatusDto dto)
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
                    message = "Invalid user."
                });
            }

            if (dto == null)
            {
                return BadRequest(new
                {
                    message =
                        "This status change is not allowed."
                });
            }

            try
            {
                var result =
                    await _teamLeaderTaskService
                        .UpdateTaskStatusAsync(
                            teamLeaderId,
                            taskId,
                            dto);

                if (result.Message == "Task not found.")
                    return NotFound(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "This status change is not allowed.")
                    return BadRequest(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "You are not authorised to update this task status.")
                    return Forbid();

                if (result.Message ==
                    "The task already has this status.")
                    return Ok(new
                    {
                        message = result.Message,
                        task = result.Task
                    });

                if (result.Success &&
                    result.Task != null)
                    return Ok(new
                    {
                        message = result.Message,
                        task = result.Task
                    });

                return BadRequest(new
                {
                    message = result.Message
                });
            }
            catch
            {
                return StatusCode(500, new
                {
                    message =
                        "Unable to update task status. Please try again."
                });
            }
        }

        // =====================================================
        // TASK-004
        // ASSIGN TASK TO CONTRIBUTOR
        // TEAM LEADER
        // =====================================================

        [HttpPut(
            "team-leader/{taskId:guid}/assign/{contributorId:guid}")]
        [Authorize(Roles = "TeamLeader")]
        public async Task<IActionResult> TeamLeaderAssignTask(
            Guid taskId,
            Guid contributorId)
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier);

            if (userIdClaim == null ||
                !Guid.TryParse(
                    userIdClaim.Value,
                    out var teamLeaderId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user."
                });
            }

            try
            {
                var result =
                    await _teamLeaderTaskService
                        .AssignTaskAsync(
                            teamLeaderId,
                            taskId,
                            contributorId);

                if (result.Message == "Task not found.")
                    return NotFound(new
                    {
                        message = result.Message
                    });

                if (result.Message == "Team member not found.")
                    return NotFound(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "The selected team member is inactive.")
                    return BadRequest(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "The selected user must be a contributor.")
                    return BadRequest(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "Contributor is not assigned to your team.")
                    return BadRequest(new
                    {
                        message = result.Message
                    });

                if (result.Message ==
                    "You are not authorised to assign this task.")
                    return Forbid();

                if (result.Message ==
                    "This task is already assigned to this contributor.")
                    return Conflict(new
                    {
                        message = result.Message,
                        task = result.Task
                    });

                if (result.Success &&
                    result.Task != null)
                    return Ok(new
                    {
                        message = result.Message,
                        task = result.Task
                    });

                return BadRequest(new
                {
                    message = result.Message
                });
            }
            catch
            {
                return StatusCode(500, new
                {
                    message =
                        "Unable to assign task. Please try again."
                });
            }
        }
    }
}