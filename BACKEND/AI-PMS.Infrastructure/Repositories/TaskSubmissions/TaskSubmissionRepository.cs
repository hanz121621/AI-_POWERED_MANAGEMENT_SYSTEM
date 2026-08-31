using AI_PMS.Application.Interfaces.Repositories.TaskSubmissions;
using AI_PMS.Domain.Entities.TaskSubmissions;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.TaskSubmissions
{
    public class TaskSubmissionRepository : ITaskSubmissionRepository
    {
        private readonly ApplicationDbContext _context;

        public TaskSubmissionRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE
        // =========================================================
        public async Task AddAsync(
            TaskSubmission submission)
        {
            await _context.TaskSubmissions.AddAsync(
                submission);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // GET BY ID
        // =========================================================
        public async Task<TaskSubmission?> GetByIdAsync(
            Guid id)
        {
            return await _context.TaskSubmissions
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        // =========================================================
        // GET LATEST SUBMISSION FOR TASK
        // =========================================================
        public async Task<TaskSubmission?>
            GetLatestByTaskIdAsync(Guid taskId)
        {
            return await _context.TaskSubmissions
                .Where(s => s.TaskId == taskId)
                .OrderByDescending(s => s.SubmittedAt)
                .FirstOrDefaultAsync();
        }

        // =========================================================
        // GET ALL SUBMISSIONS FOR TASK
        // =========================================================
        public async Task<List<TaskSubmission>>
            GetByTaskIdAsync(Guid taskId)
        {
            return await _context.TaskSubmissions
                .Where(s => s.TaskId == taskId)
                .OrderByDescending(s => s.SubmittedAt)
                .ToListAsync();
        }

        // =========================================================
        // UPDATE
        // =========================================================
        public async Task UpdateAsync(
            TaskSubmission submission)
        {
            _context.TaskSubmissions.Update(submission);

            await _context.SaveChangesAsync();
        }
    }
}