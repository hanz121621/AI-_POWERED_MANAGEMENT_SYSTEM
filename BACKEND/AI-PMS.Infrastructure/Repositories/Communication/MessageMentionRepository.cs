
using AI_PMS.Application.Interfaces.Repositories.Communication;
using AI_PMS.Domain.Entities.Communication;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Communication
{
    public class MessageMentionRepository
        : IMessageMentionRepository
    {
        private readonly ApplicationDbContext _context;

        public MessageMentionRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // ADD MENTION
        // =========================================================

        public async Task AddAsync(
            MessageMention mention)
        {
            await _context.MessageMentions.AddAsync(
                mention);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // GET MENTION BY ID
        // =========================================================

        public async Task<MessageMention?> GetByIdAsync(
            Guid id)
        {
            return await _context.MessageMentions
                .AsNoTracking()

                .Include(m => m.MentionedUser)

                .Include(m => m.Message)

                .Include(m => m.TaskComment)

                .FirstOrDefaultAsync(
                    m => m.Id == id);
        }

        // =========================================================
        // GET MESSAGE MENTIONS
        // =========================================================

        public async Task<List<MessageMention>>
            GetByMessageIdAsync(
                Guid messageId)
        {
            return await _context.MessageMentions
                .AsNoTracking()

                .Include(m => m.MentionedUser)

                .Where(m =>
                    m.MessageId == messageId)

                .OrderBy(m => m.CreatedAt)

                .ToListAsync();
        }

        // =========================================================
        // GET TASK COMMENT MENTIONS
        // =========================================================

        public async Task<List<MessageMention>>
            GetByTaskCommentIdAsync(
                Guid taskCommentId)
        {
            return await _context.MessageMentions
                .AsNoTracking()

                .Include(m => m.MentionedUser)

                .Where(m =>
                    m.TaskCommentId == taskCommentId)

                .OrderBy(m => m.CreatedAt)

                .ToListAsync();
        }

        // =========================================================
        // CHECK DUPLICATE TASK COMMENT MENTION
        // =========================================================

        public async Task<bool>
            ExistsForTaskCommentAsync(
                Guid taskCommentId,
                Guid mentionedUserId)
        {
            return await _context.MessageMentions
                .AnyAsync(m =>
                    m.TaskCommentId == taskCommentId &&
                    m.MentionedUserId == mentionedUserId);
        }
    }
}
