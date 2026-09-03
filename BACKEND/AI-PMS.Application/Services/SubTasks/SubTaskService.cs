using AI_PMS.Application.DTOs.SubTasks;
using AI_PMS.Application.Interfaces.Repositories.SubTasks;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.SubTasks;
using AI_PMS.Domain.Entities.SubTasks;
using AI_PMS.Domain.Enums;
using AI_PMS.Application.Interfaces.Repositories.Users;

namespace AI_PMS.Application.Services
{
    public class SubTaskService : ISubTaskService
    {
  private readonly ISubTaskRepository _subTaskRepository;
private readonly ITaskRepository _taskRepository;
private readonly IUserRepository _userRepository;

        public SubTaskService(
    ISubTaskRepository subTaskRepository,
    ITaskRepository taskRepository,
    IUserRepository userRepository)
{
    _subTaskRepository = subTaskRepository;
    _taskRepository = taskRepository;
    _userRepository = userRepository;
}

        // =========================================================
        // CREATE SUBTASK
        // =========================================================

        public async Task<SubTaskUpdateResult> CreateSubTaskAsync(
            CreateSubTaskDto dto)
        {
            if (dto.TaskId == Guid.Empty)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message = "Task is required."
                };
            }

            var task =
                await _taskRepository.GetByIdAsync(dto.TaskId);

            if (task == null || task.IsDeleted)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message = "Task not found."
                };
            }

            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message = "Subtask title is required."
                };
            }

            if (dto.EstimatedHours < 0)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message = "Estimated hours cannot be negative."
                };
            }

            var title = dto.Title.Trim();

            var existingSubTask =
                await _subTaskRepository.GetByTitleAsync(
                    dto.TaskId,
                    title);

            if (existingSubTask != null &&
                !existingSubTask.IsDeleted)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message =
                        "A subtask with this title already exists in this task."
                };
            }









            var subTask = new SubTask
            {
                Id = Guid.NewGuid(),

                TaskId = dto.TaskId,

                Title = title,

                Description =
                    dto.Description?.Trim()
                    ?? string.Empty,

                EstimatedHours =
                    dto.EstimatedHours,

                IsAIGenerated =
                    dto.IsAIGenerated,
                    Status = ProjectTaskStatus.Todo,

                Progress = 0,

                IsApproved = false,

                IsDeleted = false,

                CreatedAt = DateTime.UtcNow
            };

            await _subTaskRepository.AddAsync(subTask);

            return new SubTaskUpdateResult
            {
                Success = true,

                Message = "Subtask created successfully.",

                SubTask = MapToDto(subTask)
            };
        }

        // =========================================================
        // GET ALL
        // =========================================================

        public async Task<IEnumerable<SubTaskDto>>
            GetAllSubTasksAsync()
        {
            var subtasks =
                await _subTaskRepository.GetAllAsync();

            return subtasks
                .Where(x => !x.IsDeleted)
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // GET BY ID
        // =========================================================

        public async Task<SubTaskDto?>
            GetSubTaskByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                return null;
            }

            var subTask =
                await _subTaskRepository.GetByIdAsync(id);

            if (subTask == null ||
                subTask.IsDeleted)
            {
                return null;
            }

            return MapToDto(subTask);
        }

        // =========================================================
        // GET BY PARENT TASK
        // =========================================================

        public async Task<IEnumerable<SubTaskDto>>
            GetTaskSubTasksAsync(Guid taskId)
        {
            if (taskId == Guid.Empty)
            {
                return Enumerable.Empty<SubTaskDto>();
            }

            var task =
                await _taskRepository.GetByIdAsync(taskId);

            if (task == null ||
                task.IsDeleted)
            {
                return Enumerable.Empty<SubTaskDto>();
            }

            var subtasks =
                await _subTaskRepository.GetByTaskIdAsync(taskId);

            return subtasks
                .Where(x => !x.IsDeleted)
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // UPDATE
        // =========================================================

        public async Task<SubTaskUpdateResult>
            UpdateSubTaskAsync(
                Guid id,
                UpdateSubTaskDto dto)
        {
            var subTask =
                await _subTaskRepository.GetByIdAsync(id);

            if (subTask == null ||
                subTask.IsDeleted)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message = "Subtask not found."
                };
            }

            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message = "Subtask title is required.",
                    SubTask = MapToDto(subTask)
                };
            }

            if (dto.EstimatedHours < 0)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message =
                        "Estimated hours cannot be negative.",
                    SubTask = MapToDto(subTask)
                };
            }

            var title = dto.Title.Trim();

            var existingSubTask =
                await _subTaskRepository.GetByTitleAsync(
                    subTask.TaskId,
                    title);

            if (existingSubTask != null &&
                existingSubTask.Id != subTask.Id &&
                !existingSubTask.IsDeleted)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message =
                        "A subtask with this title already exists in this task.",
                    SubTask = MapToDto(subTask)
                };
            }

            subTask.Title = title;

            subTask.Description =
                dto.Description?.Trim()
                ?? string.Empty;

            subTask.EstimatedHours =
                dto.EstimatedHours;

            subTask.UpdatedAt =
                DateTime.UtcNow;

            await _subTaskRepository.UpdateAsync(subTask);

            return new SubTaskUpdateResult
            {
                Success = true,

                Message = "Subtask updated successfully.",

                SubTask = MapToDto(subTask)
            };
        }

        // =========================================================
        // DELETE
        // =========================================================

        public async Task<(bool Success, string Message)>
            DeleteSubTaskAsync(Guid id)
        {
            var subTask =
                await _subTaskRepository.GetByIdAsync(id);

            if (subTask == null ||
                subTask.IsDeleted)
            {
                return (
                    false,
                    "Subtask not found."
                );
            }

            subTask.IsDeleted = true;

            subTask.DeletedAt =
                DateTime.UtcNow;

            subTask.UpdatedAt =
                DateTime.UtcNow;

            await _subTaskRepository.SoftDeleteAsync(subTask);

            return (
                true,
                "Subtask deleted successfully."
            );
        }
                             // =========================================================
