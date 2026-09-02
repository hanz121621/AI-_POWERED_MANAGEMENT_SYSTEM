using AI_PMS.Application.DTOs.TaskSubmissions;

namespace AI_PMS.Application.Interfaces.TaskSubmissions
{
    public interface ITaskSubmissionService
    {
        // =========================================================
        // TASK-007
        // SUBMIT COMPLETED WORK
        // =========================================================

        Task<(
            bool Success,
            string Message,
            TaskSubmissionDto? Submission)>
            SubmitWorkAsync(
                Guid userId,
                Guid taskId,
                CreateTaskSubmissionDto dto);

        // =========================================================
        // GET SUBMISSION HISTORY
        // =========================================================

        Task<IEnumerable<TaskSubmissionDto>>
            GetTaskSubmissionsAsync(
                Guid userId,
                Guid taskId);

        // =========================================================
        // TASK-009
        // REVIEW TASK SUBMISSION
        // TEAM LEADER
        // =========================================================

        Task<(
            bool Success,
            string Message,
            TaskSubmissionDto? Submission)>
            ReviewSubmissionAsync(
                Guid teamLeaderId,
                Guid submissionId,
                ReviewTaskSubmissionDto dto);
    }
}