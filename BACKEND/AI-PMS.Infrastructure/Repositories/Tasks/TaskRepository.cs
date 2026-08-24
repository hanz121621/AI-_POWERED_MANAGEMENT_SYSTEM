

using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Tasks
{
    public class TaskRepository : ITaskRepository
    {
        private readonly ApplicationDbContext _context;

        public TaskRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Create Task
        public async Task AddAsync(TaskItem task)
        {
            await _context.Tasks.AddAsync(task);
            await _context.SaveChangesAsync();
        }

        // Get Task By Id
        public async Task<TaskItem?> GetByIdAsync(Guid id)
        {
            return await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        // Get Task By Title
      // Find task by title inside the same sprint
public async Task<TaskItem?> GetByTitleAsync(
    Guid sprintId,
    string title)
{
    string normalizedTitle =
        title.Trim().ToLower();

    return await _context.Tasks
        .FirstOrDefaultAsync(t =>
            t.SprintId == sprintId &&
            t.Title.ToLower() == normalizedTitle);
}

        // Get All Tasks
        public async Task<List<TaskItem>> GetAllAsync()
        {
            return await _context.Tasks
                .ToListAsync();
        }

        // Get Tasks By Sprint
        public async Task<List<TaskItem>> GetSprintTasksAsync(Guid sprintId)
        {
            return await _context.Tasks
                .Where(t => t.SprintId == sprintId)
                .ToListAsync();
        }

        // Get Tasks By Developer
        public async Task<List<TaskItem>> GetDeveloperTasksAsync(Guid developerId)
        {
            return await _context.Tasks
                .Where(t => t.AssignedDeveloperId == developerId)
                .ToListAsync();
        }

        // Update Task
        public async Task UpdateAsync(TaskItem task)
        {
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
        }

        // Delete Task
        public async Task DeleteAsync(TaskItem task)
        {
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }
    }
}