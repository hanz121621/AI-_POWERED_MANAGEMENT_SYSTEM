
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Application.Interfaces.Repositories.Projects;

using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Projects
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE
        // =========================================================

        public async Task<Project> AddAsync(Project project)
        {
            await _context.Projects.AddAsync(project);
            await _context.SaveChangesAsync();

            return project;
        }

        // =========================================================
        // GET ALL
        // =========================================================

      public async Task<List<Project>> GetAllAsync()
{
    return await _context.Projects
        .AsNoTracking()
        .Include(p => p.Status)
        .Where(p => !p.IsDeleted)
        .OrderBy(p => p.Name)
        .ToListAsync();
}

        // =========================================================
        // GET BY ID
        // =========================================================

        public async Task<Project?> GetByIdAsync(Guid id)
        {
            return await _context.Projects
                .Include(p => p.Status)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        // =========================================================
        // GET BY NAME
        // =========================================================

        public async Task<Project?> GetByNameAsync(
            string name)
        {
            var normalizedName =
                name.Trim().ToLower();

            return await _context.Projects
                .Include(p => p.Status)
                .FirstOrDefaultAsync(p =>
                    p.Name.ToLower() == normalizedName);
        }

        // =========================================================
        // CHECK NAME
        // =========================================================

        public async Task<bool> NameExistsAsync(
            string name,
            Guid? excludeProjectId = null)
        {
            var normalizedName =
                name.Trim().ToLower();

            return await _context.Projects
                .AnyAsync(p =>
                    p.Name.ToLower() == normalizedName &&
                    (!excludeProjectId.HasValue ||
                     p.Id != excludeProjectId.Value));
        }

        // =========================================================
        // UPDATE
        // =========================================================

        public async Task UpdateAsync(Project project)
        {
            project.UpdatedAt = DateTime.UtcNow;

            _context.Projects.Update(project);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // DELETE
        // =========================================================

        public async Task DeleteAsync(Project project)
        {
            _context.Projects.Remove(project);

            await _context.SaveChangesAsync();
        }

    public async Task<bool> HasTimelineConflictAsync(
    Guid projectId,
    DateTime startDate,
    DateTime deadline)
{
    return await _context.Sprints
        .AsNoTracking()
        .AnyAsync(s =>
            s.ProjectId == projectId &&
            !s.IsDeleted &&
            s.StartDate <= deadline &&
            s.EndDate >= startDate);
}

public async Task UpdateTimelineAsync(
    Project project)
{
    project.UpdatedAt = DateTime.UtcNow;

    _context.Projects.Update(project);

    await _context.SaveChangesAsync();
}

// =========================================================
// PM-004
// GET PROJECTS ASSIGNED TO MANAGER
// =========================================================

public async Task<List<Project>> GetByManagerAsync(
    Guid managerId)
{
    return await _context.Projects
        .AsNoTracking()
        .Include(p => p.Status)
        .Where(p => p.ManagerId == managerId)
        .OrderBy(p => p.Name)
        .ToListAsync();
}

        // =========================================================
        // GET STATUS
        // =========================================================

        public async Task<ProjectStatusDefinition?>
            GetStatusByIdAsync(Guid statusId)
        {
            return await _context.ProjectStatusDefinitions
                .AsNoTracking()
                .FirstOrDefaultAsync(s =>
                    s.Id == statusId &&
                    s.IsActive);
        }

        // =========================================================
        // GET ACTIVE STATUSES
        // =========================================================

        public async Task<List<ProjectStatusDefinition>>
            GetActiveStatusesAsync()
        {
            return await _context.ProjectStatusDefinitions
                .AsNoTracking()
                .Where(s => s.IsActive)
                .OrderBy(s => s.DisplayOrder)
                .ThenBy(s => s.Name)
                .ToListAsync();
        }
        // =========================================================
// PM-006
// CHECK DEADLINE CONFLICTS
// =========================================================

public async Task<bool> HasDeadlineConflictAsync(
    Guid projectId,
    DateTime deadline)
{
    // Check active/non-deleted sprints that extend
    // beyond the proposed project deadline.
    var sprintConflict = await _context.Sprints
        .AsNoTracking()
        .AnyAsync(s =>
            s.ProjectId == projectId &&
            !s.IsDeleted &&
            s.EndDate > deadline);

    if (sprintConflict)
    {
        return true;
    }

    return false;
}

// =========================================================
// PM-006
// UPDATE PROJECT DEADLINE
// =========================================================

public async Task UpdateDeadlineAsync(
    Project project)
{
    project.UpdatedAt = DateTime.UtcNow;

    _context.Projects.Update(project);

    await _context.SaveChangesAsync();
}

        // =========================================================
        // GET INITIAL STATUS
        // =========================================================

        public async Task<ProjectStatusDefinition?>
            GetInitialStatusAsync()
        {
            return await _context.ProjectStatusDefinitions
                .AsNoTracking()
                .Where(s =>
                    s.IsActive &&
                    s.IsInitialStatus)
                .OrderBy(s => s.DisplayOrder)
                .FirstOrDefaultAsync();
        }

        // =========================================================
        // CHECK STATUS TRANSITION
        // =========================================================

        public async Task<bool>
            IsStatusTransitionAllowedAsync(
                Guid fromStatusId,
                Guid toStatusId)
        {
            return await _context.ProjectStatusTransitions
                .AsNoTracking()
                .AnyAsync(t =>
                    t.FromStatusId == fromStatusId &&
                    t.ToStatusId == toStatusId &&
                    t.IsAllowed);
        }

        // =========================================================
        // GET ALLOWED NEXT STATUSES
        // =========================================================

        public async Task<List<ProjectStatusDefinition>>
            GetAllowedNextStatusesAsync(
                Guid currentStatusId)
        {
            return await _context.ProjectStatusTransitions
                .AsNoTracking()
                .Where(t =>
                    t.FromStatusId == currentStatusId &&
                    t.IsAllowed)
                .Include(t => t.ToStatus)
                .Where(t => t.ToStatus.IsActive)
                .Select(t => t.ToStatus)
                .OrderBy(s => s.DisplayOrder)
                .ThenBy(s => s.Name)
                .ToListAsync();
        }

        // =========================================================
        // GET ARCHIVED PROJECTS
        // =========================================================

        public async Task<List<Project>> GetArchivedAsync()
        {
            return await _context.Projects
                .AsNoTracking()
                .Include(p => p.Status)
                .Where(p => p.Status.IsArchivedStatus)
                .OrderByDescending(p => p.ArchivedAt)
                .ToListAsync();
        }

        // =========================================================
        // GET ACTIVE PROJECTS
        // =========================================================

        public async Task<List<Project>> GetActiveAsync()
        {
            return await _context.Projects
                .AsNoTracking()
                .Include(p => p.Status)
                .Where(p =>
                    !p.Status.IsArchivedStatus &&
                    !p.Status.IsCancelledStatus)
                .OrderBy(p => p.Name)
                .ToListAsync();
        }
        public async Task<ProjectStatusDefinition?> GetApprovedStatusAsync()
        {
    return await _context.ProjectStatusDefinitions
        .AsNoTracking()
        .FirstOrDefaultAsync(s =>
            s.IsActive &&
            s.IsApprovedStatus);
      }

      public async Task<ProjectStatusDefinition?> GetRejectedStatusAsync()
    {
    return await _context.ProjectStatusDefinitions
        .AsNoTracking()
        .FirstOrDefaultAsync(s =>
            s.IsActive &&
            s.IsRejectedStatus);
      }
      public async Task<ProjectStatusDefinition?> GetArchivedStatusAsync()
    {
        return await _context.ProjectStatusDefinitions
        .AsNoTracking()
        .FirstOrDefaultAsync(s =>
            s.IsActive &&
            s.IsArchivedStatus);
    }
    }
}