using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface IStaffAIService
{
    Task<StaffAIResponse> AnalyzeAsync(
        StaffAIRequest request);
}