using AI_PMS.Domain.Entities.Projects;

namespace AI_PMS.Application.Interfaces.Repositories.Projects
{
    public interface IProjectSpecificationRepository
    {
        Task<ProjectSpecification> AddAsync(
            ProjectSpecification specification);

        Task<ProjectSpecification?> GetByProjectIdAsync(
            Guid projectId);

        Task<bool> ExistsForProjectAsync(
            Guid projectId);

        Task UpdateAsync(
            ProjectSpecification specification);

        Task<bool> HasDependenciesAsync(
            Guid projectId);

        Task DeleteAsync(
            ProjectSpecification specification);
    }
}