using AI_PMS.Domain.Entities.Notifications;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Notifications
{
    public class NotificationRepository
        : AI_PMS.Application.Interfaces.Repositories.Notifications
            .INotificationRepository
    {
        private readonly ApplicationDbContext _context;

        public NotificationRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE NOTIFICATION
        // =========================================================

        public async Task AddAsync(
            Notification notification)
        {
            await _context.Notifications.AddAsync(notification);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // GET USER NOTIFICATIONS
        // =========================================================

        public async Task<List<Notification>>
            GetUserNotificationsAsync(
                Guid userId)
        {
            return await _context.Notifications
                .AsNoTracking()
                .Include(n => n.NotificationType)
                .Include(n => n.Project)
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // GET ONE USER NOTIFICATION
        // =========================================================

        public async Task<Notification?>
            GetUserNotificationByIdAsync(
                Guid notificationId,
                Guid userId)
        {
            return await _context.Notifications
                .Include(n => n.NotificationType)
                .Include(n => n.Project)
                .FirstOrDefaultAsync(n =>
                    n.Id == notificationId &&
                    n.UserId == userId);
        }
                     // =========================================================
// GET NOTIFICATION TYPE BY NAME
// =========================================================

public async Task<NotificationType?> GetTypeByNameAsync(
    string name)
{
    if (string.IsNullOrWhiteSpace(name))
    {
        return null;
    }

    var normalizedName = name.Trim();

    return await _context.NotificationTypes
        .AsNoTracking()
        .FirstOrDefaultAsync(nt =>
            nt.Name.ToLower() == normalizedName.ToLower());
}
        // =========================================================
        // MARK AS READ
        // =========================================================

        public async Task MarkAsReadAsync(
            Notification notification)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;

            _context.Notifications.Update(notification);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // UNREAD COUNT
        // =========================================================

        public async Task<int>
            GetUnreadCountAsync(
                Guid userId)
        {
            return await _context.Notifications
                .CountAsync(n =>
                    n.UserId == userId &&
                    !n.IsRead);
        }
    }
}