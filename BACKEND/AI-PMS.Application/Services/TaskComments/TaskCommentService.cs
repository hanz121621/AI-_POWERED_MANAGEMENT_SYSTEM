using AI_PMS.Application.DTOs.TaskComments;
using AI_PMS.Application.Interfaces.Repositories.TaskComments;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.TaskComments;
using AI_PMS.Domain.Entities.TaskComments;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.TaskComments
{
    public class TaskCommentService : ITaskCommentService
    {
        private readonly ITaskCommentRepository _commentRepository;
        private readonly ITaskRepository _taskRepository;
        private readonly IUserRepository _userRepository;

        public TaskCommentService(
            ITaskCommentRepository commentRepository,
            ITaskRepository taskRepository,
            IUserRepository userRepository)
        {
            _commentRepository = commentRepository;
            _taskRepository = taskRepository;
            _userRepository = userRepository;
        }

        // =========================================================
        // ADD COMMENT
        // =========================================================
        public async Task<(
            bool Success,
            string Message,
            TaskCommentDto? Comment)>
            AddCommentAsync(
                Guid userId,
                CreateTaskCommentDto dto)
        {
            // -----------------------------------------------------
            // Validate comment
            // -----------------------------------------------------
            if (string.IsNullOrWhiteSpace(dto.Content))
            {
                return (
                    false,
                    "Comment cannot be empty.",
                    null);
            }

            string content = dto.Content.Trim();

            if (content.Length > 2000)
            {
                return (
                    false,
                    "Comment cannot exceed 2000 characters.",
                    null);
            }

            // -----------------------------------------------------
            // Find user
            // -----------------------------------------------------
            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return (
                    false,
                    "Access denied.",
                    null);
            }

            if (!user.IsActive)
            {
                return (
                    false,
                    "Access denied.",
                    null);
            }

            // -----------------------------------------------------
            // Developer / Staff
            // Both are Contributor in current system
            // -----------------------------------------------------
            if (user.Role != Role.Contributor)
            {
                return (
                    false,
                    "Access denied.",
                    null);
            }

            // -----------------------------------------------------
            // Find task
            // -----------------------------------------------------
            var task =
                await _taskRepository.GetByIdAsync(dto.TaskId);

            if (task == null)
            {
                return (
                    false,
                    "Task not found.",
                    null);
            }

            // -----------------------------------------------------
            // Verify task access
            //
            // Only the Contributor assigned to the task
            // can add a comment.
            // -----------------------------------------------------
            if (task.AssignedContributorSDId != userId)
            {
                return (
                    false,
                    "Access denied.",
                    null);
            }

            // -----------------------------------------------------
            // Create comment
            // -----------------------------------------------------
            var comment = new TaskComment
            {
                Id = Guid.NewGuid(),

                TaskId = task.Id,

                CreatedBy = userId,

                Content = content,

                CreatedAt = DateTime.UtcNow
            };

            try
            {
                await _commentRepository.AddAsync(comment);
            }
            catch
            {
                return (
                    false,
                    "Unable to add comment. Please try again.",
                    null);
            }

            // -----------------------------------------------------
            // Map result
            // -----------------------------------------------------
            var result = new TaskCommentDto
            {
                Id = comment.Id,

                TaskId = comment.TaskId,

                CreatedBy = comment.CreatedBy,

                Content = comment.Content,

                CreatedAt = comment.CreatedAt,

                UpdatedAt = comment.UpdatedAt
            };

            return (
                true,
                "Comment added successfully.",
                result);
        }

        // =========================================================
        // GET TASK COMMENTS
        // =========================================================
        public async Task<IEnumerable<TaskCommentDto>>
            GetTaskCommentsAsync(
                Guid userId,
                Guid taskId)
        {
            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null || !user.IsActive)
            {
                throw new InvalidOperationException(
                    "Access denied.");
            }

            if (user.Role != Role.Contributor)
            {
                throw new InvalidOperationException(
                    "Access denied.");
            }

            var task =
                await _taskRepository.GetByIdAsync(taskId);

            if (task == null)
            {
                throw new InvalidOperationException(
                    "Task not found.");
            }

            if (task.AssignedContributorSDId != userId)
            {
                throw new InvalidOperationException(
                    "Access denied.");
            }

            var comments =
                await _commentRepository
                    .GetByTaskIdAsync(taskId);

            return comments.Select(c =>
                new TaskCommentDto
                {
                    Id = c.Id,

                    TaskId = c.TaskId,

                    CreatedBy = c.CreatedBy,

                    Content = c.Content,

                    CreatedAt = c.CreatedAt,

                    UpdatedAt = c.UpdatedAt
                });
        }
    }
}