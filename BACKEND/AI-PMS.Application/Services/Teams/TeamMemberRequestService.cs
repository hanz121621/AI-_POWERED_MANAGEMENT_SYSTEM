using AI_PMS.Application.DTOs.Teams.TeamMemberRequests;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Application.Interfaces.Teams;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Domain.Enums;
using AI_PMS.Application.DTOs.Teams;

namespace AI_PMS.Application.Services.Teams
{
    public class TeamMemberRequestService : ITeamMemberRequestService
    {
        private readonly ITeamMemberRequestRepository _requestRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly IUserRepository _userRepository;

        public TeamMemberRequestService(
            ITeamMemberRequestRepository requestRepository,
            ITeamRepository teamRepository,
            IProjectRepository projectRepository,
            IUserRepository userRepository)
        {
            _requestRepository = requestRepository;
            _teamRepository = teamRepository;
            _projectRepository = projectRepository;
            _userRepository = userRepository;
        }

        // =========================================================
        // CREATE TEAM MEMBER REQUEST
        //
        // TEAM-M-002 -> ADD
        // TEAM-M-003 -> REMOVE
        // =========================================================

        public async Task<(
            bool Success,
            string Message,
            TeamMemberRequestDto? Request)>
            CreateRequestAsync(
                Guid managerId,
                CreateTeamMemberRequestDto dto)
        {
            // -----------------------------------------------------
            // BASIC ID VALIDATION
            // -----------------------------------------------------

            if (managerId == Guid.Empty)
            {
                return (
                    false,
                    "Invalid manager identity.",
                    null);
            }

            if (dto.ProjectId == Guid.Empty)
            {
                return (
                    false,
                    "Invalid project.",
                    null);
            }

            if (dto.TeamId == Guid.Empty)
            {
                return (
                    false,
                    "Invalid team.",
                    null);
            }

            if (dto.UserId == Guid.Empty)
            {
                return (
                    false,
                    "Invalid user.",
                    null);
            }

            // -----------------------------------------------------
            // GET PROJECT
            // -----------------------------------------------------

            var project =
                await _projectRepository.GetByIdAsync(
                    dto.ProjectId);

            if (project == null)
            {
                return (
                    false,
                    "Project not found.",
                    null);
            }

            // -----------------------------------------------------
            // MANAGER AUTHORIZATION
            // -----------------------------------------------------

            if (!project.ManagerId.HasValue ||
                project.ManagerId.Value != managerId)
            {
                return (
                    false,
                    "Manager is not authorized to manage this project.",
                    null);
            }

            // -----------------------------------------------------
            // PROJECT TEAM VALIDATION
            // -----------------------------------------------------

            if (!project.TeamId.HasValue)
            {
                return (
                    false,
                    "The project does not have an assigned team.",
                    null);
            }

            if (project.TeamId.Value != dto.TeamId)
            {
                return (
                    false,
                    "The selected team is not assigned to this project.",
                    null);
            }

            // -----------------------------------------------------
            // GET TEAM
            // -----------------------------------------------------

            var team =
                await _teamRepository.GetByIdAsync(
                    dto.TeamId);

            if (team == null)
            {
                return (
                    false,
                    "Team not found.",
                    null);
            }

            if (!team.IsActive)
            {
                return (
                    false,
                    "The selected team is inactive.",
                    null);
            }

            // -----------------------------------------------------
            // TEAM MANAGER VALIDATION
            // -----------------------------------------------------

            if (!team.ManagerId.HasValue ||
                team.ManagerId.Value != managerId)
            {
                return (
                    false,
                    "Manager is not authorized to manage this team.",
                    null);
            }

            // -----------------------------------------------------
            // GET USER
            // -----------------------------------------------------

            var user =
                await _userRepository.GetByIdAsync(
                    dto.UserId);

            if (user == null)
            {
                return (
                    false,
                    "User not found.",
                    null);
            }

            // -----------------------------------------------------
            // USER ACTIVE VALIDATION
            // -----------------------------------------------------

            if (!user.IsActive)
            {
                return (
                    false,
                    "The selected user is inactive.",
                    null);
            }

            // -----------------------------------------------------
            // REASON VALIDATION
            // -----------------------------------------------------

            if (string.IsNullOrWhiteSpace(dto.Reason))
            {
                return (
                    false,
                    "A reason is required for the request.",
                    null);
            }

            // -----------------------------------------------------
            // CHECK CURRENT MEMBERSHIP
            // -----------------------------------------------------

            var existingMember =
                await _teamRepository.GetTeamMemberAsync(
                    dto.TeamId,
                    dto.UserId);

            // =====================================================
            // ADD REQUEST
            // =====================================================

            if (dto.RequestType ==
                TeamMemberRequestType.Add)
            {
                // User must NOT already be a member.

                if (existingMember != null &&
                    existingMember.IsActive)
                {
                    return (
                        false,
                        "User is already a member of this team.",
                        null);
                }
            }

            // =====================================================
            // REMOVE REQUEST
            // =====================================================

            if (dto.RequestType ==
                TeamMemberRequestType.Remove)
            {
                // User MUST currently belong to the team.

                if (existingMember == null ||
                    !existingMember.IsActive)
                {
                    return (
                        false,
                        "User is not an active member of this team.",
                        null);
                }
            }

            // -----------------------------------------------------
            // CHECK DUPLICATE PENDING REQUEST
            // -----------------------------------------------------

            var duplicate =
                await _requestRepository
                    .ExistsPendingRequestAsync(
                        dto.TeamId,
                        dto.UserId,
                        dto.RequestType);

            if (duplicate)
            {
                return (
                    false,
                    "A pending request already exists for this user and team.",
                    null);
            }

            // -----------------------------------------------------
            // CREATE REQUEST
            // -----------------------------------------------------

            var request = new TeamMemberRequest
            {
                Id = Guid.NewGuid(),

                ProjectId = dto.ProjectId,

                TeamId = dto.TeamId,

                ManagerId = managerId,

                UserId = dto.UserId,

                RequestType = dto.RequestType,

                Reason = dto.Reason.Trim(),

                Status = TeamMemberRequestStatus.Pending,

                CreatedAt = DateTime.UtcNow
            };

            await _requestRepository.AddAsync(request);

            // -----------------------------------------------------
            // MAP RESULT
            // -----------------------------------------------------

            var result = MapToDto(request);

            string message =
                dto.RequestType ==
                TeamMemberRequestType.Add
                    ? "Team member addition request submitted successfully."
                    : "Team member removal request submitted successfully.";

            return (
                true,
                message,
                result);
        }

