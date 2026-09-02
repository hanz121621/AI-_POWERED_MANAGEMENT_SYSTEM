using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Application.Interfaces.Repositories.Projects;
using AI_PMS.Application.Interfaces.Activities;

namespace AI_PMS.Application.Services.Projects
{
    public class ProjectParticipationService
        : IProjectParticipationService
    {
        private readonly IProjectParticipationRepository
            _repository;

        private readonly IActivityLogService
            _activityLogService;

        public ProjectParticipationService(
            IProjectParticipationRepository repository,
            IActivityLogService activityLogService)
        {
            _repository = repository;
            _activityLogService = activityLogService;
        }


        // =========================================================
        // DEV-PROJECT-001
        // STAFF-PROJECT-001
        // VIEW ASSIGNED PROJECTS
        // =========================================================

        public async Task<IEnumerable<ProjectParticipationDto>>
            GetAssignedProjectsAsync(
                Guid userId)
        {
            if (userId == Guid.Empty)
            {
                throw new UnauthorizedAccessException(
                    "Invalid contributor identity.");
            }

            var projects =
                await _repository
                    .GetAssignedProjectsAsync(userId);

            return projects;
        }


        // =========================================================
        // DEV-PROJECT-002
        // STAFF-PROJECT-002
        // VIEW PROJECT DETAILS
        // =========================================================

        public async Task<ProjectParticipationDetailsDto?>
            GetProjectDetailsAsync(
                Guid projectId,
                Guid userId)
        {
            if (userId == Guid.Empty)
            {
                throw new UnauthorizedAccessException(
                    "Invalid contributor identity.");
            }

            if (projectId == Guid.Empty)
            {
                throw new KeyNotFoundException(
                    "Project not found.");
            }

            var project =
                await _repository
                    .GetProjectDetailsAsync(
                        projectId,
                        userId);

            if (project == null)
            {
                // We deliberately do not expose whether the
                // project exists when the user is not a member.
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            // -----------------------------------------------------
            // RECORD PROJECT ACCESS
            // -----------------------------------------------------

            await _activityLogService.CreateAsync(
                userId: userId,
                action: "Viewed project",
                activityType: "ProjectAccess",
                entityId: projectId,
                entityType: "Project",
                description:
                    $"Contributor viewed project '{project.ProjectName}'.",
                projectId: projectId,
                teamId: project.TeamId);

            return project;
        }
    }
}