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

        // =========================================================
        // TL-SPRINT-001
        // VIEW SPRINT TASKS
        // =========================================================

        Task<TeamDto?>
            GetTeamByIdAsync(Guid id);

        Task<(bool Success, string Message)>
            AssignTeamLeaderAsync(
                Guid teamId,
                Guid userId);

        Task<(bool Success, string Message)>
            RemoveTeamLeaderAsync(
                Guid teamId,
                Guid userId);

        // =========================================================
        // MANAGER MANAGEMENT
        // =========================================================

        Task<(bool Success, string Message)>
            AssignManagerAsync(
                Guid teamId,
                Guid managerId);

        // =========================================================
        // MEMBER MANAGEMENT
        // =========================================================

        Task<(bool Success, string Message)>
            AddMemberAsync(
                Guid teamId,
                AddTeamMemberDto dto);

        Task<(bool Success, string Message)>
            RemoveMemberAsync(
                Guid teamId,
                Guid userId);

        Task<IEnumerable<TeamMemberDto>>
            GetTeamMembersAsync(
                Guid teamId);

        // =========================================================
        // CONTRIBUTOR / STAFF
        // GET MY ACTIVE TEAMS
        // =========================================================

        Task<IEnumerable<TeamDto>>
            GetMyTeamsAsync(
                Guid userId);
    }
}