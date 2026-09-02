using AI_PMS.Application.DTOs.Communication;
using AI_PMS.Application.Interfaces.Communication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Communication
{
    [ApiController]
    [Route("api/communication/mentions")]
    [Authorize(Roles = "Manager,Contributor")]
    public class MentionsController : ControllerBase
    {
        private readonly IMentionService _mentionService;

        public MentionsController(
            IMentionService mentionService)
        {
            _mentionService = mentionService;
        }

        // =========================================================
        // MENTION TEAM MEMBERS IN TASK COMMENT
        //
        // DEV-COMM-003
        // STAFF-COMM-003
        //
        // POST:
        // api/communication/mentions/task-comment/{taskCommentId}
        // =========================================================

        [HttpPost("task-comment/{taskCommentId:guid}")]
        public async Task<ActionResult<List<MessageMentionDto>>>
            MentionTaskComment(
                Guid taskCommentId,
                [FromBody] List<Guid> mentionedUserIds)
        {
            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(
                    userIdClaim,
                    out var userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid authenticated user."
                });
            }

            try
            {
                var result =
                    await _mentionService
                        .MentionTeamMembersInTaskCommentAsync(
                            userId,
                            taskCommentId,
                            mentionedUserIds);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
<<<<<<< HEAD
            catch (UnauthorizedAccessException )
=======
            catch (UnauthorizedAccessException)
>>>>>>> 606d42dc31509d908ee4323883fe5d4a3860427b
            {
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}