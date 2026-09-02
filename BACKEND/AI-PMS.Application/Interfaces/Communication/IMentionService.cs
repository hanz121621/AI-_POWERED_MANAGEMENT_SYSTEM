
using AI_PMS.Application.DTOs.Communication;

namespace AI_PMS.Application.Interfaces.Communication
{
    public interface IMentionService
    {
        // =========================================================
        // PROJECT MESSAGE
        // =========================================================

        Task<MessageMentionDto>
            MentionTeamLeaderAsync(
                Guid managerId,
                Guid messageId);

        // =========================================================
        // TASK COMMENT
        // DEV-COMM-003
        // STAFF-COMM-003
        // =========================================================

        Task<List<MessageMentionDto>>
            MentionTeamMembersInTaskCommentAsync(
                Guid userId,
                Guid taskCommentId,
                List<Guid> mentionedUserIds);
    }
}
