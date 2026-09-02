
using AI_PMS.Application.DTOs.Communication;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Communication;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Application.Interfaces.Repositories.Communication;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Domain.Entities.Communication;
using AI_PMS.Application.Interfaces.Repositories.Projects;

namespace AI_PMS.Application.Services.Communication
{
    public class ProjectAnnouncementService
        : IProjectAnnouncementService
    {
        private readonly IProjectAnnouncementRepository _announcementRepository;
        private readonly IProjectAnnouncementRecipientRepository _recipientRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IActivityLogService _activityLogService;

        public ProjectAnnouncementService(
            IProjectAnnouncementRepository announcementRepository,
            IProjectAnnouncementRecipientRepository recipientRepository,
            IProjectRepository projectRepository,
            ITeamRepository teamRepository,
            IActivityLogService activityLogService)
        {
            _announcementRepository = announcementRepository;
            _recipientRepository = recipientRepository;
            _projectRepository = projectRepository;
            _teamRepository = teamRepository;
            _activityLogService = activityLogService;
        }

        // =========================================================
        // COMM-005
        // SEND PROJECT ANNOUNCEMENT
        // =========================================================

        public async Task<ProjectAnnouncementDto>
            SendAnnouncementAsync(
                Guid managerId,
                SendProjectAnnouncementDto request)
        {
            // =====================================================
            // VALIDATE REQUEST
            // =====================================================

            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (managerId == Guid.Empty)
            {
                throw new UnauthorizedAccessException(
                    "Manager authentication is required.");
            }

            if (request.ProjectId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Project ID is required.");
            }

            // =====================================================
            // VALIDATE TITLE
            // =====================================================

            if (string.IsNullOrWhiteSpace(request.Title))
            {
                throw new ArgumentException(
                    "Announcement title is required.");
            }

            var title = request.Title.Trim();

            if (title.Length > 200)
            {
                throw new ArgumentException(
                    "Announcement title cannot exceed 200 characters.");
            }

            // =====================================================
            // VALIDATE MESSAGE
            // =====================================================

            if (string.IsNullOrWhiteSpace(request.Message))
            {
                throw new ArgumentException(
                    "Announcement message is required.");
            }

            var messageText = request.Message.Trim();

            if (messageText.Length > 5000)
            {
                throw new ArgumentException(
                    "Announcement message cannot exceed 5000 characters.");
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
                    "You are not authorized to send announcements for this project.");
            }

            // =====================================================
            // VERIFY PROJECT TEAM
            // =====================================================

            if (project.TeamId == null)
            {
                throw new InvalidOperationException(
                    "No active Team is currently assigned to this project.");
            }

            var projectTeamId = project.TeamId.Value;

            // =====================================================
            // VERIFY REQUESTED TEAM
            // =====================================================

            if (request.TeamId.HasValue &&
                request.TeamId.Value != projectTeamId)
            {
                throw new UnauthorizedAccessException(
                    "The selected Team is not assigned to this project.");
            }

            // =====================================================
            // GET ACTIVE TEAM MEMBERS
            //
            // IMPORTANT:
            // Your ITeamRepository contains GetMembersAsync().
            // It does NOT contain GetTeamMembersAsync().
            // =====================================================

            var teamMembers =
                await _teamRepository.GetMembersAsync(
                    projectTeamId);

            if (teamMembers == null ||
                !teamMembers.Any())
            {
                throw new InvalidOperationException(
                    "No valid recipients available.");
            }

            // =====================================================
            // BUILD AUTHORIZED RECIPIENT LIST
            // =====================================================

            var authorizedRecipientIds =
                teamMembers
                    .Where(member =>
                        member.IsActive &&
                        member.UserId != managerId)
                    .Select(member =>
                        member.UserId)
                    .Distinct()
                    .ToHashSet();

            // =====================================================
            // RESOLVE RECIPIENTS
            //
            // If no recipients are supplied,
            // send to all active team members.
            // =====================================================

            HashSet<Guid> recipientIds;

            if (request.RecipientUserIds == null ||
                request.RecipientUserIds.Count == 0)
            {
                recipientIds = authorizedRecipientIds;
            }
            else
            {
                recipientIds =
                    request.RecipientUserIds
                        .Where(id => id != Guid.Empty)
                        .Distinct()
                        .ToHashSet();

                // =================================================
                // VERIFY SELECTED RECIPIENTS
                // =================================================

                var unauthorizedRecipients =
                    recipientIds
                        .Where(id =>
                            !authorizedRecipientIds.Contains(id))
                        .ToList();

                if (unauthorizedRecipients.Any())
                {
                    throw new UnauthorizedAccessException(
                        "One or more selected recipients are not authorized for this project/team.");
                }
            }

            // =====================================================
            // FINAL RECIPIENT VALIDATION
            // =====================================================

            if (recipientIds.Count == 0)
            {
                throw new InvalidOperationException(
                    "No valid recipients available.");
            }

            // =====================================================
            // CREATE ANNOUNCEMENT
            // =====================================================

            var announcement =
                new ProjectAnnouncement
                {
                    ProjectId = request.ProjectId,

                    TeamId = projectTeamId,

                    SenderId = managerId,

                    Title = title,

                    Message = messageText,

                    PriorityId = request.PriorityId,

                    CreatedAt = DateTime.UtcNow
                };

            await _announcementRepository
                .AddAsync(announcement);

            // =====================================================
            // CREATE RECIPIENT RECORDS
            // =====================================================

            var recipients =
                recipientIds
                    .Select(userId =>
                        new ProjectAnnouncementRecipient
                        {
                            AnnouncementId =
                                announcement.Id,

                            RecipientUserId =
                                userId,

                            NotificationSent =
                                false,

                            CreatedAt =
                                DateTime.UtcNow
                        })
                    .ToList();

            await _recipientRepository
                .AddRangeAsync(recipients);

            // =====================================================
            // ACTIVITY LOG
            // =====================================================

            await _activityLogService.CreateAsync(
                userId: managerId,
                action: "ProjectAnnouncementCreated",
                activityType: "Communication",
                entityId: announcement.Id,
                entityType: "ProjectAnnouncement",
                description:
                    $"Project announcement created: {title}",
                projectId: request.ProjectId,
                teamId: projectTeamId);

            // =====================================================
            // RESPONSE
            // =====================================================

            return new ProjectAnnouncementDto
            {
                Id =
                    announcement.Id,

                ProjectId =
                    announcement.ProjectId,

                TeamId =
                    announcement.TeamId,

                SenderId =
                    announcement.SenderId,

                Title =
                    announcement.Title,

                Message =
                    announcement.Message,

                PriorityId =
                    announcement.PriorityId,

                CreatedAt =
                    announcement.CreatedAt,

                RecipientUserIds =
                    recipientIds.ToList()
            };
        }

