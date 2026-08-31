using AI_PMS.Application.DTOs.Projects;

namespace AI_PMS.Application.Interfaces.Projects
{
    public interface IProjectSpecificationService
    {
        Task<ProjectSpecificationDto?> CreateAsync(
            Guid projectId,
            CreateProjectSpecificationDto dto,
            Guid managerId);

        Task<ProjectSpecificationDto?> GetByProjectIdAsync(
            Guid projectId,
            Guid managerId);

        Task<ProjectSpecificationDto?> UpdateAsync(
            Guid projectId,
            CreateProjectSpecificationDto dto,
            Guid managerId);

        Task<bool> DeleteAsync(
            Guid projectId,
            Guid managerId);
    }
}
