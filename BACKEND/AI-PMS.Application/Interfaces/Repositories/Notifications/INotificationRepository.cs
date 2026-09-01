using AI_PMS.Domain.Entities.Notifications;

namespace AI_PMS.Application.Interfaces.Repositories.Notifications
{
    public interface INotificationRepository
    {
        // =========================================================
        // CREATE NOTIFICATION
        // =========================================================

        Task AddAsync(
            Notification notification);

        // =========================================================
        // GET USER NOTIFICATIONS
        // =========================================================

        Task<List<Notification>> GetUserNotificationsAsync(
            Guid userId);

        // =========================================================
        // GET ONE USER NOTIFICATION
        // =========================================================

        Task<Notification?> GetUserNotificationByIdAsync(
            Guid notificationId,
            Guid userId);

        // =========================================================
        // MARK AS READ
        // =========================================================

        Task MarkAsReadAsync(
            Notification notification);

        // =========================================================
        // UNREAD COUNT
        // =========================================================

        Task<int> GetUnreadCountAsync(
            Guid userId);

        // =========================================================
        // GET NOTIFICATION TYPE
        // =========================================================

        Task<NotificationType?> GetTypeByNameAsync(
            string name);
    }
}