        // =========================================================
        // GET REQUEST BY ID
        // =========================================================

        public async Task<TeamMemberRequestDto?>
            GetRequestByIdAsync(
                Guid requestId)
        {
            if (requestId == Guid.Empty)
                return null;

            var request =
                await _requestRepository.GetByIdAsync(
                    requestId);

            if (request == null)
                return null;

            return MapToDto(request);
        }

        // =========================================================
        // GET ALL REQUESTS
        // =========================================================

        public async Task<List<TeamMemberRequestDto>>
            GetAllRequestsAsync()
        {
            var requests =
                await _requestRepository.GetAllAsync();

            return requests
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // GET PENDING REQUESTS
        // =========================================================

        public async Task<List<TeamMemberRequestDto>>
            GetPendingRequestsAsync()
        {
            var requests =
                await _requestRepository.GetPendingAsync();

            return requests
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // GET TEAM REQUESTS
        // =========================================================

        public async Task<List<TeamMemberRequestDto>>
            GetTeamRequestsAsync(
                Guid teamId)
        {
            if (teamId == Guid.Empty)
                return new List<TeamMemberRequestDto>();

            var requests =
                await _requestRepository
                    .GetByTeamIdAsync(teamId);

            return requests
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // GET MANAGER REQUESTS
        // =========================================================

        public async Task<List<TeamMemberRequestDto>>
            GetManagerRequestsAsync(
                Guid managerId)
        {
            if (managerId == Guid.Empty)
                return new List<TeamMemberRequestDto>();

            var requests =
                await _requestRepository
                    .GetByManagerIdAsync(managerId);

            return requests
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // ADMIN APPROVE
        // =========================================================

        public async Task<(bool Success, string Message)>
            ApproveRequestAsync(
                Guid adminId,
                Guid requestId,
                string? reviewComment)
        {
            if (adminId == Guid.Empty)
            {
                return (
                    false,
                    "Invalid admin identity.");
            }

            var request =
                await _requestRepository.GetByIdAsync(
                    requestId);

            if (request == null)
            {
                return (
                    false,
                    "Team member request not found.");
            }

            if (request.Status !=
                TeamMemberRequestStatus.Pending)
            {
                return (
                    false,
                    "Only pending requests can be approved.");
            }

            // -----------------------------------------------------
            // GET TEAM
            // -----------------------------------------------------

            var team =
                await _teamRepository.GetByIdAsync(
                    request.TeamId);

            if (team == null)
            {
                return (
                    false,
                    "Team not found.");
            }

            // -----------------------------------------------------
            // GET USER
            // -----------------------------------------------------

            var user =
                await _userRepository.GetByIdAsync(
                    request.UserId);

            if (user == null)
            {
                return (
                    false,
                    "User not found.");
            }

            // User must still be active.

            if (!user.IsActive)
            {
                return (
                    false,
                    "The selected user is inactive. The request cannot be approved.");
            }

            // =====================================================
            // ADD APPROVAL
            // =====================================================

            if (request.RequestType ==
                TeamMemberRequestType.Add)
            {
                var existingMember =
                    await _teamRepository.GetTeamMemberAsync(
                        request.TeamId,
                        request.UserId);

                if (existingMember != null &&
                    existingMember.IsActive)
                {
                    return (
                        false,
                        "User is already a member of this team.");
                }

                if (existingMember != null)
                {
                    existingMember.IsActive = true;

                    await _teamRepository
                        .UpdateMemberAsync(existingMember);
                }
                else
                {
                    var teamMember = new TeamMember
                    {
                        Id = Guid.NewGuid(),

                        TeamId = request.TeamId,

                        UserId = request.UserId,

                        JoinedAt = DateTime.UtcNow,

                        IsActive = true
                    };

                    await _teamRepository
                        .AddMemberAsync(teamMember);
                }
            }

            // =====================================================
            // REMOVE APPROVAL
            // =====================================================

            else if (request.RequestType ==
                     TeamMemberRequestType.Remove)
            {
                var existingMember =
                    await _teamRepository.GetTeamMemberAsync(
                        request.TeamId,
                        request.UserId);

                if (existingMember == null ||
                    !existingMember.IsActive)
                {
                    return (
                        false,
                        "User is no longer an active member of this team.");
                }

                // -------------------------------------------------
                // IMPORTANT:
                // Active/critical task validation will be connected
                // here when we wire the existing Task repository.
                // -------------------------------------------------

                existingMember.IsActive = false;

                await _teamRepository
                    .UpdateMemberAsync(existingMember);
            }

            // =====================================================
            // UPDATE REQUEST
            // =====================================================

            request.Status =
                TeamMemberRequestStatus.Approved;

            request.ReviewedByAdminId =
                adminId;

            request.ReviewedAt =
                DateTime.UtcNow;

            request.ReviewComment =
                string.IsNullOrWhiteSpace(reviewComment)
                    ? null
                    : reviewComment.Trim();

            request.UpdatedAt =
                DateTime.UtcNow;

            await _requestRepository
                .UpdateAsync(request);

            return (
                true,
                "Team member request approved successfully.");
        }

        // =========================================================
        // ADMIN REJECT
        // =========================================================

        public async Task<(bool Success, string Message)>
            RejectRequestAsync(
                Guid adminId,
                Guid requestId,
                string? reviewComment)
        {
            if (adminId == Guid.Empty)
            {
                return (
                    false,
                    "Invalid admin identity.");
            }

            var request =
                await _requestRepository.GetByIdAsync(
                    requestId);

            if (request == null)
            {
                return (
                    false,
                    "Team member request not found.");
            }

            if (request.Status !=
                TeamMemberRequestStatus.Pending)
            {
                return (
                    false,
                    "Only pending requests can be rejected.");
            }

            request.Status =
                TeamMemberRequestStatus.Rejected;

            request.ReviewedByAdminId =
                adminId;

            request.ReviewedAt =
                DateTime.UtcNow;

            request.ReviewComment =
                string.IsNullOrWhiteSpace(reviewComment)
                    ? null
                    : reviewComment.Trim();

            request.UpdatedAt =
                DateTime.UtcNow;

            await _requestRepository
                .UpdateAsync(request);

            return (
                true,
                "Team member request rejected successfully.");
        }

        // =========================================================
        // MAPPING
        // =========================================================

        private static TeamMemberRequestDto
            MapToDto(
                TeamMemberRequest request)
        {
            return new TeamMemberRequestDto
            {
                Id = request.Id,

                ProjectId = request.ProjectId,

                TeamId = request.TeamId,

                ManagerId = request.ManagerId,

                UserId = request.UserId,

                RequestType = request.RequestType,

                Reason = request.Reason,

                Status = request.Status,

                ReviewedByAdminId =
                    request.ReviewedByAdminId,

                ReviewedAt =
                    request.ReviewedAt,

                ReviewComment =
                    request.ReviewComment,

                CreatedAt =
                    request.CreatedAt,

                UpdatedAt =
                    request.UpdatedAt
            };
        }
    }
}