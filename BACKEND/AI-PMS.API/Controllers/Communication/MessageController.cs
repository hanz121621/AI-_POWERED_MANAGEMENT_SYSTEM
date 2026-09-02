
using AI_PMS.Application.DTOs.Communication;
using AI_PMS.Application.Interfaces.Communication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Communication
{
    [ApiController]
    [Route("api/communication/messages")]
    [Authorize(Roles = "Manager,Contributor")]
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

     [Authorize(Roles = "Manager")]
[HttpPost("team-leader")]
public async Task<ActionResult<MessageResponseDto>>
    SendMessageToTeamLeader(
        [FromBody] SendTeamLeaderMessageDto request)
        {
            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(
                    userIdClaim,
                    out var managerId))
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
            catch (UnauthorizedAccessException )
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
        // RECEIVE MESSAGES / MY INBOX
        //
        // GET: api/communication/messages/inbox
        // =========================================================

        [HttpGet("inbox")]
        public async Task<ActionResult<List<MessageResponseDto>>>
            GetInbox()
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
                var messages =
                    await _messageService
                        .GetMyInboxAsync(userId);

                return Ok(messages);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        // =========================================================
        // GET ONE RECEIVED MESSAGE
        //
        // GET: api/communication/messages/inbox/{messageId}
        // =========================================================

        [HttpGet("inbox/{messageId:guid}")]
        public async Task<ActionResult<MessageResponseDto>>
            GetReceivedMessage(Guid messageId)
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
                var message =
                    await _messageService
                        .GetMessageByIdAsync(
                            userId,
                            messageId);

                if (message == null)
                {
                    return NotFound(new
                    {
                        message = "Message not found."
                    });
                }

                return Ok(message);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        // =========================================================
        // MARK MESSAGE AS READ
        //
        // PATCH:
        // api/communication/messages/inbox/{messageId}/read
        // =========================================================

        [HttpPatch("inbox/{messageId:guid}/read")]
        public async Task<IActionResult>
            MarkMessageAsRead(Guid messageId)
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

            var result =
                await _messageService
                    .MarkAsReadAsync(
                        userId,
                        messageId);

            // =====================================================
            // INVALID USER / MESSAGE
            // =====================================================

            if (!result.Success)
            {
                if (result.Message == "Message not found.")
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

                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message
            });
        }

        // =========================================================
        // GET CONVERSATION
        //
        // GET:
        // api/communication/messages/project/{projectId}
        // =========================================================

        [HttpGet("project/{projectId:guid}")]
        public async Task<ActionResult<List<MessageResponseDto>>>
            GetConversation(Guid projectId)
        {
            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(
                    userIdClaim,
                    out var managerId))
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

        // =========================================================
        // GET UNREAD MESSAGE COUNT
        //
        // GET:
        // api/communication/messages/unread-count
        // =========================================================

        [HttpGet("unread-count")]
        public async Task<IActionResult>
            GetUnreadCount()
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
                var count =
                    await _messageService
                        .GetUnreadCountAsync(userId);

                return Ok(new
                {
                    unreadCount = count
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}
