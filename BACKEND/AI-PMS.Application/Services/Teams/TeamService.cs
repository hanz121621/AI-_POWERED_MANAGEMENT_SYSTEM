using AI_PMS.Application.DTOs.Teams;
using AI_PMS.Application.Interfaces.Teams;

using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Repositories.Contributors;
using AI_PMS.Application.Interfaces
.Sprints;


using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Teams
{
    public class TeamService : ITeamService
    {
        private readonly ITeamRepository _teamRepository;
private readonly IUserRepository _userRepository;
private readonly ISprintRepository _sprintRepository;
private readonly IContributorTypeRepository _contributorTypeRepository;
private readonly IContributorSubTypeRepository _contributorSubTypeRepository;

      public TeamService(
    ITeamRepository teamRepository,
    IUserRepository userRepository,
    ISprintRepository sprintRepository,
    IContributorTypeRepository contributorTypeRepository,
    IContributorSubTypeRepository contributorSubTypeRepository)
{
    _teamRepository = teamRepository;
    _userRepository = userRepository;
    _sprintRepository = sprintRepository;
    _contributorTypeRepository = contributorTypeRepository;
    _contributorSubTypeRepository = contributorSubTypeRepository;
}
        // =========================================================
        // CREATE TEAM
        // =========================================================

        public async Task<(bool Success, string Message, TeamDto? Team)>
            CreateTeamAsync(CreateTeamDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return (false, "Team name is required.", null);
            }

            var existingTeams = await _teamRepository.GetAllAsync();

            if (existingTeams.Any(t =>
                t.Name.Trim().ToLower() ==
                dto.Name.Trim().ToLower()))
            {
                return (false, "Team name already exists.", null);
            }

            // -----------------------------------------------------
            // Validate Manager
            // -----------------------------------------------------

            if (dto.ManagerId.HasValue)
            {
                var manager = await _userRepository
                    .GetByIdAsync(dto.ManagerId.Value);

                if (manager == null)
                {
                    return (false, "Manager not found.", null);
                }

                if (manager.Role != Role.Manager)
                {
                    return (
                        false,
                        "Only users with Manager role can be assigned.",
                        null);
                }

                if (!manager.IsActive)
                {
                    return (
                        false,
                        "Selected manager is inactive.",
                        null);
                }
            }

            // -----------------------------------------------------
            // Create Team
            // -----------------------------------------------------

            var team = new Team
            {
                Id = Guid.NewGuid(),
                Name = dto.Name.Trim(),
                Description = dto.Description?.Trim(),
                ManagerId = dto.ManagerId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _teamRepository.AddAsync(team);

            // -----------------------------------------------------
            // Add Initial Members
            // -----------------------------------------------------

            foreach (var memberDto in dto.Members)
            {
                var result = await AddMemberAsync(
                    team.Id,
                    memberDto);

                if (!result.Success)
                {
                    return (
                        false,
                        $"Team created, but member could not be added: {result.Message}",
                        await GetTeamByIdAsync(team.Id));
                }
            }

            var createdTeam =
                await _teamRepository.GetByIdAsync(team.Id);

            return (
                true,
                "Team created successfully.",
                MapToDto(createdTeam!)
            );
        }

        // =========================================================
        // GET ALL TEAMS
        // =========================================================

        public async Task<IEnumerable<TeamDto>>
            GetAllTeamsAsync()
        {
            var teams =
                await _teamRepository.GetAllAsync();

            return teams.Select(MapToDto);
        }

        // =========================================================
        // GET TEAM BY ID
        // =========================================================

        public async Task<TeamDto?>
            GetTeamByIdAsync(Guid id)
        {
            var team =
                await _teamRepository.GetByIdAsync(id);

            if (team == null)
            {
                return null;
            }

            return MapToDto(team);
        }

        // =========================================================
        // UPDATE TEAM
        // =========================================================

        public async Task<(bool Success, string Message, TeamDto? Team)>
            UpdateTeamAsync(
                Guid id,
                UpdateTeamDto dto)
        {
            var team =
                await _teamRepository.GetByIdAsync(id);

            if (team == null)
            {
                return (false, "Team not found.", null);
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return (false, "Team name is required.", null);
            }

            var teams =
                await _teamRepository.GetAllAsync();

            if (teams.Any(t =>
                t.Id != id &&
                t.Name.Trim().ToLower() ==
                dto.Name.Trim().ToLower()))
            {
                return (
                    false,
                    "Team name already exists.",
                    null);
            }

            // -----------------------------------------------------
            // Validate Manager
            // -----------------------------------------------------

            if (dto.ManagerId.HasValue)
            {
                var manager =
                    await _userRepository
                        .GetByIdAsync(dto.ManagerId.Value);

                if (manager == null)
                {
                    return (false, "Manager not found.", null);
                }

                if (manager.Role != Role.Manager)
                {
                    return (
                        false,
                        "Only users with Manager role can be assigned.",
                        null);
                }

                if (!manager.IsActive)
                {
                    return (
                        false,
                        "Selected manager is inactive.",
                        null);
                }
            }

            team.Name = dto.Name.Trim();
            team.Description = dto.Description?.Trim();
            team.ManagerId = dto.ManagerId;
            team.IsActive = dto.IsActive;
            team.UpdatedAt = DateTime.UtcNow;

            await _teamRepository.UpdateAsync(team);

            // -----------------------------------------------------
            // Update Members
            // -----------------------------------------------------

            foreach (var memberDto in dto.Members)
            {
                var existingMember =
                    await _teamRepository.GetTeamMemberAsync(
                        id,
                        memberDto.UserId);

                if (existingMember == null ||
                    !existingMember.IsActive)
                {
                    await AddMemberAsync(id, memberDto);
                }
            }

            var updatedTeam =
                await _teamRepository.GetByIdAsync(id);

            return (
                true,
                "Team updated successfully.",
                MapToDto(updatedTeam!)
            );
        }

        // =========================================================
        // DELETE TEAM
        // =========================================================

        public async Task<(bool Success, string Message)>
            DeleteTeamAsync(Guid id)
        {
            var team =
                await _teamRepository.GetByIdAsync(id);

            if (team == null)
            {
                return (false, "Team not found.");
            }

            var members =
                await _teamRepository.GetMembersAsync(id);

            if (members.Any())
            {
                return (
                    false,
                    "The team cannot be deleted because it has active members.");
            }

            await _teamRepository.DeleteAsync(team);

            return (
                true,
                "Team deleted successfully.");
        }

        // =========================================================
        // ASSIGN MANAGER
        // =========================================================

        public async Task<(bool Success, string Message)>
            AssignManagerAsync(
                Guid teamId,
                Guid managerId)
        {
            var team =
                await _teamRepository.GetByIdAsync(teamId);

            if (team == null)
            {
                return (false, "Team not found.");
            }

            var manager =
                await _userRepository.GetByIdAsync(managerId);

            if (manager == null)
            {
                return (false, "Manager not found.");
            }

            if (manager.Role != Role.Manager)
            {
                return (
                    false,
                    "Only users with Manager role can be assigned.");
            }

            if (!manager.IsActive)
            {
                return (
                    false,
                    "Selected manager is inactive.");
            }

            team.ManagerId = managerId;

            await _teamRepository.UpdateAsync(team);

            return (
                true,
                "Manager assigned successfully.");
        }

        // =========================================================
        // ADD MEMBER
        // =========================================================

        public async Task<(bool Success, string Message)>
            AddMemberAsync(
                Guid teamId,
                AddTeamMemberDto dto)
        {
            var team =
                await _teamRepository.GetByIdAsync(teamId);

            if (team == null)
            {
                return (false, "Team not found.");
            }

            var user =
                await _userRepository
                    .GetByIdAsync(dto.UserId);

            if (user == null)
            {
                return (false, "User not found.");
            }

            if (!user.IsActive)
            {
                return (
                    false,
                    "Selected user is not active.");
            }

            if (user.Role != Role.Contributor)
            {
                return (
                    false,
                    "Only Contributors can be added to this team.");
            }

            // -----------------------------------------------------
            // Check Existing Member
            // -----------------------------------------------------

            var existingMember =
                await _teamRepository.GetTeamMemberAsync(
                    teamId,
                    dto.UserId);

            if (existingMember != null &&
                existingMember.IsActive)
            {
                return (
                    false,
                    "User is already part of this team.");
            }

            // -----------------------------------------------------
            // Validate Contributor Type
            // -----------------------------------------------------

            var contributorType =
                await _contributorTypeRepository
                    .GetByIdAsync(
                        dto.ContributorTypeId);

            if (contributorType == null)
            {
                return (
                    false,
                    "Invalid contributor type.");
            }

            if (!contributorType.IsActive)
            {
                return (
                    false,
                    "Selected contributor type is inactive.");
            }

            // -----------------------------------------------------
            // Validate Contributor SubType
            // -----------------------------------------------------

            if (dto.ContributorSubTypeId.HasValue)
            {
                var subType =
                    await _contributorSubTypeRepository
                        .GetByIdAsync(
                            dto.ContributorSubTypeId.Value);

                if (subType == null)
                {
                    return (
                        false,
                        "Invalid contributor sub-type.");
                }

                if (!subType.IsActive)
                {
                    return (
                        false,
                        "Selected contributor sub-type is inactive.");
                }

                if (subType.ContributorTypeId !=
                    dto.ContributorTypeId)
                {
                    return (
                        false,
                        "Selected contributor sub-type does not belong to the selected contributor type.");
                }
            }

            // -----------------------------------------------------
            // Create Team Member
            // -----------------------------------------------------

            var member = new TeamMember
            {
                Id = Guid.NewGuid(),
                TeamId = teamId,
                UserId = dto.UserId,

                ContributorTypeId =
                    dto.ContributorTypeId,

                ContributorSubTypeId =
                    dto.ContributorSubTypeId,

                JoinedAt = DateTime.UtcNow,
                IsActive = true
            };

            await _teamRepository.AddMemberAsync(member);

            return (
                true,
                "Member added successfully.");
        }

        // =========================================================
        // REMOVE MEMBER
        // =========================================================

        public async Task<(bool Success, string Message)>
            RemoveMemberAsync(
                Guid teamId,
                Guid userId)
        {
            var team =
                await _teamRepository.GetByIdAsync(teamId);

            if (team == null)
            {
                return (false, "Team not found.");
            }

            var member =
                await _teamRepository.GetTeamMemberAsync(
                    teamId,
                    userId);

            if (member == null ||
                !member.IsActive)
            {
                return (
                    false,
                    "User is not part of this team.");
            }

            member.IsActive = false;

            await _teamRepository.RemoveMemberAsync(member);

            return (
                true,
                "Member removed successfully.");
        }

        // =========================================================
        // GET TEAM MEMBERS
        // =========================================================

        public async Task<IEnumerable<TeamMemberDto>>
            GetTeamMembersAsync(
                Guid teamId)
        {
            var team =
                await _teamRepository.GetByIdAsync(teamId);

            if (team == null)
            {
                return Enumerable.Empty<TeamMemberDto>();
            }

            var members =
                await _teamRepository
                    .GetMembersAsync(teamId);

            return members.Select(member =>
                new TeamMemberDto
                {
                    UserId = member.UserId,

                    FullName =
                        member.User?.FullName
                        ?? string.Empty,

                    Email =
                        member.User?.Email
                        ?? string.Empty,

                    ContributorTypeId =
                        member.ContributorTypeId,

                    ContributorTypeName =
                        member.ContributorType?.Name
                        ?? string.Empty,

                    ContributorSubTypeId =
                        member.ContributorSubTypeId,

                    ContributorSubTypeName =
                        member.ContributorSubType?.Name,

                    JoinedAt =
                        member.JoinedAt,

                    IsActive =
                        member.IsActive
                });
        }

        // =========================================================
        // MAP TEAM -> DTO
        // =========================================================

        private static TeamDto MapToDto(
            Team team)
        {
            var activeMembers =
                team.TeamMembers
                    .Where(tm => tm.IsActive)
                    .ToList();

            return new TeamDto
            {
                Id = team.Id,

                Name = team.Name,

                Description = team.Description,

                ManagerId = team.ManagerId,

                ManagerName =
                    team.Manager?.FullName,

                IsActive = team.IsActive,

                CreatedAt = team.CreatedAt,

                UpdatedAt = team.UpdatedAt,

                MemberCount =
                    activeMembers.Count,

                DeveloperCount =
                    activeMembers.Count(tm =>
                        tm.ContributorType?.Name
                            .Equals(
                                "Developer",
                                StringComparison.OrdinalIgnoreCase)
                        == true),

                StaffCount =
                    activeMembers.Count(tm =>
                        tm.ContributorType?.Name
                            .Equals(
                                "Staff",
                                StringComparison.OrdinalIgnoreCase)
                        == true),

                Members =
                    activeMembers
                        .Select(tm =>
                            new TeamMemberDto
                            {
                                UserId =
                                    tm.UserId,

                                FullName =
                                    tm.User?.FullName
                                    ?? string.Empty,

                                Email =
                                    tm.User?.Email
                                    ?? string.Empty,

                                ContributorTypeId =
                                    tm.ContributorTypeId,

                                ContributorTypeName =
                                    tm.ContributorType?.Name
                                    ?? string.Empty,

                                ContributorSubTypeId =
                                    tm.ContributorSubTypeId,

                                ContributorSubTypeName =
                                    tm.ContributorSubType?.Name,

                                JoinedAt =
                                    tm.JoinedAt,

                                IsActive =
                                    tm.IsActive
                            })
                        .ToList()
            };
        }
    }
}