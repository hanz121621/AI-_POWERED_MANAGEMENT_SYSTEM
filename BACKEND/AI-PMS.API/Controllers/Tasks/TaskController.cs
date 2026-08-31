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

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

       
 // =====================================================
// CREATE TASK
// Manager only
// =====================================================

// POST: api/tasks
[HttpPost]
[Authorize(Roles = "Manager")]
public async Task<IActionResult> CreateTask(
    [FromBody] CreateTaskDto dto)
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

        // GET: api/tasks
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks =
                await _taskService.GetAllTasksAsync();

            return Ok(tasks);
        }
        // =====================================================
                   // =====================================================
// MY WORK
// Developer / Staff Contributor
// =====================================================

// GET: api/tasks/my-work
[HttpGet("my-work")]
[Authorize(Roles = "Contributor")]
public async Task<IActionResult> GetMyWork()
{
    var userIdClaim =
        User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null ||
        !Guid.TryParse(userIdClaim.Value, out var contributorSDId))
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
// Developer / Staff
// =====================================================

// GET: api/tasks/my-sprint/{sprintId}
[HttpGet("my-sprint/{sprintId}")]
[Authorize(Roles = "Contributor")]
public async Task<IActionResult> GetMySprintTasks(Guid sprintId)
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

    if (!Guid.TryParse(userIdClaim.Value, out var userId))
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
                message = "Sprint not found or unavailable."
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
// Developer / Staff Contributor
// =====================================================

// PUT: api/tasks/{id}/status
[HttpPut("{id}/status")]
[Authorize(Roles = "Contributor")]
public async Task<IActionResult> UpdateMyTaskStatus(
    Guid id,
    [FromBody] UpdateTaskStatusDto dto)
{
    // -------------------------------------------------
    // Get logged-in user
    // -------------------------------------------------
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

    try
    {
        // -------------------------------------------------
        // Update task status
        // -------------------------------------------------
        var result =
            await _taskService.UpdateMyTaskStatusAsync(
                userId,
                id,
                dto);

        // -------------------------------------------------
        // Task not found
        // -------------------------------------------------
        if (result.Message == "Task not found.")
        {
            return NotFound(new
            {
                message = result.Message
            });
        }

        // -------------------------------------------------
        // Access denied
        // -------------------------------------------------
        if (result.Message ==
            "You cannot update this task.")
        {
            return Forbid();
        }

        // -------------------------------------------------
        // Completed task
        // -------------------------------------------------
        if (result.Message ==
            "This task cannot be modified.")
        {
            return Conflict(new
            {
                message = result.Message
            });
        }

        // -------------------------------------------------
        // Invalid transition
        // -------------------------------------------------
        if (result.Message ==
            "This status change is not allowed.")
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        // -------------------------------------------------
        // Same status
        // -------------------------------------------------
        if (result.Message ==
            "The task already has this status.")
        {
            return Ok(new
            {
                message = result.Message,
                task = result.Task
            });
        }

        // -------------------------------------------------
        // Successful update
        // -------------------------------------------------
        return Ok(new
        {
            message = result.Message,
            task = result.Task
        });
    }
    catch (Exception)
    {
        return StatusCode(500, new
        {
            message =
                "Unable to update task status. Please try again."
        });
    }
}

// =====================================================
// VIEW TASK BY ID
// =====================================================

// GET: api/tasks/{id}
[HttpGet("{id}")]
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

    // -----------------------------------------------
    // If current user is a Contributor,
    // they can only view their own task.
    // -----------------------------------------------
    if (User.IsInRole("Contributor"))
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

        if (task.AssignedContributorSDId != userId)
        {
            return Forbid();
        }
    }

    return Ok(task);
}

        // GET: api/tasks/contributor/{developerId}
        [HttpGet("developer/{developerId}")]
        public async Task<IActionResult> GetContributorTasks(
            Guid developerId)
        {
            var tasks =
                await _taskService.GetContributorSDTasksAsync(
                    developerId);

            return Ok(tasks);
        }

   // =====================================================
// UPDATE TASK
// Manager only
// =====================================================

// PUT: api/tasks/{id}
[HttpPut("{id}")]
[Authorize(Roles = "Manager")]
public async Task<IActionResult> UpdateTask(
    Guid id,
    [FromBody] UpdateTaskDto dto)
{
    var result =
        await _taskService.UpdateTaskAsync(id, dto);

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

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var success =
                await _taskService.DeleteTaskAsync(id);

            if (!success)
                return NotFound("Task not found.");

            return Ok(new
            {
                message = "Task deleted successfully."
            });
        }
        // =====================================================
// GET ASSIGNABLE CONTRIBUTORS
// Manager only
// =====================================================

// GET: api/tasks/assignable-users
[HttpGet("assignable-users")]
[Authorize(Roles = "Manager")]
public async Task<IActionResult> GetAssignableUsers()
{
    var users =
        await _taskService.GetAssignableUsersAsync();

    return Ok(users);
}
    }
}

