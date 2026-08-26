using AI_PMS.Application.Interfaces.Repositories.Projects;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Projects
{
    public class ProjectSpecificationRepository
        : IProjectSpecificationRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectSpecificationRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE
        // =========================================================

        public async Task<ProjectSpecification> AddAsync(
            ProjectSpecification specification)
        {
            await _context.ProjectSpecifications
                .AddAsync(specification);

            await _context.SaveChangesAsync();

            return specification;
        }

        // =========================================================
        // GET BY PROJECT
        // =========================================================

        public async Task<ProjectSpecification?> GetByProjectIdAsync(
            Guid projectId)
        {
            return await _context.ProjectSpecifications
                .FirstOrDefaultAsync(x =>
                    x.ProjectId == projectId);
        }

        // =========================================================
        // EXISTS
        // =========================================================

        public async Task<bool> ExistsForProjectAsync(
            Guid projectId)
        {
            return await _context.ProjectSpecifications
                .AnyAsync(x =>
                    x.ProjectId == projectId);
        }

        // =========================================================
        // UPDATE
        // =========================================================

        public async Task UpdateAsync(
            ProjectSpecification specification)
        {
            _context.ProjectSpecifications
                .Update(specification);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // CHECK DEPENDENCIES
        // =========================================================

        public async Task<bool> HasDependenciesAsync(
            Guid projectId)
        {
            // -----------------------------------------------------
            // Check non-deleted sprints belonging to the project.
            // -----------------------------------------------------

            var hasSprint =
                await _context.Sprints
                    .AnyAsync(s =>
                        s.ProjectId == projectId &&
                        !s.IsDeleted);

            if (hasSprint)
                return true;

            // -----------------------------------------------------
            // Check tasks belonging to project sprints.
            // -----------------------------------------------------

            var hasTask =
                await _context.Tasks
                    .Join(
                        _context.Sprints,
                        task => task.SprintId,
                        sprint => sprint.Id,
                        (task, sprint) => new
                        {
                            task,
                            sprint
                        })
                    .AnyAsync(x =>
                        x.sprint.ProjectId == projectId &&
                        !x.sprint.IsDeleted);

            return hasTask;
        }

        // =========================================================
        // DELETE
        // =========================================================

        public async Task DeleteAsync(
            ProjectSpecification specification)
        {
            _context.ProjectSpecifications
                .Remove(specification);

            await _context.SaveChangesAsync();
        }
    }
}