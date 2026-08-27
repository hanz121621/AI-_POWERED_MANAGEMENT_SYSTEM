
using AI_PMS.Application.DTOs.Communication;

namespace AI_PMS.Application.Interfaces.Communication
{
    public interface IMessageService
    {
        Task<MessageResponseDto> SendMessageToTeamLeaderAsync(
            Guid managerId,
            SendTeamLeaderMessageDto request);

        Task<List<MessageResponseDto>> GetConversationAsync(
            Guid managerId,
            Guid projectId);
    }
}

