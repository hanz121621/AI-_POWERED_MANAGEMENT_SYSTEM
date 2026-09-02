using AI_PMS.Application.Interfaces.Repositories.TaskComments;
using AI_PMS.Domain.Entities.TaskComments;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.TaskComments
{
    public class TaskCommentRepository : ITaskCommentRepository
    {
        private readonly ApplicationDbContext _context;

        public TaskCommentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE COMMENT
        // =========================================================
        public async Task AddAsync(TaskComment comment)
        {
            await _context.TaskComments.AddAsync(comment);
            await _context.SaveChangesAsync();
        }

        // =========================================================
        // GET COMMENT BY ID
        // =========================================================
        public async Task<TaskComment?> GetByIdAsync(Guid id)
        {
            return await _context.TaskComments
                .FirstOrDefaultAsync(c =>
                    c.Id == id &&
                    !c.IsDeleted);
        }

        // =========================================================
        // GET COMMENTS BY TASK
        // =========================================================
        public async Task<List<TaskComment>> GetByTaskIdAsync(
            Guid taskId)
        {
            return await _context.TaskComments
                .Where(c =>
                    c.TaskId == taskId &&
                    !c.IsDeleted)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // UPDATE COMMENT
        // =========================================================
        public async Task UpdateAsync(TaskComment comment)
        {
            _context.TaskComments.Update(comment);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // SOFT DELETE
        // =========================================================
        public async Task SoftDeleteAsync(TaskComment comment)
        {
            comment.IsDeleted = true;
            comment.DeletedAt = DateTime.UtcNow;
            comment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            
        }
        
    }
}