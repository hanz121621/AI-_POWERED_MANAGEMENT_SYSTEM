
using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.DTOs.Teams;

namespace AI_PMS.Application.Interfaces.Teams
{
    public interface ITeamLeaderProjectService
    {
        // =========================================================
        // TL-PROJECT-001
        // VIEW ASSIGNED PROJECTS
        // =========================================================

        Task<IEnumerable<TeamLeaderProjectDto>>
            GetAssignedProjectsAsync(
                Guid teamLeaderId);

        // =========================================================
        // TL-PROJECT-001
        // GET MY PROJECTS
        // =========================================================

        Task<IEnumerable<ProjectDto>>
            GetMyProjectsAsync(
                Guid teamLeaderId);

        // =========================================================
        // TL-PROJECT-002
        // GET PROJECT
        // =========================================================

        Task<ProjectDto?>
            GetProjectAsync(
                Guid teamLeaderId,
                Guid projectId);

        // =========================================================
        // TL-PROJECT-002
        // VIEW PROJECT DETAILS
        // =========================================================

        Task<TeamLeaderProjectDetailsDto?>
            GetProjectDetailsAsync(
                Guid teamLeaderId,
                Guid projectId);
    }
}
