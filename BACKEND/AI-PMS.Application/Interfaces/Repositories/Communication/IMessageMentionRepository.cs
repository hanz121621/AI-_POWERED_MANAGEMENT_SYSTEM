
using AI_PMS.Domain.Entities.Communication;

namespace AI_PMS.Application.Interfaces.Repositories.Communication
{
    public interface IMessageMentionRepository
    {
        // =========================================================
        // ADD
        // =========================================================

        Task AddAsync(
            MessageMention mention);

        // =========================================================
        // GET BY ID
        // =========================================================

        Task<MessageMention?> GetByIdAsync(
            Guid id);

        // =========================================================
        // MESSAGE MENTIONS
        // =========================================================

        Task<List<MessageMention>> GetByMessageIdAsync(
            Guid messageId);

        // =========================================================
        // TASK COMMENT MENTIONS
        // =========================================================

        Task<List<MessageMention>> GetByTaskCommentIdAsync(
            Guid taskCommentId);

        // =========================================================
        // DUPLICATE CHECK
        // =========================================================

        Task<bool> ExistsForTaskCommentAsync(
            Guid taskCommentId,
            Guid mentionedUserId);
    }
}
