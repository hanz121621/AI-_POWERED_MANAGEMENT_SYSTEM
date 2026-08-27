
using AI_PMS.Domain.Entities.Communication;

namespace AI_PMS.Application.Interfaces.Repositories.Communication
{
    public interface IMessageRepository
    {
        Task AddAsync(Message message);

        Task<Message?> GetByIdAsync(Guid id);

        Task<List<Message>> GetConversationAsync(
            Guid userId,
            Guid otherUserId,
            Guid projectId);

        Task<List<Message>> GetProjectMessagesAsync(
            Guid projectId);

        Task UpdateAsync(Message message);
    }
}
