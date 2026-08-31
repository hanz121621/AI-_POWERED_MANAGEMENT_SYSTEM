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

    // 5. If a contributor was selected,
    //    verify that the user is an active contributor
    if (dto.AssignedContributorSDId.HasValue)
    {
        var contributor =
            await _userRepository.GetByIdAsync(
                dto.AssignedContributorSDId.Value);

        if (contributor == null)
        {
            throw new InvalidOperationException(
                "contributor not found.");
        }

        if (contributor.Role != Role.Contributor)
        {
            throw new InvalidOperationException(
                "The selected user must have the contributor role.");
        }

        if (!contributor.IsActive)
        {
            throw new InvalidOperationException(
                "The selected contributor is inactive.");
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

        AssignedContributorSDId =
            dto.AssignedContributorSDId,

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
// GET MY WORK
// Current logged-in Contributor
// =========================================================
public async Task<IEnumerable<TaskDto>> GetMyWorkAsync(
    Guid contributorSDId)
{
    var contributor =
        await _userRepository.GetByIdAsync(contributorSDId);

    if (contributor == null)
    {
        throw new InvalidOperationException(
            "Contributor not found.");
    }

    if (contributor.Role != Role.Contributor)
    {
        throw new InvalidOperationException(
            "Only Contributors can access My Work.");
    }

    if (!contributor.IsActive)
    {
        throw new InvalidOperationException(
            "Contributor account is inactive.");
    }

    var tasks =
        await _taskRepository
            .GetContributorSDTasksAsync(contributorSDId);

    return tasks.Select(MapToDto);
}                       
// =========================================================
// GET MY SPRINT TASKS
// Developer / Staff
// =========================================================
public async Task<object?> GetMySprintTasksAsync(
    Guid userId,
    Guid sprintId)
{
    // Verify user
    var user = await _userRepository.GetByIdAsync(userId);

    if (user == null || !user.IsActive)
        return null;

    // Get sprint
    var sprint = await _sprintRepository.GetByIdAsync(sprintId);

    if (sprint == null)
        return null;

    // Get tasks belonging to sprint
    var tasks = await _taskRepository.GetSprintTasksAsync(sprintId);

    // Only tasks assigned to the logged-in contributor
    var myTasks = tasks
        .Where(t => t.AssignedContributorSDId == userId)
        .Select(MapToDto)
        .ToList();

    return new
    {
        Sprint = sprint,
        Tasks = myTasks,
        TaskCount = myTasks.Count
    };
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
        // GET TASKS BY contributor
        // =========================================================
        public async Task<IEnumerable<TaskDto>> GetContributorSDTasksAsync(
            Guid contributorSDId)
        {
            var tasks =
                await _taskRepository
                    .GetContributorSDTasksAsync(contributorSDId);

            return tasks.Select(MapToDto);
        }

          // =========================================================
// GET CONTRIBUTORS AVAILABLE FOR TASK ASSIGNMENT
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
            // Validate contributor
            // -----------------------------------------------------
            if (dto.AssignedContributorSDId.HasValue)
            {
                var contributor =
                    await _userRepository.GetByIdAsync(
                        dto.AssignedContributorSDId.Value);

                if (contributor == null)
                {
                    return (
                        null,
                        "Assigned contributor not found."
                    );
                }

                if (contributor.Role != Domain.Enums.Role.Contributor)
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
                task.AssignedContributorSDId !=
                dto.AssignedContributorSDId;

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
            task.AssignedContributorSDId =
                dto.AssignedContributorSDId;
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
// UPDATE MY TASK STATUS
// Developer / Staff Contributor
// =========================================================
public async Task<(TaskDto? Task, string Message)>
    UpdateMyTaskStatusAsync(
        Guid userId,
        Guid taskId,
        UpdateTaskStatusDto dto)
{
    // ---------------------------------------------------------
    // 1. Verify logged-in user
    // ---------------------------------------------------------
    var contributor =
        await _userRepository.GetByIdAsync(userId);

    if (contributor == null)
    {
        return (
            null,
            "Contributor not found."
        );
    }

    // ---------------------------------------------------------
    // 2. Must be Contributor
    // ---------------------------------------------------------
    if (contributor.Role != Role.Contributor)
    {
        return (
            null,
            "Only Contributors can update task status."
        );
    }

    // ---------------------------------------------------------
    // 3. Contributor must be active
    // ---------------------------------------------------------
    if (!contributor.IsActive)
    {
        return (
            null,
            "Contributor account is inactive."
        );
    }

    // ---------------------------------------------------------
    // 4. Find task
    // ---------------------------------------------------------
    var task =
        await _taskRepository.GetByIdAsync(taskId);

    if (task == null)
    {
        return (
            null,
            "Task not found."
        );
    }

    // ---------------------------------------------------------
    // 5. Verify task is assigned to this contributor
    // ---------------------------------------------------------
    if (task.AssignedContributorSDId != userId)
    {
        return (
            null,
            "You cannot update this task."
        );
    }

    // ---------------------------------------------------------
    // 6. Completed tasks cannot be modified
    // ---------------------------------------------------------
    if (task.Status == ProjectTaskStatus.Completed)
    {
        return (
            null,
            "This task cannot be modified."
        );
    }

    // ---------------------------------------------------------
    // 7. Validate status value
    // ---------------------------------------------------------
    if (!Enum.IsDefined(
        typeof(ProjectTaskStatus),
        dto.Status))
    {
        return (
            null,
            "Invalid task status."
        );
    }

    // ---------------------------------------------------------
    // 8. Check whether anything changed
    // ---------------------------------------------------------
    if (task.Status == dto.Status)
    {
        return (
            MapToDto(task),
            "The task already has this status."
        );
    }

    // ---------------------------------------------------------
    // 9. Validate status transition
    // ---------------------------------------------------------
    bool validTransition =
        IsValidStatusTransition(
            task.Status,
            dto.Status);

    if (!validTransition)
    {
        return (
            null,
            "This status change is not allowed."
        );
    }

    // ---------------------------------------------------------
    // 10. Update status
    // ---------------------------------------------------------
    task.Status = dto.Status;

    // ---------------------------------------------------------
    // 11. Update timestamp
    // ---------------------------------------------------------
    task.UpdatedAt = DateTime.UtcNow;

    // ---------------------------------------------------------
    // 12. Save
    // ---------------------------------------------------------
    await _taskRepository.UpdateAsync(task);

    // ---------------------------------------------------------
    // 13. Return updated task
    // ---------------------------------------------------------
    return (
        MapToDto(task),
        "Task status updated successfully."
    );
}

// =========================================================
// VALIDATE TASK STATUS TRANSITION
// =========================================================
private static bool IsValidStatusTransition(
    ProjectTaskStatus currentStatus,
    ProjectTaskStatus newStatus)
{
    return currentStatus switch
    {
        ProjectTaskStatus.Todo =>
            newStatus == ProjectTaskStatus.InProgress ||
            newStatus == ProjectTaskStatus.Blocked,

        ProjectTaskStatus.InProgress =>
            newStatus == ProjectTaskStatus.InReview ||
            newStatus == ProjectTaskStatus.Blocked ||
            newStatus == ProjectTaskStatus.Todo,

        ProjectTaskStatus.InReview =>
            newStatus == ProjectTaskStatus.Completed ||
            newStatus == ProjectTaskStatus.InProgress ||
            newStatus == ProjectTaskStatus.Blocked,

        ProjectTaskStatus.Blocked =>
            newStatus == ProjectTaskStatus.InProgress ||
            newStatus == ProjectTaskStatus.Todo,

        ProjectTaskStatus.Completed =>
            false,

        _ => false
    };
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

        AssignedContributorSDId =
            task.AssignedContributorSDId,

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



