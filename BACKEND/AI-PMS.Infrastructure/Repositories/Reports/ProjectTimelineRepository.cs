using AI_PMS.Application.Interfaces.Repositories.Reports;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Reports
{
public class ProjectTimelineRepository
: IProjectTimelineRepository
{
private readonly ApplicationDbContext _context;


    public ProjectTimelineRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET AUTHORIZED PROJECT
    // =========================================================

    public async Task<Project?> GetAuthorizedProjectAsync(
        Guid projectId,
        Guid managerId)
    {
        return await _context.Projects
            .AsNoTracking()
            .FirstOrDefaultAsync(p =>
                p.Id == projectId &&
                p.ManagerId == managerId);
    }

    // =========================================================
    // GET PROJECT SPRINTS
    // =========================================================

    public async Task<List<Sprint>> GetProjectSprintsAsync(
        Guid projectId)
    {
        return await _context.Sprints
            .AsNoTracking()
            .Where(s =>
                s.ProjectId == projectId &&
                !s.IsDeleted)
            .OrderBy(s => s.StartDate)
            .ToListAsync();
    }

    // =========================================================
    // GET PROJECT TASKS
    //
    // TaskItem -> Sprint -> Project
    // =========================================================

    public async Task<List<TaskItem>> GetProjectTasksAsync(
        Guid projectId)
    {
        return await _context.Tasks
            .AsNoTracking()
            .Where(t =>
                _context.Sprints.Any(s =>
                    s.Id == t.SprintId &&
                    s.ProjectId == projectId &&
                    !s.IsDeleted))
            .OrderBy(t => t.DueDate)
            .ToListAsync();
    }
}
}

