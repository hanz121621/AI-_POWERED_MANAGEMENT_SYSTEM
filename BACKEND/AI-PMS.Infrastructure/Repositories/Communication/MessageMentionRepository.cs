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
            await _context.MessageMentions.AddAsync(mention);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // GET MENTION
        // =========================================================

        public async Task<MessageMention?> GetByIdAsync(
            Guid id)
        {
            return await _context.MessageMentions
                .AsNoTracking()
                .Include(m => m.MentionedUser)
                .Include(m => m.Message)
                .FirstOrDefaultAsync(m => m.Id == id);
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
                .Where(m => m.MessageId == messageId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }
    }
}