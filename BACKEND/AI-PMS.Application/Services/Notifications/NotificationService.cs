using AI_PMS.Application.DTOs.Notifications;
using AI_PMS.Application.Interfaces.Notifications;
using AI_PMS.Application.Interfaces.Repositories.Notifications;

namespace AI_PMS.Application.Services.Notifications
{
    public class NotificationService
        : INotificationService
    {
        private readonly INotificationRepository
            _notificationRepository;

        public NotificationService(
            INotificationRepository notificationRepository)
        {
            _notificationRepository =
                notificationRepository;
        }

        // =========================================================
        // GET MY NOTIFICATIONS
        // =========================================================

        public async Task<List<NotificationDto>>
            GetMyNotificationsAsync(Guid userId)
        {
            var notifications =
                await _notificationRepository
                    .GetUserNotificationsAsync(userId);

            return notifications
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // GET MY NOTIFICATION
        // =========================================================

        public async Task<NotificationDto?>
            GetMyNotificationByIdAsync(
                Guid userId,
                Guid notificationId)
        {
            var notification =
                await _notificationRepository
                    .GetUserNotificationByIdAsync(
                        notificationId,
                        userId);

            if (notification == null)
            {
                return null;
            }

            return MapToDto(notification);
        }

        // =========================================================
        // MARK AS READ
        // =========================================================

        public async Task<bool>
            MarkAsReadAsync(
                Guid userId,
                Guid notificationId)
        {
            var notification =
                await _notificationRepository
                    .GetUserNotificationByIdAsync(
                        notificationId,
                        userId);

            if (notification == null)
            {
                return false;
            }

            if (!notification.IsRead)
            {
                await _notificationRepository
                    .MarkAsReadAsync(notification);
            }

            return true;
        }

        // =========================================================
        // UNREAD COUNT
        // =========================================================

        public async Task<int>
            GetUnreadCountAsync(Guid userId)
        {
            return await _notificationRepository
                .GetUnreadCountAsync(userId);
        }

        // =========================================================
        // MAPPING
        // =========================================================

        private static NotificationDto
            MapToDto(
                AI_PMS.Domain.Entities.Notifications.Notification notification)
        {
            return new NotificationDto
            {
                Id = notification.Id,

                UserId = notification.UserId,

                NotificationTypeId =
                    notification.NotificationTypeId,

                NotificationTypeName =
                    notification.NotificationType?.Name
                    ?? string.Empty,

                Title =
                    notification.Title,

                Message =
                    notification.Message,

                IsRead =
                    notification.IsRead,

                ReadAt =
                    notification.ReadAt,

                ProjectId =
                    notification.ProjectId,

                ProjectName =
                    notification.Project?.Name,

                TeamId =
                    notification.TeamId,

                SprintId =
                    notification.SprintId,

                RelatedEntityId =
                    notification.RelatedEntityId,

                RelatedEntityType =
                    notification.RelatedEntityType,

                CreatedAt =
                    notification.CreatedAt
            };
        }
    }
}