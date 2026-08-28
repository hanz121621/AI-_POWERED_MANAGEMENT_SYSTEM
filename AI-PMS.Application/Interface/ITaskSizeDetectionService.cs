using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface ITaskSizeDetectionService
{
    Task<TaskSizeResponse> DetectTaskSizeAsync(
        TaskDecompositionRequest request);
}