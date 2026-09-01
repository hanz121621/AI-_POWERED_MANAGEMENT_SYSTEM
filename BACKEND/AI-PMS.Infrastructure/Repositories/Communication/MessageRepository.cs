
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

        public async Task AddAsync(Message message)
        {
            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();
        }

        public async Task<Message?> GetByIdAsync(Guid id)
        {
            return await _context.Messages
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<List<Message>> GetConversationAsync(
            Guid userId,
            Guid otherUserId,
            Guid projectId)
        {
            return await _context.Messages
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

        public async Task<List<Message>> GetProjectMessagesAsync(
            Guid projectId)
        {
            return await _context.Messages
                .AsNoTracking()
                .Where(m => m.ProjectId == projectId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task UpdateAsync(Message message)
        {
            _context.Messages.Update(message);
            await _context.SaveChangesAsync();
        }
    }
}

