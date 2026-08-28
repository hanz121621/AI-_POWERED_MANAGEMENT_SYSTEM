using AI_PMS.Application.DTOs.Notifications;

namespace AI_PMS.Application.Interfaces.Notifications
{
public interface INotificationService
{
// =========================================================
// CREATE NOTIFICATION
// =========================================================

    Task<NotificationDto> CreateNotificationAsync(
        Guid userId,
        Guid notificationTypeId,
        string title,
        string message,
        Guid? projectId = null,
        Guid? teamId = null,
        Guid? sprintId = null,
        Guid? relatedEntityId = null,
        string? relatedEntityType = null);

    // =========================================================
    // GET MY NOTIFICATIONS
    // =========================================================

    Task<List<NotificationDto>>
        GetMyNotificationsAsync(
            Guid userId);

    // =========================================================
    // GET ONE NOTIFICATION
    // =========================================================

    Task<NotificationDto?>
        GetMyNotificationByIdAsync(
            Guid userId,
            Guid notificationId);

    // =========================================================
    // MARK AS READ
    // =========================================================

    Task<bool>
        MarkAsReadAsync(
            Guid userId,
            Guid notificationId);

    // =========================================================
    // UNREAD COUNT
    // =========================================================

    Task<int>
        GetUnreadCountAsync(
            Guid userId);
}


}
