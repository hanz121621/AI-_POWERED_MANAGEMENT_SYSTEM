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
// PROJECT DEADLINE
// =========================================================

Task<ProjectUpdateResultDto> UpdateDeadlineAsync(
    Guid projectId,
    UpdateProjectDeadlineDto dto,
    Guid managerId);

        // =========================================================
        // READ PROJECTS
        // =========================================================

        Task<IEnumerable<ProjectDto>> GetAllAsync();

        Task<ProjectDto?> GetByIdAsync(Guid id);

        Task<IEnumerable<ProjectDto>> GetActiveAsync();

        Task<IEnumerable<ProjectDto>> GetArchivedAsync();

        // =========================================================
        // PM-004
        // VIEW ASSIGNED PROJECTS
        // =========================================================

        Task<IEnumerable<ProjectDto>> GetAssignedProjectsAsync(
            Guid managerId);


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
    Guid statusId,
    Guid managerId,
    string? notes = null);

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

Task<ProjectDto?> UpdateTimelineAsync(
    Guid projectId,
    UpdateProjectTimelineDto dto,
    Guid managerId);

        // =========================================================
        // PROJECT ASSIGNMENT
        // =========================================================

        Task<bool> AssignManagerAsync(
            Guid projectId,
            Guid managerId);
    }
}