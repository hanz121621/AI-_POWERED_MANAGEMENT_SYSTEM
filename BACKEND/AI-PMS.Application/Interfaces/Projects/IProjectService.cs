using AI_PMS.Application.DTOs.Projects;

namespace AI_PMS.Application.Interfaces.Projects
{
    public interface IProjectService
    {
        // =========================================================
        // CREATE PROJECT
        // =========================================================

        Task<ProjectDto?> CreateAsync(
            CreateProjectDto dto,
            Guid createdBy);


        // =========================================================
        // READ PROJECTS
        // =========================================================

        Task<IEnumerable<ProjectDto>> GetAllAsync();

        Task<ProjectDto?> GetByIdAsync(Guid id);

        Task<IEnumerable<ProjectDto>> GetActiveAsync();

        Task<IEnumerable<ProjectDto>> GetArchivedAsync();


        // =========================================================
        // UPDATE PROJECT
        // =========================================================

        Task<ProjectUpdateResultDto> UpdateAsync(
            Guid id,
            UpdateProjectDto dto);


        // =========================================================
        // DELETE PROJECT
        // =========================================================

        Task<bool> DeleteAsync(Guid id);


        // =========================================================
        // APPROVE / REJECT PROJECT
        // =========================================================

        Task<bool> ApproveAsync(Guid id);

        Task<bool> RejectAsync(Guid id);


        // =========================================================
        // PROJECT STATUS MANAGEMENT
        // =========================================================

        Task<ProjectUpdateResultDto> ChangeStatusAsync(
            Guid projectId,
            Guid statusId);

        Task<IEnumerable<ProjectStatusDto>>
            GetAllowedNextStatusesAsync(
                Guid projectId);


        // =========================================================
        // ARCHIVE / RESTORE
        // =========================================================

        Task<ProjectUpdateResultDto> ArchiveAsync(
            Guid projectId);

        Task<ProjectUpdateResultDto> RestoreAsync(
            Guid projectId);


        // =========================================================
        // PROJECT ASSIGNMENT
        // =========================================================

        Task<bool> AssignManagerAsync(
            Guid projectId,
            Guid managerId);
    }
}