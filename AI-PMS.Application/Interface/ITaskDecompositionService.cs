using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface ITaskDecompositionService
{
    Task<TaskDecompositionResponse> DecomposeTaskAsync(
        TaskDecompositionRequest request,
        TaskSize taskSize);
}