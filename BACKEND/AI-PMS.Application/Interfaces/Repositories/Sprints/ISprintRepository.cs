using AI_PMS.Domain.Entities.Sprints;

namespace AI_PMS.Application.Interfaces.Sprints
{
    public interface ISprintRepository
    {
        // =========================================================
        // CREATE
        // =========================================================

        Task<Sprint> AddAsync(Sprint sprint);

        // =========================================================
        // GET
        // =========================================================

        Task<List<Sprint>> GetAllAsync();

        Task<Sprint?> GetByIdAsync(Guid id);

        Task<List<Sprint>> GetProjectSprintsAsync(
            Guid projectId);

        Task<Sprint?> GetByNameAsync(
            Guid projectId,
            string name);

        // =========================================================
        // UPDATE
        // =========================================================

        Task UpdateAsync(Sprint sprint);

        // =========================================================
        // TEAM ASSIGNMENT
        // =========================================================

        Task AssignTeamAsync(
            Sprint sprint);
    }
}
