using System.Security.Claims;
using AI_PMS.Application.DTOs.Notifications;
using AI_PMS.Application.Interfaces.Notifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Notifications
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize(Roles = "Manager,Contributor")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(
            INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // =========================================================
        // TL-COMM-004
        // VIEW MY NOTIFICATIONS
        //
        // GET:
        // api/notifications
        // =========================================================

        [HttpGet]
        public async Task<ActionResult<List<NotificationDto>>>
            GetMyNotifications()
        {
            var userId = GetAuthenticatedUserId();

            if (userId == null)
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message =
                        "Authenticated user could not be identified."
                });
            }

            try
            {
                var notifications =
                    await _notificationService
                        .GetMyNotificationsAsync(userId.Value);

                return Ok(new
                {
                    Success = true,

                    Message =
                        notifications.Count == 0
                            ? "No new notifications available."
                            : "Notifications retrieved successfully.",

                    Data = notifications
                });
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        Success = false,
                        Message =
                            "Unable to load notifications. Please try again."
                    });
            }
        }

        // =========================================================
        // TL-COMM-004
        // VIEW ONE NOTIFICATION
        //
        // GET:
        // api/notifications/{id}
        // =========================================================

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<NotificationDto>>
            GetNotification(Guid id)
        {
            var userId = GetAuthenticatedUserId();

            if (userId == null)
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message =
                        "Authenticated user could not be identified."
                });
            }

            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = "Invalid notification ID."
                });
            }

            try
            {
                var notification =
                    await _notificationService
                        .GetMyNotificationByIdAsync(
                            userId.Value,
                            id);

                if (notification == null)
                {
                    return NotFound(new
                    {
                        Success = false,
                        Message =
                            "This notification content is no longer available."
                    });
                }

                return Ok(new
                {
                    Success = true,
                    Message =
                        "Notification retrieved successfully.",
                    Data = notification
                });
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        Success = false,
                        Message =
                            "Unable to load notification. Please try again."
                    });
            }
        }

        // =========================================================
        // TL-COMM-004
        // MARK NOTIFICATION AS READ
        //
        // PATCH:
        // api/notifications/{id}/read
        // =========================================================

        [HttpPatch("{id:guid}/read")]
        public async Task<IActionResult>
            MarkAsRead(Guid id)
        {
            var userId = GetAuthenticatedUserId();

            if (userId == null)
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message =
                        "Authenticated user could not be identified."
                });
            }

            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = "Invalid notification ID."
                });
            }

            try
            {
                var success =
                    await _notificationService
                        .MarkAsReadAsync(
                            userId.Value,
                            id);

                if (!success)
                {
                    return NotFound(new
                    {
                        Success = false,
                        Message =
                            "Notification not found."
                    });
                }

                return Ok(new
                {
                    Success = true,
                    Message =
                        "Notification marked as read."
                });
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        Success = false,
                        Message =
                            "Unable to update notification. Please try again."
                    });
            }
        }

        // =========================================================
        // TL-COMM-004
        // GET UNREAD NOTIFICATION COUNT
        //
        // GET:
        // api/notifications/unread-count
        // =========================================================

        [HttpGet("unread-count")]
        public async Task<IActionResult>
            GetUnreadCount()
        {
            var userId = GetAuthenticatedUserId();

            if (userId == null)
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message =
                        "Authenticated user could not be identified."
                });
            }

            try
            {
                var count =
                    await _notificationService
                        .GetUnreadCountAsync(
                            userId.Value);

                return Ok(new
                {
                    Success = true,
                    UnreadCount = count
                });
            }
            catch
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        Success = false,
                        Message =
                            "Unable to load notification count."
                    });
            }
        }

        // =========================================================
        // GET AUTHENTICATED USER ID
        // =========================================================

        private Guid? GetAuthenticatedUserId()
        {
            var claim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier);

            if (claim == null)
            {
                claim =
                    User.FindFirst("sub");
            }

            if (claim == null)
            {
                return null;
            }

            return Guid.TryParse(
                claim.Value,
                out var userId)
                ? userId
                : null;
        }
    }
}