using AI_PMS.Domain.Entities.Projects;

namespace AI_PMS.Application.Interfaces.Projects
{
    public interface IProjectRepository
    {
        Task<Project> AddAsync(Project project);

        Task<List<Project>> GetAllAsync();

        Task<Project?> GetByIdAsync(Guid id);

        Task<Project?> GetByNameAsync(string name);

        Task<bool> NameExistsAsync(
            string name,
            Guid? excludeProjectId = null);

        Task UpdateAsync(Project project);

        Task DeleteAsync(Project project);

        Task<List<Project>> GetByManagerAsync(
            Guid managerId);

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

        Task<List<Project>> GetArchivedAsync();

        Task<List<Project>> GetActiveAsync();

        Task<ProjectStatusDefinition?>
            GetApprovedStatusAsync();

        Task<ProjectStatusDefinition?>
            GetRejectedStatusAsync();

        Task<ProjectStatusDefinition?>
            GetArchivedStatusAsync();
    }
}