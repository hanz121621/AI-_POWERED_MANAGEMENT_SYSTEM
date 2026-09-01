using AI_PMS.Application.DTOs.Communication;
using AI_PMS.Application.Interfaces.Communication;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Application.Interfaces.Repositories.Communication;
using AI_PMS.Application.Interfaces.Repositories.Notifications;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Domain.Entities.Communication;
using AI_PMS.Domain.Entities.Notifications;

namespace AI_PMS.Application.Services.Communication
{
    public class MentionService : IMentionService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMessageMentionRepository _mentionRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly INotificationRepository _notificationRepository;

        public MentionService(
            IMessageRepository messageRepository,
            IMessageMentionRepository mentionRepository,
            IProjectRepository projectRepository,
            ITeamRepository teamRepository,
            INotificationRepository notificationRepository)
        {
            _messageRepository = messageRepository;
            _mentionRepository = mentionRepository;
            _projectRepository = projectRepository;
            _teamRepository = teamRepository;
            _notificationRepository = notificationRepository;
        }

        // =========================================================
        // MENTION TEAM LEADER
        // =========================================================

        public async Task<MessageMentionDto>
            MentionTeamLeaderAsync(
                Guid managerId,
                Guid messageId)
        {
            // =====================================================
            // GET MESSAGE
            // =====================================================

            var message =
                await _messageRepository.GetByIdAsync(
                    messageId);

            if (message == null)
            {
                throw new KeyNotFoundException(
                    "Message was not found.");
            }

            // =====================================================
            // VERIFY MESSAGE SENDER
            // =====================================================

            if (message.SenderId != managerId)
            {
                throw new UnauthorizedAccessException(
                    "You are not authorized to mention a Team Leader in this message.");
            }

            // =====================================================
            // GET PROJECT
            // =====================================================

            var project =
                await _projectRepository.GetByIdAsync(
                    message.ProjectId);

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
                    "You are not authorized to mention the Team Leader of this project.");
            }

            // =====================================================
            // VERIFY CURRENT TEAM
            // =====================================================

            if (project.TeamId == null)
            {
                throw new InvalidOperationException(
                    "No Team is currently assigned to this project.");
            }

            var currentTeamId =
                project.TeamId.Value;

            // =====================================================
            // VERIFY MESSAGE TEAM IS CURRENT TEAM
            // =====================================================

            if (message.TeamId != currentTeamId)
            {
                throw new InvalidOperationException(
                    "This message is not associated with the current project Team.");
            }

            // =====================================================
            // GET CURRENT TEAM LEADER
            // =====================================================

            var teamLeader =
                await _teamRepository.GetTeamLeaderAsync(
                    currentTeamId);

            if (teamLeader == null)
            {
                throw new InvalidOperationException(
                    "No Team Leader is currently assigned to this Team.");
            }

            // =====================================================
            // VERIFY TEAM LEADER USER
            // =====================================================

            if (teamLeader.User == null ||
                !teamLeader.User.IsActive)
            {
                throw new InvalidOperationException(
                    "The current Team Leader is unavailable.");
            }

            // =====================================================
            // PREVENT SELF-MENTION
            // =====================================================

            if (teamLeader.UserId == managerId)
            {
                throw new InvalidOperationException(
                    "The Manager cannot mention themselves.");
            }

            // =====================================================
            // CHECK EXISTING MENTION
            // =====================================================

            var existingMentions =
                await _mentionRepository.GetByMessageIdAsync(
                    messageId);

            var alreadyMentioned =
                existingMentions.Any(m =>
                    m.MentionedUserId ==
                    teamLeader.UserId);

            if (alreadyMentioned)
            {
                throw new InvalidOperationException(
                    "The Team Leader has already been mentioned in this message.");
            }

            // =====================================================
            // CREATE MENTION
            // =====================================================

            var mention =
                new MessageMention
                {
                    MessageId = message.Id,

                    MentionedUserId =
                        teamLeader.UserId,

                    CreatedAt =
                        DateTime.UtcNow
                };

            await _mentionRepository.AddAsync(
                mention);

            // =====================================================
            // GET CONFIGURED NOTIFICATION TYPE
            // =====================================================

            var notificationType =
                await _notificationRepository
                    .GetTypeByNameAsync(
                        "TeamLeaderMention");

            if (notificationType == null)
            {
                throw new InvalidOperationException(
                    "The TeamLeaderMention notification type is not configured.");
            }

            // =====================================================
            // CREATE NOTIFICATION
            // =====================================================

            var notification =
                new Notification
                {
                    UserId =
                        teamLeader.UserId,

                    NotificationTypeId =
                        notificationType.Id,

                    Title =
                        "You were mentioned",

                    Message =
                        "You were mentioned by the Project Manager in a project communication.",

                    ProjectId =
                        message.ProjectId,

                    TeamId =
                        message.TeamId,

                    RelatedEntityId =
                        message.Id,

                    RelatedEntityType =
                        "Message",

                    IsRead = false,

                    CreatedAt =
                        DateTime.UtcNow
                };

            await _notificationRepository.AddAsync(
                notification);

            // =====================================================
            // RESPONSE
            // =====================================================

            return new MessageMentionDto
            {
                Id = mention.Id,

                MessageId =
                    mention.MessageId,

                MentionedUserId =
                    mention.MentionedUserId,

                MentionedUserName =
                    teamLeader.User.FullName,

                CreatedAt =
                    mention.CreatedAt
            };
        }
    }
}