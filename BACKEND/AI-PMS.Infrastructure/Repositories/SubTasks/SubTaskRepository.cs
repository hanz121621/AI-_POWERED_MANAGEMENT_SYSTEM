using AI_PMS.Application.Interfaces.Repositories.SubTasks;
using AI_PMS.Domain.Entities.SubTasks;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.SubTasks
{
    public class SubTaskRepository : ISubTaskRepository
    {
        private readonly ApplicationDbContext _context;

        public SubTaskRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE SUBTASK
        // =========================================================

        public async Task AddAsync(SubTask subTask)
        {
            await _context.SubTasks.AddAsync(subTask);
            await _context.SaveChangesAsync();
        }

        // =========================================================
        // GET SUBTASK BY ID
        // =========================================================

        public async Task<SubTask?> GetByIdAsync(Guid id)
        {
            return await _context.SubTasks
                .FirstOrDefaultAsync(s =>
                    s.Id == id &&
                    !s.IsDeleted);
        }

        // =========================================================
        // GET SUBTASK BY TITLE
        // =========================================================

        public async Task<SubTask?> GetByTitleAsync(
            Guid taskId,
            string title)
        {
            string normalizedTitle =
                title.Trim().ToLower();

            return await _context.SubTasks
                .FirstOrDefaultAsync(s =>
                    s.TaskId == taskId &&
                    !s.IsDeleted &&
                    s.Title.ToLower() == normalizedTitle);
        }

        // =========================================================
        // GET ALL SUBTASKS
        // =========================================================

        public async Task<List<SubTask>> GetAllAsync()
        {
            return await _context.SubTasks
                .Where(s => !s.IsDeleted)
                .OrderBy(s => s.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // GET SUBTASKS BY TASK
        // =========================================================

        public async Task<List<SubTask>> GetByTaskIdAsync(
            Guid taskId)
        {
            return await _context.SubTasks
                .Where(s =>
                    s.TaskId == taskId &&
                    !s.IsDeleted)
                .OrderBy(s => s.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // UPDATE SUBTASK
        // =========================================================

        public async Task UpdateAsync(SubTask subTask)
        {
            _context.SubTasks.Update(subTask);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // SOFT DELETE
        // =========================================================

        public async Task SoftDeleteAsync(SubTask subTask)
        {
            subTask.IsDeleted = true;
            subTask.DeletedAt = DateTime.UtcNow;
            subTask.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }
}