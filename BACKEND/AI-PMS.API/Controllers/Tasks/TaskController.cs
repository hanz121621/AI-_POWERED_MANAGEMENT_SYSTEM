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
        // AI-001
        // GET TASK AI SUGGESTION
        // =====================================================

        [HttpGet("{id:guid}/ai-suggestion")]
        public async Task<IActionResult> GetTaskAiSuggestion(Guid id)
        {
            try
            {
                var task = await _taskService.GetTaskByIdAsync(id);

                if (task == null)
                {
                    return NotFound(new { message = "Task not found." });
                }

                var suggestion = await _taskService.GenerateTaskSuggestionAsync(id);

                if (string.IsNullOrWhiteSpace(suggestion))
                {
                    return StatusCode(
                        StatusCodes.Status503ServiceUnavailable,
                        new { message = "AI suggestion service is currently unavailable." });
                }

                return Ok(new { taskId = id, suggestion = suggestion });
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new { message = "Unable to generate AI task suggestion." });
            }
        }

        // =====================================================
        // CREATE TASK
        // =====================================================

        [HttpPost]
        [Authorize(Roles = "Manager,Contributor")] // Adjusted to match typical roles
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { message = "Invalid user identity." });
            }

            try
            {
                var success = await _taskService.CreateTaskAsync(userId, dto);

                if (!success)
                {
                    return BadRequest(new { message = "Failed to create task. Sprint may not be found." });
                }

                return Ok(new { message = "Task created successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        // =====================================================
        // GET ALL TASKS
        // =====================================================

        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _taskService.GetAllTasksAsync();
            return Ok(tasks);
        }

        // =====================================================
        // GET TASK BY ID
        // =====================================================

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetTaskById(Guid id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);

            if (task == null)
            {
                return NotFound(new { message = "Task not found." });
            }

            return Ok(task);
        }

        // =====================================================
        // GET TASKS BY SPRINT
        // =====================================================

        [HttpGet("sprint/{sprintId:guid}")]
        public async Task<IActionResult> GetSprintTasks(Guid sprintId)
        {
            var tasks = await _taskService.GetSprintTasksAsync(sprintId);
            
            // ✅ FIX: Added the missing return statement
            return Ok(tasks); 
        }

        // =====================================================
        // GET TASKS BY CONTRIBUTOR
        // =====================================================

        [HttpGet("contributor/{contributorId:guid}")]
        public async Task<IActionResult> GetContributorTasks(Guid contributorId)
        {
            var tasks = await _taskService.GetContributorSDTasksAsync(contributorId);
            return Ok(tasks);
        }

        // =====================================================
        // UPDATE TASK
        // =====================================================

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Manager,Contributor")]
        public async Task<IActionResult> UpdateTask(Guid id, [FromBody] UpdateTaskDto dto)
        {
            var result = await _taskService.UpdateTaskAsync(id, dto);

            if (result.Message == "Task not found.")
            {
                return NotFound(new { message = result.Message });
            }

            if (result.Task == null)
            {
                return Conflict(new { message = result.Message });
            }

            return Ok(new { message = result.Message, task = result.Task });
        }

        // =====================================================
        // DELETE TASK
        // =====================================================

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Manager,Contributor")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var success = await _taskService.DeleteTaskAsync(id);

            if (!success)
            {
                return NotFound(new { message = "Task not found." });
            }

            return Ok(new { message = "Task deleted successfully." });
        }

        // =====================================================
        // GET ASSIGNABLE USERS
        // =====================================================

        [HttpGet("assignable-users")]
        [Authorize(Roles = "Manager,Contributor")]
        public async Task<IActionResult> GetAssignableUsers()
        {
            var users = await _taskService.GetAssignableUsersAsync();
            return Ok(users);
        }
    }
}