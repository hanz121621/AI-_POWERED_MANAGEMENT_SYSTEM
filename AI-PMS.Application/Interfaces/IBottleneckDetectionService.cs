using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface IBottleneckDetectionService
{
    Task<BottleneckResponse> DetectBottlenecksAsync(
        BottleneckRequest request);

    Task<BottleneckResponse> DetectBottlenecksForProjectAsync(
        Guid projectId);
}