// CHECK CONTRIBUTOR ACCESS TO SUBTASK
// =========================================================

public async Task<bool> CanContributorAccessSubTaskAsync(
    Guid userId,
    Guid subTaskId)
{
    if (userId == Guid.Empty || subTaskId == Guid.Empty)
        return false;

    var contributor =
        await _userRepository.GetByIdAsync(userId);

    if (contributor == null ||
        contributor.Role != Role.Contributor ||
        !contributor.IsActive)
    {
        return false;
    }

    var subTask =
        await _subTaskRepository.GetByIdAsync(subTaskId);

    if (subTask == null ||
        subTask.IsDeleted)
    {
        return false;
    }

    var task =
        await _taskRepository.GetByIdAsync(subTask.TaskId);

    if (task == null ||
        task.IsDeleted)
    {
        return false;
    }

    return task.AssignedContributorSDId == userId;
}


// =========================================================
// GET MY TASK SUBTASKS
// Contributor only
// =========================================================

public async Task<(
    IEnumerable<SubTaskDto> SubTasks,
    bool Success,
    string Message
)> GetMyTaskSubTasksAsync(
    Guid userId,
    Guid taskId)
{
    if (userId == Guid.Empty)
    {
        return (
            Enumerable.Empty<SubTaskDto>(),
            false,
            "Invalid contributor."
        );
    }

    if (taskId == Guid.Empty)
    {
        return (
            Enumerable.Empty<SubTaskDto>(),
            false,
            "Task not found."
        );
    }

    var contributor =
        await _userRepository.GetByIdAsync(userId);

    if (contributor == null)
    {
        return (
            Enumerable.Empty<SubTaskDto>(),
            false,
            "Contributor not found."
        );
    }

    if (contributor.Role != Role.Contributor)
    {
        return (
            Enumerable.Empty<SubTaskDto>(),
            false,
            "Only Contributors can access their subtasks."
        );
    }

    if (!contributor.IsActive)
    {
        return (
            Enumerable.Empty<SubTaskDto>(),
            false,
            "Contributor account is inactive."
        );
    }

    var task =
        await _taskRepository.GetByIdAsync(taskId);

    if (task == null ||
        task.IsDeleted)
    {
        return (
            Enumerable.Empty<SubTaskDto>(),
            false,
            "Task not found."
        );
    }

    if (task.AssignedContributorSDId != userId)
    {
        return (
            Enumerable.Empty<SubTaskDto>(),
            false,
            "You cannot access this task."
        );
    }

    var subtasks =
        await _subTaskRepository.GetByTaskIdAsync(taskId);

    var result =
        subtasks
            .Where(x => !x.IsDeleted)
            .Select(MapToDto)
            .ToList();

    return (
        result,
        true,
        "Subtasks retrieved successfully."
    );
}


