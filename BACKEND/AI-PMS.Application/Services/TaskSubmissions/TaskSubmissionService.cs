using AI_PMS.Application.DTOs.TaskSubmissions;
using AI_PMS.Application.Interfaces.Repositories.TaskSubmissions;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.TaskSubmissions;
using AI_PMS.Domain.Entities.TaskSubmissions;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.TaskSubmissions
{
    public class TaskSubmissionService
        : ITaskSubmissionService
    {
        private readonly ITaskSubmissionRepository
            _submissionRepository;

        private readonly ITaskRepository
            _taskRepository;

        private readonly IUserRepository
            _userRepository;

        public TaskSubmissionService(
            ITaskSubmissionRepository submissionRepository,
            ITaskRepository taskRepository,
            IUserRepository userRepository)
        {
            _submissionRepository = submissionRepository;
            _taskRepository = taskRepository;
            _userRepository = userRepository;
        }

        // =========================================================
        // SUBMIT COMPLETED WORK
        // Developer + Staff
        // Both are Contributors in current system.
        // =========================================================
        public async Task<(
            bool Success,
            string Message,
            TaskSubmissionDto? Submission)>
            SubmitWorkAsync(
                Guid userId,
                Guid taskId,
                CreateTaskSubmissionDto dto)
        {
            // -----------------------------------------------------
            // Validate submission information
            // -----------------------------------------------------
            if (string.IsNullOrWhiteSpace(
                    dto.CompletionNotes) ||
                string.IsNullOrWhiteSpace(
                    dto.WorkSummary))
            {
                return (
                    false,
                    "Please provide required submission details.",
                    null);
            }

            // -----------------------------------------------------
            // Find user
            // -----------------------------------------------------
            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null ||
                !user.IsActive ||
                user.Role != Role.Contributor)
            {
                return (
                    false,
                    "You cannot submit work for this task.",
                    null);
            }

            // -----------------------------------------------------
            // Find task
            // -----------------------------------------------------
            var task =
                await _taskRepository.GetByIdAsync(taskId);

            if (task == null)
            {
                return (
                    false,
                    "Task not found.",
                    null);
            }

            // -----------------------------------------------------
            // Verify assignment
            // -----------------------------------------------------
            if (task.AssignedContributorSDId != userId)
            {
                return (
                    false,
                    "You cannot submit work for this task.",
                    null);
            }

            // -----------------------------------------------------
            // Task cannot already be completed
            // -----------------------------------------------------
            if (task.Status ==
                    ProjectTaskStatus.Completed)
            {
                return (
                    false,
                    "This task cannot be submitted.",
                    null);
            }

            // -----------------------------------------------------
            // Task cannot already be in review
            // -----------------------------------------------------
            if (task.Status ==
                    ProjectTaskStatus.InReview)
            {
                return (
                    false,
                    "This task cannot be submitted.",
                    null);
            }

            // -----------------------------------------------------
            // Only suitable task statuses can be submitted.
            //
            // Todo is also rejected because the work has not
            // started yet.
            // -----------------------------------------------------
            if (task.Status !=
                    ProjectTaskStatus.InProgress)
            {
                return (
                    false,
                    "This task cannot be submitted.",
                    null);
            }

            // -----------------------------------------------------
            // Create submission
            // -----------------------------------------------------
            var submission = new TaskSubmission
            {
                Id = Guid.NewGuid(),

                TaskId = taskId,

                SubmittedBy = userId,

                CompletionNotes =
                    dto.CompletionNotes.Trim(),

                WorkSummary =
                    dto.WorkSummary.Trim(),

                RelatedLinks =
                    string.IsNullOrWhiteSpace(
                        dto.RelatedLinks)
                        ? null
                        : dto.RelatedLinks.Trim(),

                SubmittedAt = DateTime.UtcNow
            };

            try
            {
                await _submissionRepository
                    .AddAsync(submission);

                // -------------------------------------------------
                // Update task status
                // -------------------------------------------------
                task.Status =
                    ProjectTaskStatus.InReview;

                task.UpdatedAt =
                    DateTime.UtcNow;

                await _taskRepository
                    .UpdateAsync(task);
            }
            catch
            {
                return (
                    false,
                    "Unable to submit work. Please try again.",
                    null);
            }

            // -----------------------------------------------------
            // Map result
            // -----------------------------------------------------
            var result = new TaskSubmissionDto
            {
                Id = submission.Id,

                TaskId = submission.TaskId,

                SubmittedBy = submission.SubmittedBy,

                CompletionNotes =
                    submission.CompletionNotes,

                WorkSummary =
                    submission.WorkSummary,

                RelatedLinks =
                    submission.RelatedLinks,

                SubmittedAt =
                    submission.SubmittedAt,

                IsApproved =
                    submission.IsApproved,

                IsRejected =
                    submission.IsRejected,

                ReviewComment =
                    submission.ReviewComment,

                ReviewedAt =
                    submission.ReviewedAt,

                ReviewedBy =
                    submission.ReviewedBy
            };

            return (
                true,
                "Work submitted successfully for review.",
                result);
        }

        // =========================================================
        // GET SUBMISSION HISTORY
        // =========================================================
        public async Task<IEnumerable<TaskSubmissionDto>>
            GetTaskSubmissionsAsync(
                Guid userId,
                Guid taskId)
        {
            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null ||
                !user.IsActive)
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

            // Contributor can view submissions for
            // their own assigned task.
            if (user.Role == Role.Contributor &&
                task.AssignedContributorSDId != userId)
            {
                throw new InvalidOperationException(
                    "Access denied.");
            }

            var submissions =
                await _submissionRepository
                    .GetByTaskIdAsync(taskId);

            return submissions.Select(s =>
                new TaskSubmissionDto
                {
                    Id = s.Id,

                    TaskId = s.TaskId,

                    SubmittedBy = s.SubmittedBy,

                    CompletionNotes =
                        s.CompletionNotes,

                    WorkSummary =
                        s.WorkSummary,

                    RelatedLinks =
                        s.RelatedLinks,

                    SubmittedAt =
                        s.SubmittedAt,

                    IsApproved =
                        s.IsApproved,

                    IsRejected =
                        s.IsRejected,

                    ReviewComment =
                        s.ReviewComment,

                    ReviewedAt =
                        s.ReviewedAt,

                    ReviewedBy =
                        s.ReviewedBy
                });
        }
    }
}