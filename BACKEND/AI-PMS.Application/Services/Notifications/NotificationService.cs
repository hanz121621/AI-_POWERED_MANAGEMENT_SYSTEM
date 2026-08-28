using AI_PMS.Application.DTOs.Notifications;
using AI_PMS.Application.Interfaces.Notifications;
using AI_PMS.Application.Interfaces.Repositories.Notifications;

namespace AI_PMS.Application.Services.Notifications
{
public class NotificationService : INotificationService
{
private readonly INotificationRepository _notificationRepository;

    public NotificationService(
        INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    // =========================================================
    // CREATE NOTIFICATION
    // =========================================================

    public async Task<NotificationDto> CreateNotificationAsync(
        Guid userId,
        Guid notificationTypeId,
        string title,
        string message,
        Guid? projectId = null,
        Guid? teamId = null,
        Guid? sprintId = null,
        Guid? relatedEntityId = null,
        string? relatedEntityType = null)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException(
                "User ID is required.");
        }

        if (notificationTypeId == Guid.Empty)
        {
            throw new ArgumentException(
                "Notification type ID is required.");
        }

        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException(
                "Notification title is required.");
        }

        if (title.Trim().Length > 200)
        {
            throw new ArgumentException(
                "Notification title cannot exceed 200 characters.");
        }

        if (string.IsNullOrWhiteSpace(message))
        {
            throw new ArgumentException(
                "Notification message is required.");
        }

        if (message.Trim().Length > 2000)
        {
            throw new ArgumentException(
                "Notification message cannot exceed 2000 characters.");
        }

        var notification =
            new AI_PMS.Domain.Entities.Notifications.Notification
            {
                Id = Guid.NewGuid(),

                UserId = userId,

                NotificationTypeId =
                    notificationTypeId,

                Title =
                    title.Trim(),

                Message =
                    message.Trim(),

                IsRead = false,

                ReadAt = null,

                ProjectId = projectId,

                TeamId = teamId,

                SprintId = sprintId,

                RelatedEntityId =
                    relatedEntityId,

                RelatedEntityType =
                    relatedEntityType?.Trim(),

                CreatedAt =
                    DateTime.UtcNow
            };

        await _notificationRepository.AddAsync(
            notification);

        return MapToDto(notification);
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
