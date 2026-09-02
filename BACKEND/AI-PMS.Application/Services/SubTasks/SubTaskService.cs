using AI_PMS.Application.DTOs.SubTasks;
using AI_PMS.Application.Interfaces.Repositories.SubTasks;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.SubTasks;
using AI_PMS.Domain.Entities.SubTasks;

namespace AI_PMS.Application.Services
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

                CreatedAt =
                    subTask.CreatedAt,

                UpdatedAt =
                    subTask.UpdatedAt
            };
        }
    }
}