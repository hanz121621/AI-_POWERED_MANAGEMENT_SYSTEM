using AI_PMS.Application.DTOs.Communication;
using AI_PMS.Application.Interfaces.Communication;
using AI_PMS.Application.Interfaces.Projects;
using  AI_PMS.Application.Interfaces.Repositories.Sprints;
using AI_PMS.Application.Interfaces.Repositories.Projects;
using AI_PMS.Application.Interfaces.Repositories.Communication;
using AI_PMS.Application.Interfaces.Repositories.Notifications;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Repositories.TaskComments;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Sprints;
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
        private readonly ITaskCommentRepository _taskCommentRepository;
        private readonly ITaskRepository _taskRepository;
        private readonly ISprintRepository _sprintRepository;

        public MentionService(
            IMessageRepository messageRepository,
            IMessageMentionRepository mentionRepository,
            IProjectRepository projectRepository,
            ITeamRepository teamRepository,
            INotificationRepository notificationRepository,
            ITaskCommentRepository taskCommentRepository,
            ITaskRepository taskRepository,
            ISprintRepository sprintRepository)
        {
            _messageRepository = messageRepository;
            _mentionRepository = mentionRepository;
            _projectRepository = projectRepository;
            _teamRepository = teamRepository;
            _notificationRepository = notificationRepository;
            _taskCommentRepository = taskCommentRepository;
            _taskRepository = taskRepository;
            _sprintRepository = sprintRepository;
        }

        // =========================================================
        // MENTION TEAM LEADER IN MESSAGE
        // =========================================================

        public async Task<MessageMentionDto>
            MentionTeamLeaderAsync(
                Guid managerId,
                Guid messageId)
        {
            if (managerId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Invalid manager identity.");
            }

            if (messageId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Message ID is required.");
            }

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
                    "You are not authorized to mention the Team Leader in this message.");
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

            if (!project.TeamId.HasValue)
            {
                throw new InvalidOperationException(
                    "No Team is currently assigned to this project.");
            }

            var currentTeamId =
                project.TeamId.Value;

            // =====================================================
            // VERIFY MESSAGE TEAM
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
            // PREVENT SELF MENTION
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

            if (existingMentions.Any(m =>
                m.MentionedUserId == teamLeader.UserId))
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
                    Id = Guid.NewGuid(),

                    MessageId =
                        message.Id,

                    TaskCommentId =
                        null,

                    MentionedUserId =
                        teamLeader.UserId,

                    CreatedAt =
                        DateTime.UtcNow
                };

            await _mentionRepository.AddAsync(
                mention);

            // =====================================================
            // GET NOTIFICATION TYPE
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
                    Id = Guid.NewGuid(),

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

                    IsRead =
                        false,

                    ReadAt =
                        null,

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
                Id =
                    mention.Id,

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


        // =========================================================
        // MENTION TEAM MEMBERS IN TASK COMMENT
        //
        // DEV-COMM-003
        // STAFF-COMM-003
        // =========================================================

        public async Task<List<MessageMentionDto>>
            MentionTeamMembersInTaskCommentAsync(
                Guid userId,
                Guid taskCommentId,
                List<Guid> mentionedUserIds)
        {
            // =====================================================
            // VALIDATE USER
            // =====================================================

            if (userId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Invalid user identity.");
            }

            // =====================================================
            // VALIDATE COMMENT ID
            // =====================================================

            if (taskCommentId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Task comment ID is required.");
            }

            // =====================================================
            // VALIDATE MENTION LIST
            // =====================================================

            if (mentionedUserIds == null ||
                mentionedUserIds.Count == 0)
            {
                return new List<MessageMentionDto>();
            }

            mentionedUserIds =
                mentionedUserIds
                    .Where(id => id != Guid.Empty)
                    .Distinct()
                    .ToList();

            if (mentionedUserIds.Count == 0)
            {
                return new List<MessageMentionDto>();
            }

            // =====================================================
            // GET TASK COMMENT
            // =====================================================

            var taskComment =
                await _taskCommentRepository
                    .GetByIdAsync(taskCommentId);

            if (taskComment == null)
            {
                throw new KeyNotFoundException(
                    "Task comment was not found.");
            }

            // =====================================================
            // VERIFY COMMENT AUTHOR
            // =====================================================

            if (taskComment.CreatedBy != userId)
            {
                throw new UnauthorizedAccessException(
                    "You are not authorized to add mentions to this comment.");
            }

            // =====================================================
            // GET TASK
            // =====================================================

            var task =
                await _taskRepository
                    .GetByIdAsync(taskComment.TaskId);

            if (task == null)
            {
                throw new KeyNotFoundException(
                    "Task was not found.");
            }

            // =====================================================
            // GET SPRINT
            //
            // TaskItem does NOT have ProjectId.
            //
            // Task → Sprint → Project
            // =====================================================

            var sprint =
                await _sprintRepository
                    .GetByIdAsync(task.SprintId);

            if (sprint == null)
            {
                throw new KeyNotFoundException(
                    "Sprint was not found.");
            }

            // =====================================================
            // GET PROJECT
            // =====================================================

            var project =
                await _projectRepository
                    .GetByIdAsync(sprint.ProjectId);

            if (project == null)
            {
                throw new KeyNotFoundException(
                    "Project was not found.");
            }

            // =====================================================
            // VERIFY CURRENT TEAM
            // =====================================================

            if (!project.TeamId.HasValue)
            {
                throw new InvalidOperationException(
                    "No Team is currently assigned to this project.");
            }

            var teamId =
                project.TeamId.Value;

            // =====================================================
            // GET ACTIVE TEAM MEMBERS
            // =====================================================

            var teamMembers =
                await _teamRepository
                    .GetMembersAsync(teamId);

            var activeMembers =
                teamMembers
                    .Where(tm =>
                        tm.IsActive &&
                        tm.User != null &&
                        tm.User.IsActive)
                    .ToList();

            // =====================================================
            // VERIFY COMMENT AUTHOR IS ACTIVE TEAM MEMBER
            // =====================================================

            var authorIsTeamMember =
                activeMembers.Any(tm =>
                    tm.UserId == userId);

            if (!authorIsTeamMember)
            {
                throw new UnauthorizedAccessException(
                    "You are not an active member of the project's current Team.");
            }

            // =====================================================
            // GET NOTIFICATION TYPE ONCE
            // =====================================================

            var notificationType =
                await _notificationRepository
                    .GetTypeByNameAsync(
                        "TaskCommentMention");

            if (notificationType == null)
            {
                throw new InvalidOperationException(
                    "The TaskCommentMention notification type is not configured.");
            }

            // =====================================================
            // RESULT
            // =====================================================

            var results =
                new List<MessageMentionDto>();

            // =====================================================
            // PROCESS EACH MENTION
            // =====================================================

            foreach (var mentionedUserId in mentionedUserIds)
            {
                // -------------------------------------------------
                // PREVENT SELF MENTION
                // -------------------------------------------------

                if (mentionedUserId == userId)
                {
                    throw new InvalidOperationException(
                        "You cannot mention yourself.");
                }

                // -------------------------------------------------
                // VERIFY ACTIVE TEAM MEMBER
                // -------------------------------------------------

                var teamMember =
                    activeMembers.FirstOrDefault(tm =>
                        tm.UserId == mentionedUserId);

                if (teamMember == null)
                {
                    throw new InvalidOperationException(
                        "One or more mentioned users are not active members of the project's current Team.");
                }

                // -------------------------------------------------
                // PREVENT DUPLICATE
                // -------------------------------------------------

                var alreadyExists =
                    await _mentionRepository
                        .ExistsForTaskCommentAsync(
                            taskCommentId,
                            mentionedUserId);

                if (alreadyExists)
                {
                    continue;
                }

                // -------------------------------------------------
                // CREATE MENTION
                // -------------------------------------------------

                var mention =
                    new MessageMention
                    {
                        Id =
                            Guid.NewGuid(),

                        MessageId =
                            null,

                        TaskCommentId =
                            taskCommentId,

                        MentionedUserId =
                            mentionedUserId,

                        CreatedAt =
                            DateTime.UtcNow
                    };

                await _mentionRepository
                    .AddAsync(mention);

                // -------------------------------------------------
                // CREATE NOTIFICATION
                // -------------------------------------------------

                var notification =
                    new Notification
                    {
                        Id =
                            Guid.NewGuid(),

                        UserId =
                            mentionedUserId,

                        NotificationTypeId =
                            notificationType.Id,

                        Title =
                            "You were mentioned",

                        Message =
                            "You were mentioned in a task comment.",

                        ProjectId =
                            project.Id,

                        TeamId =
                            teamId,

                        RelatedEntityId =
                            taskComment.Id,

                        RelatedEntityType =
                            "TaskComment",

                        IsRead =
                            false,

                        ReadAt =
                            null,

                        CreatedAt =
                            DateTime.UtcNow
                    };

                await _notificationRepository
                    .AddAsync(notification);

                // -------------------------------------------------
                // RESPONSE
                // -------------------------------------------------

                results.Add(
                    new MessageMentionDto
                    {
                        Id =
                            mention.Id,

                        MessageId =
                            Guid.Empty,

                        MentionedUserId =
                            mention.MentionedUserId,

                        MentionedUserName =
                            teamMember.User!.FullName,

                        CreatedAt =
                            mention.CreatedAt
                    });
            }

            return results;
        }
    }
}