
using AI_PMS.Application.DTOs.Communication;
using AI_PMS.Application.Interfaces.Communication;
using AI_PMS.Application.Interfaces.Repositories.Communication;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Application.Interfaces.Repositories.Projects;

namespace AI_PMS.Application.Services.Communication
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly ITeamRepository _teamRepository;

        public MessageService(
            IMessageRepository messageRepository,
            IProjectRepository projectRepository,
            ITeamRepository teamRepository)
        {
            _messageRepository = messageRepository;
            _projectRepository = projectRepository;
            _teamRepository = teamRepository;
        }

        // =========================================================
        // SEND MESSAGE TO TEAM LEADER
        // =========================================================

        public async Task<MessageResponseDto>
            SendMessageToTeamLeaderAsync(
                Guid managerId,
                SendTeamLeaderMessageDto request)
        {
            if (managerId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Invalid manager identity.");
            }

            if (request == null)
            {
                throw new ArgumentException(
                    "Message information is required.");
            }

            if (request.ProjectId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Project ID is required.");
            }

            if (string.IsNullOrWhiteSpace(request.Title))
            {
                throw new ArgumentException(
                    "Message title cannot be empty.");
            }

            if (request.Title.Trim().Length > 200)
            {
                throw new ArgumentException(
                    "Message title cannot exceed 200 characters.");
            }

            if (string.IsNullOrWhiteSpace(request.Message))
            {
                throw new ArgumentException(
                    "Message cannot be empty.");
            }

            var title = request.Title.Trim();
            var messageContent = request.Message.Trim();

            if (messageContent.Length > 5000)
            {
                throw new ArgumentException(
                    "Message cannot exceed 5000 characters.");
            }

            // =====================================================
            // GET PROJECT
            // =====================================================

            var project =
                await _projectRepository.GetByIdAsync(
                    request.ProjectId);

            if (project == null)
            {
                throw new KeyNotFoundException(
                    "Project was not found.");
            }

            // =====================================================
            // VERIFY MANAGER PROJECT ACCESS
            // =====================================================

            if (project.ManagerId != managerId)
            {
                throw new UnauthorizedAccessException(
                    "You are not authorized to message the Team Leader of this project.");
            }

            // =====================================================
            // VERIFY TEAM
            // =====================================================

            if (!project.TeamId.HasValue)
            {
                throw new InvalidOperationException(
                    "No Team is currently assigned to this project.");
            }

            var teamId = project.TeamId.Value;

            // =====================================================
            // GET TEAM LEADER
            // =====================================================

            var teamLeader =
                await _teamRepository.GetTeamLeaderAsync(
                    teamId);

            if (teamLeader == null)
            {
                throw new InvalidOperationException(
                    "No Team Leader is currently assigned to this Team.");
            }

            // =====================================================
            // PREVENT SELF MESSAGE
            // =====================================================

            if (teamLeader.UserId == managerId)
            {
                throw new InvalidOperationException(
                    "The Manager cannot message themselves.");
            }

            // =====================================================
            // CREATE MESSAGE
            // =====================================================

            var message =
                new AI_PMS.Domain.Entities.Communication.Message
                {
                    Id = Guid.NewGuid(),

                    SenderId = managerId,

                    ReceiverId = teamLeader.UserId,

                    ProjectId = request.ProjectId,

                    TeamId = teamId,

                    TaskId = request.TaskId,

                    Title = title,

                    Content = messageContent,

                    IsRead = false,

                    ReadAt = null,

                    CreatedAt = DateTime.UtcNow
                };

            await _messageRepository.AddAsync(message);

            return MapToResponse(message);
        }

        // =========================================================
        // GET MANAGER CONVERSATION
        // =========================================================

        public async Task<List<MessageResponseDto>>
            GetConversationAsync(
                Guid managerId,
                Guid projectId)
        {
            if (managerId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Invalid manager identity.");
            }

            if (projectId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Invalid project.");
            }

            // =====================================================
            // GET PROJECT
            // =====================================================

            var project =
                await _projectRepository.GetByIdAsync(
                    projectId);

            if (project == null)
            {
                throw new KeyNotFoundException(
                    "Project was not found.");
            }

            // =====================================================
            // VERIFY MANAGER ACCESS
            // =====================================================

            if (project.ManagerId != managerId)
            {
                throw new UnauthorizedAccessException(
                    "You are not authorized to access this conversation.");
            }

            // =====================================================
            // VERIFY TEAM
            // =====================================================

            if (!project.TeamId.HasValue)
            {
                throw new InvalidOperationException(
                    "No Team is currently assigned to this project.");
            }

            // =====================================================
            // GET TEAM LEADER
            // =====================================================

            var teamLeader =
                await _teamRepository.GetTeamLeaderAsync(
                    project.TeamId.Value);

            if (teamLeader == null)
            {
                throw new InvalidOperationException(
                    "No Team Leader is currently assigned to this Team.");
            }

            // =====================================================
            // GET CONVERSATION
            // =====================================================

            var messages =
                await _messageRepository
                    .GetConversationAsync(
                        managerId,
                        teamLeader.UserId,
                        projectId);

            return messages
                .Select(MapToResponse)
                .ToList();
        }

        // =========================================================
        // GET MY INBOX
        // DEV-COMM-001 / STAFF-COMM-001
        // =========================================================

        public async Task<List<MessageResponseDto>>
            GetMyInboxAsync(Guid userId)
        {
            if (userId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Invalid user identity.");
            }

            var messages =
                await _messageRepository
                    .GetInboxAsync(userId);

            return messages
                .Select(MapToResponse)
                .ToList();
        }

        // =========================================================
        // GET SINGLE MESSAGE
        // =========================================================

        public async Task<MessageResponseDto?>
            GetMessageByIdAsync(
                Guid userId,
                Guid messageId)
        {
            if (userId == Guid.Empty ||
                messageId == Guid.Empty)
            {
                return null;
            }

            var message =
                await _messageRepository
                    .GetByIdAsync(messageId);

            if (message == null)
            {
                return null;
            }

            // =====================================================
            // ONLY SENDER OR RECEIVER CAN ACCESS
            // =====================================================

            if (message.SenderId != userId &&
                message.ReceiverId != userId)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            return MapToResponse(message);
        }

        // =========================================================
        // MARK MESSAGE AS READ
        // =========================================================

        public async Task<(bool Success, string Message)>
            MarkAsReadAsync(
                Guid userId,
                Guid messageId)
        {
            if (userId == Guid.Empty)
            {
                return (
                    false,
                    "Invalid user identity.");
            }

            if (messageId == Guid.Empty)
            {
                return (
                    false,
                    "Invalid message.");
            }

            var message =
                await _messageRepository
                    .GetByIdAsync(messageId);

            if (message == null)
            {
                return (
                    false,
                    "Message not found.");
            }

            // =====================================================
            // ONLY RECEIVER CAN MARK MESSAGE AS READ
            // =====================================================

            if (message.ReceiverId != userId)
            {
                return (
                    false,
                    "Access denied.");
            }

            // =====================================================
            // ALREADY READ
            // =====================================================

            if (message.IsRead)
            {
                return (
                    true,
                    "Message is already marked as read.");
            }

            // =====================================================
            // MARK READ
            // =====================================================

            message.IsRead = true;

            message.ReadAt = DateTime.UtcNow;

            await _messageRepository.UpdateAsync(message);

            return (
                true,
                "Message marked as read.");
        }

        // =========================================================
        // GET UNREAD COUNT
        // =========================================================

        public async Task<int>
            GetUnreadCountAsync(Guid userId)
        {
            if (userId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Invalid user identity.");
            }

            return await _messageRepository
                .GetUnreadCountAsync(userId);
        }

        // =========================================================
        // ENTITY -> DTO
        // =========================================================

        private static MessageResponseDto
            MapToResponse(
                AI_PMS.Domain.Entities.Communication.Message message)
        {
            return new MessageResponseDto
            {
                Id = message.Id,

                SenderId = message.SenderId,

                SenderName =
                    message.Sender?.FullName
                    ?? string.Empty,

                ReceiverId = message.ReceiverId,

                ReceiverName =
                    message.Receiver?.FullName
                    ?? string.Empty,

                ProjectId = message.ProjectId,

                TeamId = message.TeamId,

                TaskId = message.TaskId,

                Title = message.Title,

                Message = message.Content,

                IsRead = message.IsRead,

                ReadAt = message.ReadAt,

                CreatedAt = message.CreatedAt
            };
        }
    }
}
