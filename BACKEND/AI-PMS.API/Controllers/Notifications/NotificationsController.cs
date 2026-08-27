using System.Security.Claims;
using AI_PMS.Application.DTOs.Notifications;
using AI_PMS.Application.Interfaces.Notifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Notifications
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize(Roles = "Manager")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService
            _notificationService;

        public NotificationsController(
            INotificationService notificationService)
        {
            _notificationService =
                notificationService;
        }

        // =========================================================
        // GET MY NOTIFICATIONS
        //
        // GET: api/notifications
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
                    Message = "Authenticated user could not be identified."
                });
            }

            var notifications =
                await _notificationService
                    .GetMyNotificationsAsync(userId.Value);

            return Ok(new
            {
                Success = true,
                Message = notifications.Count == 0
                    ? "No notifications available."
                    : "Notifications retrieved successfully.",
                Data = notifications
            });
        }

        // =========================================================
        // GET ONE NOTIFICATION
        //
        // GET: api/notifications/{id}
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
                    Message = "Authenticated user could not be identified."
                });
            }

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
                    Message = "Notification not found."
                });
            }

            return Ok(new
            {
                Success = true,
                Message = "Notification retrieved successfully.",
                Data = notification
            });
        }

        // =========================================================
        // MARK AS READ
        //
        // PATCH: api/notifications/{id}/read
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
                    Message = "Authenticated user could not be identified."
                });
            }

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
                    Message = "Notification not found."
                });
            }

            return Ok(new
            {
                Success = true,
                Message = "Notification marked as read."
            });
        }

        // =========================================================
        // GET UNREAD COUNT
        //
        // GET: api/notifications/unread-count
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
                    Message = "Authenticated user could not be identified."
                });
            }

            var count =
                await _notificationService
                    .GetUnreadCountAsync(userId.Value);

            return Ok(new
            {
                Success = true,
                UnreadCount = count
            });
        }

        // =========================================================
        // AUTHENTICATED USER
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