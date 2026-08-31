using AI_PMS.Application.Interfaces.Repositories.Communication;
using AI_PMS.Domain.Entities.Communication;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Communication
{
    public class MessageRepository : IMessageRepository
    {
        private readonly ApplicationDbContext _context;

        public MessageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // ADD MESSAGE
        // =========================================================

        public async Task AddAsync(Message message)
        {
            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();
        }

        // =========================================================
        // GET BY ID
        // =========================================================

        public async Task<Message?> GetByIdAsync(Guid id)
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        // =========================================================
        // GET CONVERSATION
        // =========================================================

        public async Task<List<Message>> GetConversationAsync(
            Guid userId,
            Guid otherUserId,
            Guid projectId)
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .AsNoTracking()
                .Where(m =>
                    m.ProjectId == projectId &&
                    (
                        (m.SenderId == userId &&
                         m.ReceiverId == otherUserId)
                        ||
                        (m.SenderId == otherUserId &&
                         m.ReceiverId == userId)
                    ))
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // GET PROJECT MESSAGES
        // =========================================================

        public async Task<List<Message>> GetProjectMessagesAsync(
            Guid projectId)
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .AsNoTracking()
                .Where(m => m.ProjectId == projectId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // RECEIVE MESSAGE INBOX
        // =========================================================

        public async Task<List<Message>> GetInboxAsync(
            Guid receiverId)
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .AsNoTracking()
                .Where(m =>
                    m.ReceiverId == receiverId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // SENT MESSAGES
        // =========================================================

        public async Task<List<Message>> GetSentMessagesAsync(
            Guid senderId)
        {
            return await _context.Messages
                .Include(m => m.Receiver)
                .Include(m => m.Sender)
                .AsNoTracking()
                .Where(m =>
                    m.SenderId == senderId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // UNREAD COUNT
        // =========================================================

        public async Task<int> GetUnreadCountAsync(
            Guid receiverId)
        {
            return await _context.Messages
                .CountAsync(m =>
                    m.ReceiverId == receiverId &&
                    !m.IsRead);
        }
                                     // =========================================================
// GET ONE INBOX MESSAGE
// =========================================================

public async Task<Message?> GetInboxMessageByIdAsync(
    Guid messageId,
    Guid receiverId)
{
    return await _context.Messages
        .Include(m => m.Sender)
        .Include(m => m.Receiver)
        .AsNoTracking()
        .FirstOrDefaultAsync(m =>
            m.Id == messageId &&
            m.ReceiverId == receiverId);
}
        // =========================================================
        // UPDATE
        // =========================================================

        public async Task UpdateAsync(Message message)
        {
            _context.Messages.Update(message);
            await _context.SaveChangesAsync();
        }
    }
}