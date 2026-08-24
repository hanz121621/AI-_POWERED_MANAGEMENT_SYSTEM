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


        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(Guid id)
        {
            var task =
                await _taskService.GetTaskByIdAsync(id);

            if (task == null)
                return NotFound("Task not found.");

            return Ok(task);
        }

        // GET: api/tasks/sprint/{sprintId}
        [HttpGet("sprint/{sprintId}")]
        public async Task<IActionResult> GetSprintTasks(
            Guid sprintId)
        {
            var tasks =
                await _taskService.GetSprintTasksAsync(sprintId);

            return Ok(tasks);
        }

        // GET: api/tasks/developer/{developerId}
        [HttpGet("developer/{developerId}")]
        public async Task<IActionResult> GetDeveloperTasks(
            Guid developerId)
        {
            var tasks =
                await _taskService.GetDeveloperTasksAsync(
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
// GET ASSIGNABLE DEVELOPERS
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