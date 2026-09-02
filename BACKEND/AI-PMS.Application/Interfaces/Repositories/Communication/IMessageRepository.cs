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

        // =========================================================
        // INBOX
        // =========================================================

        Task<List<Message>> GetInboxAsync(
            Guid receiverId);

        // =========================================================
        // SENT MESSAGES
        // =========================================================

        Task<List<Message>> GetSentMessagesAsync(
            Guid senderId);

        // =========================================================
        // UNREAD COUNT
        // =========================================================

        Task<int> GetUnreadCountAsync(
            Guid receiverId);

        // =========================================================
        // ONE RECEIVED MESSAGE
        // =========================================================

        Task<Message?> GetInboxMessageByIdAsync(
            Guid messageId,
            Guid receiverId);

        Task UpdateAsync(Message message);
    }
}