using AI_PMS.Application.DTOs.Tasks;
using AI_PMS.Application.DTOs.Users;

using AI_PMS.Application.Interfaces.Tasks;
using AI_PMS.Application.Interfaces.Sprints;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Users;

using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Tasks
{
    public class TaskService : ITaskService
    {private readonly ITaskRepository _taskRepository;
private readonly ISprintRepository _sprintRepository;
private readonly IUserRepository _userRepository;

     public TaskService(
    ITaskRepository taskRepository,
    ISprintRepository sprintRepository,
    IUserRepository userRepository)
{
    _taskRepository = taskRepository;
    _sprintRepository = sprintRepository;
    _userRepository = userRepository;
}

        // =========================================================
        // CREATE TASK
        // =========================================================
        public async Task<bool> CreateTaskAsync(
    Guid managerId,
    CreateTaskDto dto)
{
    // 1. Verify the logged-in user exists
    var manager =
        await _userRepository.GetByIdAsync(managerId);

    if (manager == null)
    {
        throw new InvalidOperationException(
            "Manager not found.");
    }

    // 2. User must actually be a Manager
    if (manager.Role != Role.Manager)
    {
        throw new InvalidOperationException(
            "Only a Manager can create tasks.");
    }

    // 3. Manager must be active
    if (!manager.IsActive)
    {
        throw new InvalidOperationException(
            "The Manager account is inactive.");
    }

    // 4. Check Sprint
    var sprint =
        await _sprintRepository.GetByIdAsync(dto.SprintId);

    if (sprint == null)
    {
        return false;
    }

    // 5. If a developer was selected,
    //    verify that the user is an active Developer
    if (dto.AssignedDeveloperId.HasValue)
    {
        var developer =
            await _userRepository.GetByIdAsync(
                dto.AssignedDeveloperId.Value);

        if (developer == null)
        {
            throw new InvalidOperationException(
                "Developer not found.");
        }

        if (developer.Role != Role.Contributor)
        {
            throw new InvalidOperationException(
                "The selected user must have the Developer role.");
        }

        if (!developer.IsActive)
        {
            throw new InvalidOperationException(
                "The selected Developer is inactive.");
        }
    }

    // 6. Check duplicate task title in the same sprint
    var existingTask =
        await _taskRepository.GetByTitleAsync(
            dto.SprintId,
            dto.Title);

    if (existingTask != null)
    {
        throw new InvalidOperationException(
            "A task with this title already exists in this sprint.");
    }

    // 7. Create task
    var task = new TaskItem
    {
        Id = Guid.NewGuid(),

        SprintId = dto.SprintId,

        Title = dto.Title.Trim(),

        Description = dto.Description,

        AssignedDeveloperId =
            dto.AssignedDeveloperId,

        Priority = dto.Priority,

        Status = ProjectTaskStatus.Todo,

        EstimatedHours = dto.EstimatedHours,

        ActualHours = 0,

        DueDate = dto.DueDate,

        CreatedBy = managerId,

        CreatedAt = DateTime.UtcNow
    };

    await _taskRepository.AddAsync(task);

    return true;
}

        // =========================================================
        // GET ALL TASKS
        // =========================================================
        public async Task<IEnumerable<TaskDto>> GetAllTasksAsync()
        {
            var tasks =
                await _taskRepository.GetAllAsync();

            return tasks.Select(MapToDto);
        }

        // =========================================================
        // GET TASK BY ID
        // =========================================================
        public async Task<TaskDto?> GetTaskByIdAsync(Guid id)
        {
            var task =
                await _taskRepository.GetByIdAsync(id);

            if (task == null)
                return null;

            return MapToDto(task);
        }

        // =========================================================
        // GET TASKS BY SPRINT
        // =========================================================
        public async Task<IEnumerable<TaskDto>> GetSprintTasksAsync(
            Guid sprintId)
        {
            var tasks =
                await _taskRepository
                    .GetSprintTasksAsync(sprintId);

            return tasks.Select(MapToDto);
        }

        // =========================================================
        // GET TASKS BY DEVELOPER
        // =========================================================
        public async Task<IEnumerable<TaskDto>> GetDeveloperTasksAsync(
            Guid developerId)
        {
            var tasks =
                await _taskRepository
                    .GetDeveloperTasksAsync(developerId);

            return tasks.Select(MapToDto);
        }

          // =========================================================
// GET USERS AVAILABLE FOR TASK ASSIGNMENT
// =========================================================
public async Task<IEnumerable<UserDto>> GetAssignableUsersAsync()
{
    var users = await _userRepository.GetAllAsync();

    return users
        .Where(u =>
            u.Role == Role.Contributor &&
            u.IsActive)
        .Select(u => new UserDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            Role = u.Role,
            IsActive = u.IsActive,
            PhoneNumber = u.PhoneNumber,
            ProfileImage = u.ProfileImage,
            Bio = u.Bio,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        });
}
        // =========================================================
        // UPDATE TASK
        // =========================================================
        public async Task<(TaskDto? Task, string Message)>
            UpdateTaskAsync(
                Guid id,
                UpdateTaskDto dto)
        {
            // -----------------------------------------------------
            // Find existing task
            // -----------------------------------------------------
            var task =
                await _taskRepository.GetByIdAsync(id);

            if (task == null)
            {
                return (
                    null,
                    "Task not found."
                );
            }

            // -----------------------------------------------------
            // Find Sprint
            // -----------------------------------------------------
            var sprint =
                await _sprintRepository
                    .GetByIdAsync(task.SprintId);

            if (sprint == null)
            {
                return (
                    null,
                    "Sprint not found."
                );
            }

            // -----------------------------------------------------
            // Validate title
            // -----------------------------------------------------
            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return (
                    null,
                    "Task title is required."
                );
            }

            // -----------------------------------------------------
            // Validate hours
            // -----------------------------------------------------
            if (dto.EstimatedHours < 0)
            {
                return (
                    null,
                    "Estimated hours cannot be negative."
                );
            }

            if (dto.ActualHours < 0)
            {
                return (
                    null,
                    "Actual hours cannot be negative."
                );
            }

            // -----------------------------------------------------
            // Actual hours cannot exceed estimated hours
            // -----------------------------------------------------
            if (dto.ActualHours > dto.EstimatedHours)
            {
                return (
                    null,
                    "Actual hours cannot be greater than estimated hours."
                );
            }

            // -----------------------------------------------------
            // Validate due date against Sprint
            // -----------------------------------------------------
            if (dto.DueDate < sprint.StartDate)
            {
                return (
                    null,
                    "Task due date cannot be earlier than the sprint start date."
                );
            }

            if (dto.DueDate > sprint.EndDate)
            {
                return (
                    null,
                    "Task due date cannot be later than the sprint end date."
                );
            }

            // -----------------------------------------------------
            // Validate developer
            // -----------------------------------------------------
            if (dto.AssignedDeveloperId.HasValue)
            {
                var developer =
                    await _userRepository.GetByIdAsync(
                        dto.AssignedDeveloperId.Value);

                if (developer == null)
                {
                    return (
                        null,
                        "Assigned developer not found."
                    );
                }

                if (developer.Role != Domain.Enums.Role.Contributor)
                {
                    return (
                        null,
                        "The assigned user must be a contributor."
                    );
                }
            }

            // -----------------------------------------------------
            // Normalize values
            // -----------------------------------------------------
            string newTitle =
                dto.Title.Trim();

            string newDescription =
                dto.Description?.Trim() ?? string.Empty;

            // -----------------------------------------------------
            // Duplicate title inside same Sprint
            // -----------------------------------------------------
            var existingTask =
                await _taskRepository.GetByTitleAsync(
                    task.SprintId,
                    newTitle);

            if (existingTask != null &&
                existingTask.Id != id)
            {
                return (
                    null,
                    "A task with this title already exists in this sprint."
                );
            }

            // -----------------------------------------------------
            // CHECK ACTUAL CHANGES
            // -----------------------------------------------------
            bool titleChanged =
                !string.Equals(
                    task.Title.Trim(),
                    newTitle,
                    StringComparison.OrdinalIgnoreCase);

            bool descriptionChanged =
                !string.Equals(
                    task.Description?.Trim() ?? string.Empty,
                    newDescription,
                    StringComparison.Ordinal);

            bool developerChanged =
                task.AssignedDeveloperId !=
                dto.AssignedDeveloperId;

            bool priorityChanged =
                task.Priority != dto.Priority;

            bool statusChanged =
                task.Status != dto.Status;

            bool estimatedHoursChanged =
                task.EstimatedHours != dto.EstimatedHours;

            bool actualHoursChanged =
                task.ActualHours != dto.ActualHours;

            bool dueDateChanged =
                task.DueDate != dto.DueDate;

            bool anythingChanged =
                titleChanged ||
                descriptionChanged ||
                developerChanged ||
                priorityChanged ||
                statusChanged ||
                estimatedHoursChanged ||
                actualHoursChanged ||
                dueDateChanged;

            // -----------------------------------------------------
            // NOTHING CHANGED
            // -----------------------------------------------------
            if (!anythingChanged)
            {
                return (
                    MapToDto(task),
                    "No changes were made. The task already contains these values."
                );
            }

            // -----------------------------------------------------
            // UPDATE
            // -----------------------------------------------------
            task.Title = newTitle;
            task.Description = newDescription;
            task.AssignedDeveloperId =
                dto.AssignedDeveloperId;
            task.Priority = dto.Priority;
            task.Status = dto.Status;
            task.EstimatedHours =
                dto.EstimatedHours;
            task.ActualHours =
                dto.ActualHours;
            task.DueDate =
                dto.DueDate;

            // Only update timestamp when something changed
            task.UpdatedAt = DateTime.UtcNow;

            await _taskRepository.UpdateAsync(task);

            return (
                MapToDto(task),
                "Task updated successfully."
            );
        }

        // =========================================================
        // DELETE TASK
        // =========================================================
        public async Task<bool> DeleteTaskAsync(Guid id)
        {
            var task =
                await _taskRepository.GetByIdAsync(id);

            if (task == null)
                return false;

            await _taskRepository.DeleteAsync(task);

            return true;
        }

        // =========================================================
        // ENTITY -> DTO
        // =========================================================
       private static TaskDto MapToDto(TaskItem task)
    {
    return new TaskDto
    {
        Id = task.Id,
        SprintId = task.SprintId,
        Title = task.Title,
        Description = task.Description,

        CreatedBy = task.CreatedBy,

        AssignedDeveloperId =
            task.AssignedDeveloperId,

        Priority = task.Priority,
        Status = task.Status,
        EstimatedHours = task.EstimatedHours,
        ActualHours = task.ActualHours,
        DueDate = task.DueDate,
        CreatedAt = task.CreatedAt,
        UpdatedAt = task.UpdatedAt
    };
          }
        
    }
}
