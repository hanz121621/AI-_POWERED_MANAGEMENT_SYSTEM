using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Interfaces.Repositories.Teams
{
    public interface ITeamMemberRequestRepository
    {
        // =========================================================
        // CREATE
        // =========================================================

        Task<TeamMemberRequest> AddAsync(
            TeamMemberRequest request);

        // =========================================================
        // GET BY ID
        // =========================================================

        Task<TeamMemberRequest?> GetByIdAsync(
            Guid id);

        // =========================================================
        // GET ALL
        // =========================================================

        Task<List<TeamMemberRequest>> GetAllAsync();

        // =========================================================
        // GET BY TEAM
        // =========================================================

        Task<List<TeamMemberRequest>> GetByTeamIdAsync(
            Guid teamId);

        // =========================================================
        // GET BY MANAGER
        // =========================================================

        Task<List<TeamMemberRequest>> GetByManagerIdAsync(
            Guid managerId);

        // =========================================================
        // GET PENDING REQUESTS
        // =========================================================

        Task<List<TeamMemberRequest>> GetPendingAsync();

        // =========================================================
        // CHECK DUPLICATE PENDING REQUEST
        // =========================================================

        Task<bool> ExistsPendingRequestAsync(
            Guid teamId,
            Guid userId,
            TeamMemberRequestType requestType);

        // =========================================================
        // UPDATE
        // =========================================================

        Task UpdateAsync(
            TeamMemberRequest request);

        // =========================================================
        // SAVE CHANGES
        // =========================================================

        Task SaveChangesAsync();
    }
}
