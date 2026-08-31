
using AI_PMS.Application.DTOs.TaskSubmissions;
using AI_PMS.Application.Interfaces.Repositories.TaskSubmissions;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Sprints;
using  AI_PMS.Application.Interfaces.Repositories.Sprints;
using AI_PMS.Application.Interfaces.TaskSubmissions;
using AI_PMS.Domain.Entities.TaskSubmissions;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.TaskSubmissions
{
    public class TaskSubmissionService : ITaskSubmissionService
    {
        private readonly ITaskSubmissionRepository _submissionRepository;
        private readonly ITaskRepository _taskRepository;
        private readonly IUserRepository _userRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly ISprintRepository _sprintRepository;

        public TaskSubmissionService(
            ITaskSubmissionRepository submissionRepository,
            ITaskRepository taskRepository,
            IUserRepository userRepository,
            ITeamRepository teamRepository,
            ISprintRepository sprintRepository)
        {
            _submissionRepository = submissionRepository;
            _taskRepository = taskRepository;
            _userRepository = userRepository;
            _teamRepository = teamRepository;
            _sprintRepository = sprintRepository;
        }

        // =========================================================
        // TASK-007
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
            // 1. Validate submission information
            // -----------------------------------------------------

            if (string.IsNullOrWhiteSpace(dto.CompletionNotes) ||
                string.IsNullOrWhiteSpace(dto.WorkSummary))
            {
                return (
                    false,
                    "Please provide required submission details.",
                    null);
            }

            // -----------------------------------------------------
            // 2. Find user
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
            // 3. Find task
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
            // 4. Verify task assignment
            // -----------------------------------------------------

            if (task.AssignedContributorSDId != userId)
            {
                return (
                    false,
                    "You cannot submit work for this task.",
                    null);
            }

            // -----------------------------------------------------
            // 5. Task cannot already be completed
            // -----------------------------------------------------

            if (task.Status == ProjectTaskStatus.Completed)
            {
                return (
                    false,
                    "This task cannot be submitted.",
                    null);
            }

            // -----------------------------------------------------
            // 6. Task cannot already be in review
            // -----------------------------------------------------

            if (task.Status == ProjectTaskStatus.InReview)
            {
                return (
                    false,
                    "This task cannot be submitted.",
                    null);
            }

            // -----------------------------------------------------
            // 7. Only InProgress tasks can be submitted
            // -----------------------------------------------------

            if (task.Status != ProjectTaskStatus.InProgress)
            {
                return (
                    false,
                    "This task cannot be submitted.",
                    null);
            }

            // -----------------------------------------------------
            // 8. Create submission
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
                    string.IsNullOrWhiteSpace(dto.RelatedLinks)
                        ? null
                        : dto.RelatedLinks.Trim(),

                SubmittedAt = DateTime.UtcNow
            };

            // -----------------------------------------------------
            // 9. Save submission and update task
            // -----------------------------------------------------

            try
            {
                await _submissionRepository
                    .AddAsync(submission);

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
            // 10. Map result
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
        // TASK-009
        // REVIEW TASK SUBMISSION
        // TEAM LEADER
        // =========================================================

        public async Task<(
            bool Success,
            string Message,
            TaskSubmissionDto? Submission)>
            ReviewSubmissionAsync(
                Guid teamLeaderId,
                Guid submissionId,
                ReviewTaskSubmissionDto dto)
        {
            // -----------------------------------------------------
            // 1. Validate IDs
            // -----------------------------------------------------

            if (teamLeaderId == Guid.Empty)
            {
                return (
                    false,
                    "Invalid team leader.",
                    null);
            }

            if (submissionId == Guid.Empty)
            {
                return (
                    false,
                    "Invalid submission.",
                    null);
            }

            if (dto == null)
            {
                return (
                    false,
                    "Review information is required.",
                    null);
            }

            // -----------------------------------------------------
            // 2. Validate review comment
            //
            // Rejection must contain a reason.
            // -----------------------------------------------------

            if (!dto.Approve &&
                string.IsNullOrWhiteSpace(dto.ReviewComment))
            {
                return (
                    false,
                    "A review comment is required when rejecting work.",
                    null);
            }

            // -----------------------------------------------------
            // 3. Find reviewer
            // -----------------------------------------------------

            var reviewer =
                await _userRepository.GetByIdAsync(teamLeaderId);

            if (reviewer == null ||
                !reviewer.IsActive)
            {
                return (
                    false,
                    "Team leader not found or inactive.",
                    null);
            }

            // -----------------------------------------------------
            // 4. Find submission
            // -----------------------------------------------------

            var submission =
                await _submissionRepository
                    .GetByIdAsync(submissionId);

            if (submission == null)
            {
                return (
                    false,
                    "Submission not found.",
                    null);
            }

            // -----------------------------------------------------
            // 5. Find task
            // -----------------------------------------------------

            var task =
                await _taskRepository
                    .GetByIdAsync(submission.TaskId);

            if (task == null)
            {
                return (
                    false,
                    "Task associated with the submission was not found.",
                    null);
            }

            // -----------------------------------------------------
            // 6. Submission must belong to task in review
            // -----------------------------------------------------

            if (task.Status != ProjectTaskStatus.InReview)
            {
                return (
                    false,
                    "This submission is not awaiting review.",
                    null);
            }

            // -----------------------------------------------------
            // 7. Find sprint
            // -----------------------------------------------------

            var sprint =
                await _sprintRepository
                    .GetByIdAsync(task.SprintId);

            if (sprint == null)
            {
                return (
                    false,
                    "Sprint associated with the task was not found.",
                    null);
            }

            // -----------------------------------------------------
            // 8. Validate sprint team
            //
            // Sprint.TeamId is Guid?, therefore we must check
            // HasValue before accessing Value.
            // -----------------------------------------------------

            if (!sprint.TeamId.HasValue ||
                sprint.TeamId.Value == Guid.Empty)
            {
                return (
                    false,
                    "This task is not assigned to a team.",
                    null);
            }

            // -----------------------------------------------------
            // 9. Verify reviewer is Team Leader
            //    of this task's team
            // -----------------------------------------------------

            var teamLeaderMembership =
                await _teamRepository
                    .GetTeamLeaderMembershipAsync(
                        sprint.TeamId.Value,
                        teamLeaderId);

            if (teamLeaderMembership == null ||
                !teamLeaderMembership.IsActive ||
                !teamLeaderMembership.IsTeamLeader)
            {
                return (
                    false,
                    "You are not the team leader of this task's team.",
                    null);
            }

            // -----------------------------------------------------
            // 10. Prevent duplicate review
            // -----------------------------------------------------

            if (submission.IsApproved ||
                submission.IsRejected)
            {
                return (
                    false,
                    "This submission has already been reviewed.",
                    null);
            }

            // -----------------------------------------------------
            // 11. Update submission review information
            // -----------------------------------------------------

            submission.IsApproved =
                dto.Approve;

            submission.IsRejected =
                !dto.Approve;

            submission.ReviewComment =
                string.IsNullOrWhiteSpace(dto.ReviewComment)
                    ? null
                    : dto.ReviewComment.Trim();

            submission.ReviewedAt =
                DateTime.UtcNow;

            submission.ReviewedBy =
                teamLeaderId;

            // -----------------------------------------------------
            // 12. Update task status
            // -----------------------------------------------------

            if (dto.Approve)
            {
                task.Status =
                    ProjectTaskStatus.Completed;
            }
            else
            {
                task.Status =
                    ProjectTaskStatus.InProgress;
            }

            task.UpdatedAt =
                DateTime.UtcNow;

            // -----------------------------------------------------
            // 13. Save changes
            // -----------------------------------------------------

            try
            {
                await _submissionRepository
                    .UpdateAsync(submission);

                await _taskRepository
                    .UpdateAsync(task);
            }
            catch
            {
                return (
                    false,
                    "Unable to review submission. Please try again.",
                    null);
            }

            // -----------------------------------------------------
            // 14. Map result
            // -----------------------------------------------------

            var result = new TaskSubmissionDto
            {
                Id = submission.Id,

                TaskId = submission.TaskId,

                SubmittedBy =
                    submission.SubmittedBy,

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

            // -----------------------------------------------------
            // 15. Return result
            // -----------------------------------------------------

            return (
                true,
                dto.Approve
                    ? "Submission approved successfully. Task marked as completed."
                    : "Submission rejected successfully. Task returned to in-progress.",
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
            // -----------------------------------------------------
            // 1. Find user
            // -----------------------------------------------------

            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null ||
                !user.IsActive)
            {
                throw new InvalidOperationException(
                    "Access denied.");
            }

            // -----------------------------------------------------
            // 2. Find task
            // -----------------------------------------------------

            var task =
                await _taskRepository.GetByIdAsync(taskId);

            if (task == null)
            {
                throw new InvalidOperationException(
                    "Task not found.");
            }

            // -----------------------------------------------------
            // 3. Contributor can only view submissions
            //    for their own assigned task
            // -----------------------------------------------------

            if (user.Role == Role.Contributor &&
                task.AssignedContributorSDId != userId)
            {
                throw new InvalidOperationException(
                    "Access denied.");
            }

            // -----------------------------------------------------
            // 4. Get submissions
            // -----------------------------------------------------

            var submissions =
                await _submissionRepository
                    .GetByTaskIdAsync(taskId);

            // -----------------------------------------------------
            // 5. Map results
            // -----------------------------------------------------

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
