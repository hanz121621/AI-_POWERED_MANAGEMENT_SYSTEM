using AI_PMS.Application.DTOs.Projects;

namespace AI_PMS.Application.Interfaces.Projects
{
    public interface IProjectAssignmentService
    {
        // =========================================================
        // ASSIGN PROJECT TO MANAGER
        // =========================================================

        Task<bool> AssignProjectAsync(
            AssignProjectDto dto);

        // =========================================================
        // CHANGE PROJECT MANAGER
        // =========================================================

        Task<bool> ChangeManagerAsync(
            AssignProjectDto dto);

        // =========================================================
        // GET ASSIGNED MANAGER
        // =========================================================

        Task<Guid?> GetAssignedManagerAsync(
            Guid projectId);

        // =========================================================
        // GET MANAGER PROJECTS
        // =========================================================

        Task<IEnumerable<Guid>> GetManagerProjectsAsync(
            Guid managerId);
    }
}