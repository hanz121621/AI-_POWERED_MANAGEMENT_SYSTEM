using AI_PMS.Application.DTOs.SubTasks;
using AI_PMS.Application.Interfaces.SubTasks;
using AI_PMS.Application.Interfaces.Repositories.SubTasks;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Domain.Entities.SubTasks;

namespace AI_PMS.Application.Services.SubTasks
{
    public class SubTaskService : ISubTaskService
    {
       private readonly ISubTaskRepository _subTaskRepository;
        private readonly ITaskRepository _taskRepository;

        public SubTaskService(
            ISubTaskRepository subTaskRepository,
            ITaskRepository taskRepository)
        {
            _subTaskRepository = subTaskRepository;
            _taskRepository = taskRepository;
        }

        // =========================================================
        // CREATE SUBTASK
        // =========================================================
        public async Task<SubTaskUpdateResult> CreateSubTaskAsync(
            CreateSubTaskDto dto)
        {
            // Parent task must exist
            var task =
                await _taskRepository.GetByIdAsync(dto.TaskId);

            if (task == null)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message = "Task not found."
                };
            }

            // Validate title
            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message = "Subtask title is required."
                };
            }

            string newTitle = dto.Title.Trim();

            // Case-insensitive duplicate check
            var existingSubTask =
                await _subTaskRepository.GetByTitleAsync(
                    dto.TaskId,
                    newTitle);

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

            // Validate estimated hours
            if (dto.EstimatedHours < 0)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message =
                        "Estimated hours cannot be negative."
                };
            }

            var subTask = new SubTask
            {
                TaskId = dto.TaskId,
                Title = newTitle,
                Description =
                    dto.Description?.Trim() ?? string.Empty,

                EstimatedHours = dto.EstimatedHours,

                IsAIGenerated = dto.IsAIGenerated,

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
        // GET ALL SUBTASKS
        // =========================================================
        public async Task<IEnumerable<SubTaskDto>>
            GetAllSubTasksAsync()
        {
            var subTasks =
                await _subTaskRepository.GetAllAsync();

            return subTasks
                .Where(x => !x.IsDeleted)
                .Select(MapToDto);
        }


        // =========================================================
        // GET SUBTASK BY ID
        // =========================================================
        public async Task<SubTaskDto?>
            GetSubTaskByIdAsync(Guid id)
        {
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
        // GET SUBTASKS BY TASK
        // =========================================================
        public async Task<IEnumerable<SubTaskDto>>
            GetTaskSubTasksAsync(Guid taskId)
        {
            var task =
                await _taskRepository.GetByIdAsync(taskId);

            if (task == null)
            {
                return Enumerable.Empty<SubTaskDto>();
            }

            var subTasks =
                await _subTaskRepository
                    .GetByTaskIdAsync(taskId);

            return subTasks
                .Where(x => !x.IsDeleted)
                .Select(MapToDto);
        }


        // =========================================================
        // APPROVE SUBTASK
        // =========================================================
        public async Task<(bool Success, string Message)>
            ApproveSubTaskAsync(Guid id)
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

            // Do not approve twice
            if (subTask.IsApproved)
            {
                return (
                    false,
                    "Subtask is already approved."
                );
            }

            subTask.IsApproved = true;
            subTask.UpdatedAt = DateTime.UtcNow;

            await _subTaskRepository.UpdateAsync(subTask);

            return (
                true,
                "Subtask approved successfully."
            );
        }


        // =========================================================
        // UPDATE SUBTASK
        // =========================================================
        public async Task<SubTaskUpdateResult>
            UpdateSubTaskAsync(
                Guid id,
                UpdateSubTaskDto dto)
        {
            var subTask =
                await _subTaskRepository.GetByIdAsync(id);

            // -----------------------------------------------------
            // NOT FOUND
            // -----------------------------------------------------
            if (subTask == null ||
                subTask.IsDeleted)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message = "Subtask not found."
                };
            }
            


            // -----------------------------------------------------
            // VALIDATE TITLE
            // -----------------------------------------------------
            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message = "Subtask title is required."
                };
            }


            string newTitle =
                dto.Title.Trim();

            string newDescription =
                dto.Description?.Trim() ?? string.Empty;


            // -----------------------------------------------------
            // CASE-INSENSITIVE DUPLICATE CHECK
            // -----------------------------------------------------
            var existingSubTask =
                await _subTaskRepository.GetByTitleAsync(
                    subTask.TaskId,
                    newTitle);

            if (existingSubTask != null &&
                existingSubTask.Id != id &&
                !existingSubTask.IsDeleted)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message =
                        "A subtask with this title already exists in this task."
                };
            }


            // -----------------------------------------------------
            // VALIDATE HOURS
            // -----------------------------------------------------
            if (dto.EstimatedHours < 0)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message =
                        "Estimated hours cannot be negative."
                };
            }


            // -----------------------------------------------------
            // CHECK WHAT CHANGED
            // -----------------------------------------------------

            bool titleChanged =
                !string.Equals(
                    subTask.Title?.Trim(),
                    newTitle,
                    StringComparison.OrdinalIgnoreCase);

            bool descriptionChanged =
                !string.Equals(
                    subTask.Description?.Trim() ??
                    string.Empty,
                    newDescription,
                    StringComparison.Ordinal);

            bool estimatedHoursChanged =
                subTask.EstimatedHours !=
                dto.EstimatedHours;


            bool anythingChanged =
                titleChanged ||
                descriptionChanged ||
                estimatedHoursChanged;


            // -----------------------------------------------------
            // NOTHING CHANGED
            // -----------------------------------------------------
            if (!anythingChanged)
            {
                return new SubTaskUpdateResult
                {
                    Success = false,
                    Message =
                        "No changes were made. The subtask already contains these values.",
                    SubTask = MapToDto(subTask)
                };
            }


            // -----------------------------------------------------
            // UPDATE
            // -----------------------------------------------------

            subTask.Title =
                newTitle;

            subTask.Description =
                newDescription;

            subTask.EstimatedHours =
                dto.EstimatedHours;

            subTask.UpdatedAt =
                DateTime.UtcNow;

            await _subTaskRepository.UpdateAsync(subTask);

            return new SubTaskUpdateResult
            {
                Success = true,
                Message =
                    "Subtask updated successfully.",
                SubTask =
                    MapToDto(subTask)
            };
        }


        // =========================================================
        // SOFT DELETE SUBTASK
        // =========================================================
       // =========================================================
// SOFT DELETE SUBTASK
// MANAGER ONLY
// =========================================================
public async Task<(bool Success, string Message)>
    DeleteSubTaskAsync(Guid id)
{
    var subTask =
        await _subTaskRepository.GetByIdAsync(id);

    if (subTask == null)
    {
        return (
            false,
            "Subtask not found."
        );
    }

    if (subTask.IsDeleted)
    {
        return (
            false,
            "Subtask is already deleted."
        );
    }

    // GLOBAL RULE:
    // NEVER physically delete from the database.
    subTask.IsDeleted = true;
    subTask.UpdatedAt = DateTime.UtcNow;

    await _subTaskRepository.UpdateAsync(subTask);

    return (
        true,
        "Subtask deleted successfully."
    );
}

        // =========================================================
        // ENTITY -> DTO
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
                EstimatedHours = subTask.EstimatedHours,
                IsAIGenerated = subTask.IsAIGenerated,
                IsApproved = subTask.IsApproved,
                CreatedAt = subTask.CreatedAt,
                UpdatedAt = subTask.UpdatedAt
            };
        }
    }
}
