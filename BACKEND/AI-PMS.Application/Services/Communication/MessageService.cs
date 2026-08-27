
using AI_PMS.Application.DTOs.Communication;
using AI_PMS.Application.Interfaces.Communication;
using AI_PMS.Application.Interfaces.Repositories.Communication;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Projects;

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

        public async Task<MessageResponseDto>
            SendMessageToTeamLeaderAsync(
                Guid managerId,
                SendTeamLeaderMessageDto request)
        {
            // =====================================================
            // VALIDATE MESSAGE
            // =====================================================

            if (string.IsNullOrWhiteSpace(request.Message))
            {
                throw new ArgumentException(
                    "Message cannot be empty.");
            }

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

            if (project.TeamId == null)
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

            var message = new AI_PMS.Domain.Entities.Communication.Message
            {
                SenderId = managerId,

                ReceiverId = teamLeader.UserId,

                ProjectId = request.ProjectId,

                TeamId = teamId,

                Content = messageContent,

                CreatedAt = DateTime.UtcNow
            };

            await _messageRepository.AddAsync(message);

            // =====================================================
            // RESPONSE
            // =====================================================

            return new MessageResponseDto
            {
                Id = message.Id,

                SenderId = message.SenderId,

                ReceiverId = message.ReceiverId,

                ProjectId = message.ProjectId,

                TeamId = message.TeamId,

                Message = message.Content,

                CreatedAt = message.CreatedAt
            };
        }

        public async Task<List<MessageResponseDto>>
            GetConversationAsync(
                Guid managerId,
                Guid projectId)
        {
            var project =
                await _projectRepository.GetByIdAsync(
                    projectId);

            if (project == null)
            {
                throw new KeyNotFoundException(
                    "Project was not found.");
            }

            if (project.ManagerId != managerId)
            {
                throw new UnauthorizedAccessException(
                    "You are not authorized to access this conversation.");
            }

            if (project.TeamId == null)
            {
                throw new InvalidOperationException(
                    "No Team is currently assigned to this project.");
            }

            var teamLeader =
                await _teamRepository.GetTeamLeaderAsync(
                    project.TeamId.Value);

            if (teamLeader == null)
            {
                throw new InvalidOperationException(
                    "No Team Leader is currently assigned to this Team.");
            }

            var messages =
                await _messageRepository
                    .GetConversationAsync(
                        managerId,
                        teamLeader.UserId,
                        projectId);

            return messages
                .Select(m => new MessageResponseDto
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    ReceiverId = m.ReceiverId,
                    ProjectId = m.ProjectId,
                    TeamId = m.TeamId,
                    Message = m.Content,
                    CreatedAt = m.CreatedAt
                })
                .ToList();
        }
    }
}

