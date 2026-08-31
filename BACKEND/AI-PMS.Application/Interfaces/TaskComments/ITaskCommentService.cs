using AI_PMS.Application.DTOs.TaskComments;

namespace AI_PMS.Application.Interfaces.TaskComments
{
    public interface ITaskCommentService
    {
        Task<(bool Success, string Message, TaskCommentDto? Comment)>
            AddCommentAsync(
                Guid userId,
                CreateTaskCommentDto dto);

        Task<IEnumerable<TaskCommentDto>>
            GetTaskCommentsAsync(
                Guid userId,
                Guid taskId);
    }
}