// =========================================================
// UPDATE MY AI SUBTASK STATUS / PROGRESS
// Contributor only
// =========================================================

public async Task<(SubTaskDto? SubTask, string Message)>
    UpdateMyAISubTaskStatusAsync(
        Guid userId,
        Guid subTaskId,
        UpdateAISubTaskStatusDto dto)
{
    // ---------------------------------------------------------
    // Validate contributor
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

    if (contributor.Role != Role.Contributor)
    {
        return (
            null,
            "Only Contributors can update AI subtasks."
        );
    }

    if (!contributor.IsActive)
    {
        return (
            null,
            "Contributor account is inactive."
        );
    }

    // ---------------------------------------------------------
    // Validate subtask
    // ---------------------------------------------------------

    var subTask =
        await _subTaskRepository.GetByIdAsync(subTaskId);

    if (subTask == null ||
        subTask.IsDeleted)
    {
        return (
            null,
            "Subtask not found."
        );
    }

    // ---------------------------------------------------------
    // Validate parent task
    // ---------------------------------------------------------

    var task =
        await _taskRepository.GetByIdAsync(subTask.TaskId);

    if (task == null ||
        task.IsDeleted)
    {
        return (
            null,
            "Task not found."
        );
    }

    // ---------------------------------------------------------
    // SECURITY:
    // Contributor must own the parent task
    // ---------------------------------------------------------

    if (task.AssignedContributorSDId != userId)
    {
        return (
            null,
            "You cannot update this subtask."
        );
    }

    // ---------------------------------------------------------
    // AI-only protection
    // ---------------------------------------------------------

    if (!subTask.IsAIGenerated)
    {
        return (
            null,
            "This subtask is not an AI-generated subtask."
        );
    }

    // ---------------------------------------------------------
    // Completed protection
    // ---------------------------------------------------------

    if (subTask.Status == ProjectTaskStatus.Completed)
    {
        return (
            null,
            "This subtask cannot be modified."
        );
    }

    // ---------------------------------------------------------
    // Validate status
    // ---------------------------------------------------------

    if (!Enum.IsDefined(
        typeof(ProjectTaskStatus),
        dto.Status))
    {
        return (
            null,
            "Invalid subtask status."
        );
    }

    // ---------------------------------------------------------
    // Validate progress
    // ---------------------------------------------------------

    if (dto.Progress < 0 ||
        dto.Progress > 100)
    {
        return (
            null,
            "Progress must be between 0 and 100."
        );
    }

    // ---------------------------------------------------------
    // No changes
    // ---------------------------------------------------------

    if (subTask.Status == dto.Status &&
        subTask.Progress == dto.Progress)
    {
        return (
            MapToDto(subTask),
            "The subtask already has these values."
        );
    }

    // ---------------------------------------------------------
    // Validate status transition
    // ---------------------------------------------------------

    if (subTask.Status != dto.Status)
    {
        bool validTransition =
            IsValidStatusTransition(
                subTask.Status,
                dto.Status);

        if (!validTransition)
        {
            return (
                null,
                "This status change is not allowed."
            );
        }
    }

    // ---------------------------------------------------------
    // Update only status/progress
    // ---------------------------------------------------------

    subTask.Status = dto.Status;

    subTask.Progress = dto.Progress;

    subTask.UpdatedAt =
        DateTime.UtcNow;

    await _subTaskRepository.UpdateAsync(subTask);

    return (
        MapToDto(subTask),
        "AI subtask status updated successfully."
    );
}


// =========================================================
// STATUS TRANSITION VALIDATION
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
        // MAPPING
        // =========================================================

      private static SubTaskDto MapToDto(
    SubTask subTask)
{
    return new SubTaskDto
    {
        Id = subTask.Id,

        TaskId = subTask.TaskId,

        Title = subTask.Title,

        Description = subTask.Description,

        EstimatedHours =
            subTask.EstimatedHours,

        IsAIGenerated =
            subTask.IsAIGenerated,

        IsApproved =
            subTask.IsApproved,

        Status =
            subTask.Status,

        Progress =
            subTask.Progress,

        CreatedAt =
            subTask.CreatedAt,

        UpdatedAt =
            subTask.UpdatedAt
    };
}
    }
}