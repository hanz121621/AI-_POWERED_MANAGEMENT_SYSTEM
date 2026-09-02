using System.Security.Claims;
using AI_PMS.Application.DTOs.Communication;
using AI_PMS.Application.Interfaces.Communication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Communication
{
    [ApiController]
    [Route("api/communication/mentions")]
    [Authorize(Roles = "Manager")]
    public class MentionsController : ControllerBase
    {
        private readonly IMentionService _mentionService;

        public MentionsController(
            IMentionService mentionService)
        {
            _mentionService = mentionService;
        }

        // =========================================================
        // MENTION TEAM LEADER
        // POST:
        // api/communication/mentions/team-leader/{messageId}
        // =========================================================

        [HttpPost("team-leader/{messageId:guid}")]
        public async Task<ActionResult<MessageMentionDto>>
            MentionTeamLeader(
                Guid messageId)
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(
                    userIdClaim.Value,
                    out var managerId))
            {
                return Unauthorized();
            }

            try
            {
                var result =
                    await _mentionService
                        .MentionTeamLeaderAsync(
                            managerId,
                            messageId);

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    success = false,
                    message = ex.Message
                });
            }
            catch (UnauthorizedAccessException )
            {
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
    }
}