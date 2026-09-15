using AI_PMS.Application.DTOs.Communication;

namespace AI_PMS.Application.Interfaces.Communication
{
    public interface IMessageService
    {
        Task<MessageResponseDto> SendMessageToTeamLeaderAsync(
            Guid managerId,
            SendTeamLeaderMessageDto request);

        Task<MessageResponseDto> SendMessageToTeamMemberAsync(
            Guid senderId,
            SendTeamMemberMessageDto request);

        Task<List<MessageResponseDto>> GetConversationAsync(
            Guid managerId,
            Guid projectId);

        Task<List<MessageResponseDto>> GetMyInboxAsync(
            Guid userId);

        Task<MessageResponseDto?> GetMessageByIdAsync(
            Guid userId,
            Guid messageId);

        Task<(bool Success, string Message)> MarkAsReadAsync(
            Guid userId,
            Guid messageId);

        Task<int> GetUnreadCountAsync(
            Guid userId);
    }
}