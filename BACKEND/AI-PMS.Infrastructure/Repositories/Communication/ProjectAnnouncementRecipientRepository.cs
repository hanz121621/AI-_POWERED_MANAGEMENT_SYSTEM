
using AI_PMS.Application.Interfaces.Repositories.Communication;
using AI_PMS.Domain.Entities.Communication;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Communication
{
    public class ProjectAnnouncementRecipientRepository
        : IProjectAnnouncementRecipientRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectAnnouncementRecipientRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE RECIPIENTS
        // =========================================================

        public async Task AddRangeAsync(
            IEnumerable<ProjectAnnouncementRecipient> recipients)
        {
            await _context.ProjectAnnouncementRecipients
                .AddRangeAsync(recipients);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // GET RECIPIENTS BY ANNOUNCEMENT
        // =========================================================

        public async Task<List<ProjectAnnouncementRecipient>>
            GetByAnnouncementIdAsync(
                Guid announcementId)
        {
            return await _context.ProjectAnnouncementRecipients
                .Where(r =>
                    r.AnnouncementId == announcementId)
                .OrderBy(r => r.CreatedAt)
                .ToListAsync();
        }
    }
}
