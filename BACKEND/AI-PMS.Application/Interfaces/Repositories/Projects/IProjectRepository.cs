using AI_PMS.Domain.Entities.Projects;

namespace AI_PMS.Application.Interfaces.Repositories.Projects
{
    public interface IProjectRepository
    {
        // =========================================================
        // CREATE
        // =========================================================

        Task<Project> AddAsync(Project project);

        // =========================================================
        // READ
        // =========================================================

        Task<List<Project>> GetAllAsync();

        Task<Project?> GetByIdAsync(Guid id);

        Task<Project?> GetByNameAsync(string name);

        Task<List<Project>> GetByManagerAsync(
            Guid managerId);
            Task<List<Project>> GetByTeamIdsAsync(
    IEnumerable<Guid> teamIds);

        Task<List<Project>> GetArchivedAsync();

        Task<List<Project>> GetActiveAsync();

        // =========================================================
        // CHECK PROJECT NAME
        // =========================================================

        Task<bool> NameExistsAsync(
            string name,
            Guid? excludeProjectId = null);

        // =========================================================
        // UPDATE
        // =========================================================

        Task UpdateAsync(Project project);

        // =========================================================
        // DELETE
        // =========================================================

        Task DeleteAsync(Project project);

        // =========================================================
        // PROJECT TIMELINE - PM-005
        // =========================================================

        Task<bool> HasTimelineConflictAsync(
            Guid projectId,
            DateTime startDate,
            DateTime deadline);

        Task UpdateTimelineAsync(
            Project project);

        // =========================================================
        // PROJECT STATUS
        // =========================================================

        Task<ProjectStatusDefinition?> GetStatusByIdAsync(
            Guid statusId);

        Task<List<ProjectStatusDefinition>>
            GetActiveStatusesAsync();

        Task<ProjectStatusDefinition?>
            GetInitialStatusAsync();

        Task<bool> IsStatusTransitionAllowedAsync(
            Guid fromStatusId,
            Guid toStatusId);

        Task<List<ProjectStatusDefinition>>
            GetAllowedNextStatusesAsync(
                Guid currentStatusId);

        // =========================================================
        // PROJECT STATUS TYPES
        // =========================================================

        Task<ProjectStatusDefinition?>
            GetApprovedStatusAsync();

        Task<ProjectStatusDefinition?>
            GetRejectedStatusAsync();

        Task<ProjectStatusDefinition?>
            GetArchivedStatusAsync();

            Task<bool> HasDeadlineConflictAsync(
    Guid projectId,
    DateTime deadline);

Task UpdateDeadlineAsync(
    Project project);
    }
}
