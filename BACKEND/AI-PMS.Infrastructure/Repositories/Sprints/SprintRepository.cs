using AI_PMS.Application.Interfaces.Sprints;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Sprints
{
    public class SprintRepository : ISprintRepository
    {
        private readonly ApplicationDbContext _context;

        public SprintRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Sprint> AddAsync(Sprint sprint)
        {
            _context.Sprints.Add(sprint);
            await _context.SaveChangesAsync();
            return sprint;
        }

        public async Task<List<Sprint>> GetAllAsync()
        {
            return await _context.Sprints
                .Where(s => !s.IsDeleted)
                .ToListAsync();
        }

        public async Task<Sprint?> GetByIdAsync(Guid id)
        {
            return await _context.Sprints
                .FirstOrDefaultAsync(s =>
                    s.Id == id &&
                    !s.IsDeleted);
        }

        public async Task<List<Sprint>> GetProjectSprintsAsync(Guid projectId)
        {
            return await _context.Sprints
                .Where(s =>
                    s.ProjectId == projectId &&
                    !s.IsDeleted)
                .ToListAsync();
        }

        public async Task<Sprint?> GetByNameAsync(
            Guid projectId,
            string name)
        {
            string normalizedName = name.Trim().ToLower();

            return await _context.Sprints
                .FirstOrDefaultAsync(s =>
                    s.ProjectId == projectId &&
                    !s.IsDeleted &&
                    s.Name.ToLower() == normalizedName);
        }

        public async Task UpdateAsync(Sprint sprint)
        {
            _context.Sprints.Update(sprint);
            await _context.SaveChangesAsync();
        }
    }
}