        // =========================================================
        // GET PROJECT ANNOUNCEMENTS
        // =========================================================

        public async Task<List<ProjectAnnouncementDto>>
            GetProjectAnnouncementsAsync(
                Guid managerId,
                Guid projectId)
        {
            // =====================================================
            // VALIDATE PROJECT ID
            // =====================================================

            if (projectId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Project ID is required.");
            }

            // =====================================================
            // GET PROJECT
            // =====================================================

            var project =
                await _projectRepository
                    .GetByIdAsync(projectId);

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
                    "You are not authorized to access announcements for this project.");
            }

            // =====================================================
            // GET ANNOUNCEMENTS
            // =====================================================

            var announcements =
                await _announcementRepository
                    .GetByProjectAsync(projectId);

            // =====================================================
            // MAP TO DTO
            // =====================================================

            var result =
                new List<ProjectAnnouncementDto>();

            foreach (var announcement in announcements)
            {
                var recipients =
                    await _recipientRepository
                        .GetByAnnouncementIdAsync(
                            announcement.Id);

                result.Add(
                    new ProjectAnnouncementDto
                    {
                        Id =
                            announcement.Id,

                        ProjectId =
                            announcement.ProjectId,

                        TeamId =
                            announcement.TeamId,

                        SenderId =
                            announcement.SenderId,

                        Title =
                            announcement.Title,

                        Message =
                            announcement.Message,

                        PriorityId =
                            announcement.PriorityId,

                        CreatedAt =
                            announcement.CreatedAt,

                        RecipientUserIds =
                            recipients
                                .Select(r =>
                                    r.RecipientUserId)
                                .ToList()
                    });
            }

            return result;
        }
    }
}

