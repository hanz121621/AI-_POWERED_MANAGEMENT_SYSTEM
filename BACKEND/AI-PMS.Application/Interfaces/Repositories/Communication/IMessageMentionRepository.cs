using AI_PMS.Domain.Entities.Communication;

namespace AI_PMS.Application.Interfaces.Repositories.Communication
{
    public interface IMessageMentionRepository
    {
        Task AddAsync(MessageMention mention);

        Task<MessageMention?> GetByIdAsync(Guid id);

        Task<List<MessageMention>> GetByMessageIdAsync(
            Guid messageId);
    }
}