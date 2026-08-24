using AI_PMS.Domain.Entities.Sprints;

namespace AI_PMS.Application.Interfaces.Sprints
{
    public interface ISprintRepository
    {
        Task<Sprint> AddAsync(Sprint sprint);

        Task<List<Sprint>> GetAllAsync();

        Task<Sprint?> GetByIdAsync(Guid id);

        Task<List<Sprint>> GetProjectSprintsAsync(
            Guid projectId);

        Task<Sprint?> GetByNameAsync(
            Guid projectId,
            string name);

        Task UpdateAsync(Sprint sprint);
    }
}