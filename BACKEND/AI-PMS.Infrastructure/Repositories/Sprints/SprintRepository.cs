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

        // =========================================================
        // CREATE
        // =========================================================

        public async Task<Sprint> AddAsync(Sprint sprint)
        {
            _context.Sprints.Add(sprint);

            await _context.SaveChangesAsync();

            return sprint;
        }

        // =========================================================
        // GET ALL
        // =========================================================

        public async Task<List<Sprint>> GetAllAsync()
        {
            return await _context.Sprints
                .Where(s => !s.IsDeleted)
                .ToListAsync();
        }

        // =========================================================
        // GET BY ID
        // =========================================================

        public async Task<Sprint?> GetByIdAsync(Guid id)
        {
            return await _context.Sprints
                .FirstOrDefaultAsync(s =>
                    s.Id == id &&
                    !s.IsDeleted);
        }

        // =========================================================
        // GET PROJECT SPRINTS
        // =========================================================

        public async Task<List<Sprint>> GetProjectSprintsAsync(
            Guid projectId)
        {
            return await _context.Sprints
                .Where(s =>
                    s.ProjectId == projectId &&
                    !s.IsDeleted)
                .ToListAsync();
        }

        // =========================================================
        // GET BY NAME
        // =========================================================

        public async Task<Sprint?> GetByNameAsync(
            Guid projectId,
            string name)
        {
            string normalizedName =
                name.Trim().ToLower();

            return await _context.Sprints
                .FirstOrDefaultAsync(s =>
                    s.ProjectId == projectId &&
                    !s.IsDeleted &&
                    s.Name.ToLower() == normalizedName);
        }

        // =========================================================
        // UPDATE
        // =========================================================

        public async Task UpdateAsync(Sprint sprint)
        {
            _context.Sprints.Update(sprint);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // SPRINT-003
        // ASSIGN TEAM
        // =========================================================

        public async Task AssignTeamAsync(
            Sprint sprint)
        {
            _context.Sprints.Update(sprint);

            await _context.SaveChangesAsync();
        }
    }
}