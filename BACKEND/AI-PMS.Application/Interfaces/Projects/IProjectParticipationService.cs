using AI_PMS.Application.DTOs.Projects;

namespace AI_PMS.Application.Interfaces.Projects
{
    public interface IProjectParticipationService
    {
        // =========================================================
        // DEV-PROJECT-001
        // STAFF-PROJECT-001
        // VIEW ASSIGNED PROJECTS
        // =========================================================

        Task<IEnumerable<ProjectParticipationDto>>
            GetAssignedProjectsAsync(Guid userId);

        // =========================================================
        // DEV-PROJECT-002
        // STAFF-PROJECT-002
        // VIEW PROJECT DETAILS
        // =========================================================

        Task<ProjectParticipationDetailsDto?>
            GetProjectDetailsAsync(
                Guid projectId,
                Guid userId);
    }
}