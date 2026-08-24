using AI_PMS.Application.DTOs.Teams;

namespace AI_PMS.Application.Interfaces.Teams
{
    public interface ITeamService
    {
        // =========================================================
        // TEAM MANAGEMENT
        // =========================================================

        Task<(bool Success, string Message, TeamDto? Team)>
            CreateTeamAsync(CreateTeamDto dto);

        Task<(bool Success, string Message, TeamDto? Team)>
            UpdateTeamAsync(Guid id, UpdateTeamDto dto);

        Task<(bool Success, string Message)>
            DeleteTeamAsync(Guid id);

        Task<IEnumerable<TeamDto>>
            GetAllTeamsAsync();

        Task<TeamDto?>
            GetTeamByIdAsync(Guid id);

        // =========================================================
        // MANAGER MANAGEMENT
        // =========================================================

        Task<(bool Success, string Message)>
            AssignManagerAsync(Guid teamId, Guid managerId);

        // =========================================================
        // MEMBER MANAGEMENT
        // =========================================================

        Task<(bool Success, string Message)>
            AddMemberAsync(Guid teamId, AddTeamMemberDto dto);

        Task<(bool Success, string Message)>
            RemoveMemberAsync(Guid teamId, Guid userId);

        Task<IEnumerable<TeamMemberDto>>
            GetTeamMembersAsync(Guid teamId);
    }
}