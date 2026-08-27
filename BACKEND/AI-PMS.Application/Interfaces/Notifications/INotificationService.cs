using AI_PMS.Application.DTOs.Notifications;

namespace AI_PMS.Application.Interfaces.Notifications
{
    public interface INotificationService
    {
        Task<List<NotificationDto>>
            GetMyNotificationsAsync(
                Guid userId);

        Task<NotificationDto?>
            GetMyNotificationByIdAsync(
                Guid userId,
                Guid notificationId);

        Task<bool>
            MarkAsReadAsync(
                Guid userId,
                Guid notificationId);

        Task<int>
            GetUnreadCountAsync(
                Guid userId);
    }
}