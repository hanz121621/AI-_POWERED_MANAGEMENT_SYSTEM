
using AI_PMS.Application.Interfaces.Repositories.Communication;
using AI_PMS.Domain.Entities.Communication;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Communication
{
    public class ProjectAnnouncementRepository
        : IProjectAnnouncementRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectAnnouncementRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE
        // =========================================================

        public async Task AddAsync(
            ProjectAnnouncement announcement)
        {
            await _context.ProjectAnnouncements
                .AddAsync(announcement);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // GET BY ID
        // =========================================================

        public async Task<ProjectAnnouncement?> GetByIdAsync(
            Guid id)
        {
            return await _context.ProjectAnnouncements
                .Include(a => a.Recipients)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        // =========================================================
        // GET BY PROJECT
        // =========================================================

        public async Task<List<ProjectAnnouncement>>
            GetByProjectAsync(Guid projectId)
        {
            return await _context.ProjectAnnouncements
                .Include(a => a.Recipients)
                .Where(a => a.ProjectId == projectId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }
    }
}
