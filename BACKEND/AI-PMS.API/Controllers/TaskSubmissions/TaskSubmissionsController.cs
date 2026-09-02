using AI_PMS.Application.DTOs.TaskSubmissions;
using AI_PMS.Application.Interfaces.TaskSubmissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.TaskSubmissions
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize(Roles = "Contributor")]
    public class TaskSubmissionsController : ControllerBase
    {
        private readonly ITaskSubmissionService
            _submissionService;

        public TaskSubmissionsController(
            ITaskSubmissionService submissionService)
        {
            _submissionService = submissionService;
        }

        // =========================================================
        // SUBMIT COMPLETED WORK
        // Developer + Staff
        // =========================================================

        // POST:
        // api/tasks/{taskId}/submissions
        [HttpPost("{taskId:guid}/submissions")]
        public async Task<IActionResult> SubmitWork(
            Guid taskId,
            [FromBody] CreateTaskSubmissionDto dto)
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

            var result =
                await _submissionService.SubmitWorkAsync(
                    userId,
                    taskId,
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

                if (result.Message ==
                    "You cannot submit work for this task.")
                {
                    return Forbid();
                }

                if (result.Message ==
                    "This task cannot be submitted.")
                {
                    return Conflict(new
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
                submission = result.Submission
            });
        }

        // =========================================================
        // GET SUBMISSION HISTORY
        // =========================================================

        // GET:
        // api/tasks/{taskId}/submissions
        [HttpGet("{taskId:guid}/submissions")]
        public async Task<IActionResult> GetSubmissions(
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
                var submissions =
                    await _submissionService
                        .GetTaskSubmissionsAsync(
                            userId,
                            taskId);

                return Ok(submissions);
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