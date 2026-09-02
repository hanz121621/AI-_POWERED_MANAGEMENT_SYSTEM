using AI_PMS.Application.DTOs.Teams.TeamMemberRequests;
using AI_PMS.Application.DTOs.Teams;

namespace AI_PMS.Application.Interfaces.Teams
{
    public interface ITeamMemberRequestService
    {
        // =========================================================
        // MANAGER — CREATE REQUEST
        // TEAM-M-002 Add
        // TEAM-M-003 Remove
        // =========================================================

        Task<(bool Success, string Message, TeamMemberRequestDto? Request)>
            CreateRequestAsync(
                Guid managerId,
                CreateTeamMemberRequestDto dto);

        // =========================================================
        // GET REQUEST BY ID
        // =========================================================

        Task<TeamMemberRequestDto?>
            GetRequestByIdAsync(
                Guid requestId);

        // =========================================================
        // GET ALL REQUESTS
        // ADMIN
        // =========================================================

        Task<List<TeamMemberRequestDto>>
            GetAllRequestsAsync();

        // =========================================================
        // GET PENDING REQUESTS
        // ADMIN
        // =========================================================

        Task<List<TeamMemberRequestDto>>
            GetPendingRequestsAsync();

        // =========================================================
        // GET TEAM REQUESTS
        // =========================================================

        Task<List<TeamMemberRequestDto>>
            GetTeamRequestsAsync(
                Guid teamId);

        // =========================================================
        // GET MANAGER REQUESTS
        // =========================================================

        Task<List<TeamMemberRequestDto>>
            GetManagerRequestsAsync(
                Guid managerId);

        // =========================================================
        // ADMIN — APPROVE REQUEST
        // =========================================================

        Task<(bool Success, string Message)>
            ApproveRequestAsync(
                Guid adminId,
                Guid requestId,
                string? reviewComment);

        // =========================================================
        // ADMIN — REJECT REQUEST
        // =========================================================

        Task<(bool Success, string Message)>
            RejectRequestAsync(
                Guid adminId,
                Guid requestId,
                string? reviewComment);
    }
}
