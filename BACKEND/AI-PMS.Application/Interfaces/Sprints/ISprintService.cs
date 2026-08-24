using AI_PMS.Application.DTOs.Sprints;

namespace AI_PMS.Application.Interfaces.Sprints
{
    public interface ISprintService
    {
        Task<(bool Success, string Message)> CreateSprintAsync(
            Guid managerId,
            CreateSprintDto dto);

        Task<IEnumerable<SprintDto>> GetAllSprintsAsync();

        Task<SprintDto?> GetSprintByIdAsync(Guid id);

        Task<IEnumerable<SprintDto>> GetProjectSprintsAsync(
            Guid projectId);

        Task<(bool Success, string Message)> UpdateSprintAsync(
            Guid id,
            UpdateSprintDto dto);

        Task<bool> DeleteSprintAsync(Guid id);
    }
}