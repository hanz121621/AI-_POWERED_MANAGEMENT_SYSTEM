using AI_PMS.Application.DTOs.TaskSubmissions;

namespace AI_PMS.Application.Interfaces.TaskSubmissions
{
    public interface ITaskSubmissionService
    {
        Task<(
            bool Success,
            string Message,
            TaskSubmissionDto? Submission)>
            SubmitWorkAsync(
                Guid userId,
                Guid taskId,
                CreateTaskSubmissionDto dto);

        Task<IEnumerable<TaskSubmissionDto>>
            GetTaskSubmissionsAsync(
                Guid userId,
                Guid taskId);
    }
}