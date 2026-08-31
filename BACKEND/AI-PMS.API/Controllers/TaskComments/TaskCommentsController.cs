using AI_PMS.Application.DTOs.TaskComments;
using AI_PMS.Application.Interfaces.TaskComments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.TaskComments
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize(Roles = "Contributor")]
    public class TaskCommentsController : ControllerBase
    {
        private readonly ITaskCommentService _commentService;

        public TaskCommentsController(
            ITaskCommentService commentService)
        {
            _commentService = commentService;
        }

        // =========================================================
        // ADD COMMENT
        // Developer + Staff
        // =========================================================
        // POST: api/tasks/{taskId}/comments
        [HttpPost("{taskId:guid}/comments")]
        public async Task<IActionResult> AddComment(
            Guid taskId,
            [FromBody] CreateTaskCommentDto dto)
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

            // Force route task ID
            // instead of trusting the request body.
            dto.TaskId = taskId;

            var result =
                await _commentService.AddCommentAsync(
                    userId,
                    dto);

            if (!result.Success)
            {
                if (result.Message == "Task not found.")
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message == "Access denied.")
                {
                    return Forbid();
                }

                if (result.Message ==
                    "Comment cannot be empty.")
                {
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }

                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                comment = result.Comment
            });
        }

        // =========================================================
        // GET COMMENTS
        // Developer + Staff
        // =========================================================
        // GET: api/tasks/{taskId}/comments
        [HttpGet("{taskId:guid}/comments")]
        public async Task<IActionResult> GetComments(
            Guid taskId)
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

            try
            {
                var comments =
                    await _commentService
                        .GetTaskCommentsAsync(
                            userId,
                            taskId);

                return Ok(comments);
            }
            catch (InvalidOperationException ex)
            {
                if (ex.Message == "Task not found.")
                {
                    return NotFound(new
                    {
                        message = ex.Message
                    });
                }

                return Forbid();
            }
        }
    }
}