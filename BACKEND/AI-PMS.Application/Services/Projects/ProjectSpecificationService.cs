using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Application.Interfaces.Repositories.Projects;
using AI_PMS.Domain.Entities.Projects;

namespace AI_PMS.Application.Services.Projects
{
    public class ProjectSpecificationService
        : IProjectSpecificationService
    {
        private readonly IProjectSpecificationRepository _specificationRepository;
        private readonly IProjectRepository _projectRepository;

        public ProjectSpecificationService(
            IProjectSpecificationRepository specificationRepository,
            IProjectRepository projectRepository)
        {
            _specificationRepository = specificationRepository;
            _projectRepository = projectRepository;
        }

        // =========================================================
        // CREATE
        // =========================================================

        public async Task<ProjectSpecificationDto?> CreateAsync(
            Guid projectId,
            CreateProjectSpecificationDto dto,
            Guid managerId)
        {
            var project =
                await _projectRepository.GetByIdAsync(projectId);

            if (project == null)
                throw new KeyNotFoundException(
                    "Project not found.");

            if (project.ManagerId != managerId)
                throw new UnauthorizedAccessException(
                    "You are not authorised to manage this project.");

            if (await _specificationRepository
                .ExistsForProjectAsync(projectId))
            {
                throw new InvalidOperationException(
                    "A project specification already exists. Please update it instead.");
            }

            var specification = new ProjectSpecification
            {
                ProjectId = projectId,

                Objectives = dto.Objectives.Trim(),

                Scope = dto.Scope.Trim(),

                FunctionalRequirements =
                    dto.FunctionalRequirements.Trim(),

                NonFunctionalRequirements =
                    dto.NonFunctionalRequirements.Trim(),

                Deliverables =
                    dto.Deliverables.Trim(),

                TechnologyStack =
                    dto.TechnologyStack.Trim(),

                Assumptions =
                    dto.Assumptions?.Trim(),

                Constraints =
                    dto.Constraints?.Trim(),

                CreatedAt = DateTime.UtcNow
            };

            var created =
                await _specificationRepository
                    .AddAsync(specification);

            return MapToDto(created);
        }

        // =========================================================
        // GET
        // =========================================================

        public async Task<ProjectSpecificationDto?> GetByProjectIdAsync(
            Guid projectId,
            Guid managerId)
        {
            var project =
                await _projectRepository.GetByIdAsync(projectId);

            if (project == null)
                throw new KeyNotFoundException(
                    "Project not found.");

            if (project.ManagerId != managerId)
                throw new UnauthorizedAccessException(
                    "You are not authorised to manage this project.");

            var specification =
                await _specificationRepository
                    .GetByProjectIdAsync(projectId);

            return specification == null
                ? null
                : MapToDto(specification);
        }

        // =========================================================
        // UPDATE
        // =========================================================

        public async Task<ProjectSpecificationDto?> UpdateAsync(
            Guid projectId,
            CreateProjectSpecificationDto dto,
            Guid managerId)
        {
            var project =
                await _projectRepository.GetByIdAsync(projectId);

            if (project == null)
                throw new KeyNotFoundException(
                    "Project not found.");

            if (project.ManagerId != managerId)
                throw new UnauthorizedAccessException(
                    "You are not authorised to manage this project.");

            var specification =
                await _specificationRepository
                    .GetByProjectIdAsync(projectId);

            if (specification == null)
                return null;

            specification.Objectives =
                dto.Objectives.Trim();

            specification.Scope =
                dto.Scope.Trim();

            specification.FunctionalRequirements =
                dto.FunctionalRequirements.Trim();

            specification.NonFunctionalRequirements =
                dto.NonFunctionalRequirements.Trim();

            specification.Deliverables =
                dto.Deliverables.Trim();

            specification.TechnologyStack =
                dto.TechnologyStack.Trim();

            specification.Assumptions =
                dto.Assumptions?.Trim();

            specification.Constraints =
                dto.Constraints?.Trim();

            specification.UpdatedAt =
                DateTime.UtcNow;

            await _specificationRepository
                .UpdateAsync(specification);

            return MapToDto(specification);
        }

        // =========================================================
        // DELETE
        // =========================================================

        public async Task<bool> DeleteAsync(
            Guid projectId,
            Guid managerId)
        {
            // -----------------------------------------------------
            // 1. Check project
            // -----------------------------------------------------

            var project =
                await _projectRepository.GetByIdAsync(projectId);

            if (project == null)
                throw new KeyNotFoundException(
                    "Project not found.");

            // -----------------------------------------------------
            // 2. Check manager authorization
            // -----------------------------------------------------

            if (project.ManagerId != managerId)
                throw new UnauthorizedAccessException(
                    "You are not authorised to manage this project.");

            // -----------------------------------------------------
            // 3. Get specification
            // -----------------------------------------------------

            var specification =
                await _specificationRepository
                    .GetByProjectIdAsync(projectId);

            if (specification == null)
                return false;

            // -----------------------------------------------------
            // 4. Check dependencies
            // -----------------------------------------------------

            var hasDependencies =
                await _specificationRepository
                    .HasDependenciesAsync(projectId);

            if (hasDependencies)
            {
                throw new InvalidOperationException(
                    "The project specification cannot be deleted because it is being used by active project dependencies.");
            }

            // -----------------------------------------------------
            // 5. Delete specification
            // -----------------------------------------------------

            await _specificationRepository
                .DeleteAsync(specification);

            return true;
        }

        // =========================================================
        // DTO MAPPING
        // =========================================================

        private static ProjectSpecificationDto MapToDto(
            ProjectSpecification specification)
        {
            return new ProjectSpecificationDto
            {
                Id = specification.Id,

                ProjectId = specification.ProjectId,

                Objectives =
                    specification.Objectives,

                Scope =
                    specification.Scope,

                FunctionalRequirements =
                    specification.FunctionalRequirements,

                NonFunctionalRequirements =
                    specification.NonFunctionalRequirements,

                Deliverables =
                    specification.Deliverables,

                TechnologyStack =
                    specification.TechnologyStack,

                Assumptions =
                    specification.Assumptions,

                Constraints =
                    specification.Constraints,

                CreatedAt =
                    specification.CreatedAt,

                UpdatedAt =
                    specification.UpdatedAt
            };
        }
    }
}