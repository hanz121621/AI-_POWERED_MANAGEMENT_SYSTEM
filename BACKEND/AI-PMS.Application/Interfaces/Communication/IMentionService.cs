using AI_PMS.Application.DTOs.Communication;

namespace AI_PMS.Application.Interfaces.Communication
{
    public interface IMentionService
    {
        Task<MessageMentionDto>
            MentionTeamLeaderAsync(
                Guid managerId,
                Guid messageId);
    }
}