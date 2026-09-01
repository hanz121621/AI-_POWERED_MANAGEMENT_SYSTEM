using AI_PMS.Domain.Entities.Teams;

namespace AI_PMS.Application.Interfaces.Repositories.Teams
{
    public interface ITeamRepository
    {
        Task<Team> AddAsync(Team team);

        Task<Team?> GetByIdAsync(Guid id);

        Task<List<Team>> GetAllAsync();

        // =========================================================
        // TEAM LEADER
        // =========================================================

        Task<TeamMember?> GetTeamLeaderAsync(
            Guid teamId);

        Task<List<Team>> GetByManagerIdAsync(
            Guid managerId);

        Task<TeamMember?> GetTeamMemberAsync(
            Guid teamId,
            Guid userId);

        Task<List<TeamMember>> GetAllMembersAsync(
            Guid teamId);

        Task<List<TeamMember>> GetMembersAsync(
            Guid teamId);

        Task<bool> ExistsByNameAsync(
            string name,
            Guid? excludeTeamId = null);

        Task AddMemberAsync(
            TeamMember teamMember);

        Task UpdateMemberAsync(
            TeamMember teamMember);

        Task RemoveMemberAsync(
            TeamMember teamMember);

        Task UpdateAsync(
            Team team);

        Task DeleteAsync(
            Team team);
    }
}