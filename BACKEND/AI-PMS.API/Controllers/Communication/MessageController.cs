
using AI_PMS.Application.DTOs.Communication;
using AI_PMS.Application.Interfaces.Communication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Communication
{
    [ApiController]
    [Route("api/communication/messages")]
    [Authorize(Roles = "Manager")]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessageController(
            IMessageService messageService)
        {
            _messageService = messageService;
        }

        // =========================================================
        // SEND MESSAGE TO TEAM LEADER
        // POST: api/communication/messages/team-leader
        // =========================================================

        [HttpPost("team-leader")]
        public async Task<ActionResult<MessageResponseDto>>
            SendMessageToTeamLeader(
                [FromBody] SendTeamLeaderMessageDto request)
        {
            var userIdClaim =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var managerId))
            {
                return Unauthorized(new
                {
                    message = "Invalid authenticated user."
                });
            }

            try
            {
                var result =
                    await _messageService
                        .SendMessageToTeamLeaderAsync(
                            managerId,
                            request);

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
            catch (UnauthorizedAccessException ex)
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

        // =========================================================
        // GET CONVERSATION
        // GET: api/communication/messages/project/{projectId}
        // =========================================================

        [HttpGet("project/{projectId:guid}")]
        public async Task<ActionResult<List<MessageResponseDto>>>
            GetConversation(Guid projectId)
        {
            var userIdClaim =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var managerId))
            {
                return Unauthorized(new
                {
                    message = "Invalid authenticated user."
                });
            }

            try
            {
                var result =
                    await _messageService
                        .GetConversationAsync(
                            managerId,
                            projectId);

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (UnauthorizedAccessException)
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
