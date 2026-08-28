using AI_PMS.Application.DTOs;
using AI_PMS.Application.DTOs.Hierarchy;

namespace AI_PMS.Application.Interfaces;

public interface IHierarchicalTaskDecompositionService
{
    Task<HierarchicalTaskDecompositionResponse> DecomposeVeryLargeTaskAsync(
    TaskDecompositionRequest request);
}
