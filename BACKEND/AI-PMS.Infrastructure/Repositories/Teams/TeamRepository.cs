using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Teams
{
    public class TeamRepository : ITeamRepository
    {
        private readonly ApplicationDbContext _context;

        public TeamRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE TEAM
        // =========================================================

        public async Task<Team> AddAsync(Team team)
        {
            await _context.Teams.AddAsync(team);

            await _context.SaveChangesAsync();

            return team;
        }

        // =========================================================
        // GET TEAM BY ID
        // =========================================================

        public async Task<Team?> GetByIdAsync(Guid id)
        {
            return await _context.Teams

                // Team Manager
                .Include(t => t.Manager)

                // Team Members
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.User)

                // Team Member -> Contributor Type
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.ContributorType)

                // Team Member -> Contributor SubType
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.ContributorSubType)

                .FirstOrDefaultAsync(t => t.Id == id);
        }
                
                  // =========================================================
// GET TEAM LEADER MEMBERSHIP
// =========================================================

public async Task<TeamMember?> GetTeamLeaderMembershipAsync(
    Guid teamId,
    Guid userId)
{
    return await _context.TeamMembers
        .AsNoTracking()
        .Include(tm => tm.User)
        .Include(tm => tm.Team)
        .Where(tm =>
            tm.TeamId == teamId &&
            tm.UserId == userId &&
            tm.IsTeamLeader &&
            tm.IsActive &&
            tm.User != null &&
            tm.User.IsActive &&
            tm.Team != null &&
            tm.Team.IsActive)
        .FirstOrDefaultAsync();
}
        // =========================================================
        // GET ALL TEAMS
        // =========================================================

        public async Task<List<Team>> GetAllAsync()
        {
            return await _context.Teams

                // Manager
                .Include(t => t.Manager)

                // Members -> User
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.User)

                // Members -> Contributor Type
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.ContributorType)

                // Members -> Contributor SubType
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.ContributorSubType)

                .OrderBy(t => t.Name)

                .ToListAsync();
        }

        // =========================================================
        // GET TEAMS BY MANAGER
        // =========================================================

        public async Task<List<Team>> GetByManagerIdAsync(
            Guid managerId)
        {
            return await _context.Teams

                // Manager
                .Include(t => t.Manager)

                // Members -> User
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.User)

                // Members -> Contributor Type
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.ContributorType)

                // Members -> Contributor SubType
                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.ContributorSubType)

                .Where(t => t.ManagerId == managerId)

                .OrderBy(t => t.Name)

                .ToListAsync();
        }

        // =========================================================
        // GET TEAM MEMBER
        // =========================================================

        public async Task<TeamMember?> GetTeamMemberAsync(
            Guid teamId,
            Guid userId)
        {
            return await _context.TeamMembers

                // User
                .Include(tm => tm.User)

                // Contributor Type
                .Include(tm => tm.ContributorType)

                // Contributor SubType
                .Include(tm => tm.ContributorSubType)

                // Team
                .Include(tm => tm.Team)

                .FirstOrDefaultAsync(tm =>
                    tm.TeamId == teamId &&
                    tm.UserId == userId);
        }

        // =========================================================
        // GET ACTIVE TEAM MEMBERS
        // =========================================================

        public async Task<List<TeamMember>> GetMembersAsync(
            Guid teamId)
        {
            return await _context.TeamMembers

                // User
                .Include(tm => tm.User)

                // Contributor Type
                .Include(tm => tm.ContributorType)

                // Contributor SubType
                .Include(tm => tm.ContributorSubType)

                .Where(tm =>
                    tm.TeamId == teamId &&
                    tm.IsActive)

                .OrderBy(tm => tm.JoinedAt)

                .ToListAsync();
        }

        // =========================================================
        // GET ALL TEAM MEMBERS
        // Includes active + inactive
        // =========================================================

        public async Task<List<TeamMember>> GetAllMembersAsync(
            Guid teamId)
        {
            return await _context.TeamMembers

                // User
                .Include(tm => tm.User)

                // Contributor Type
                .Include(tm => tm.ContributorType)

                // Contributor SubType
                .Include(tm => tm.ContributorSubType)

                .Where(tm => tm.TeamId == teamId)

                .OrderBy(tm => tm.JoinedAt)

                .ToListAsync();
        }

        // =========================================================
        // CHECK TEAM NAME
        // =========================================================

        public async Task<bool> ExistsByNameAsync(
            string name,
            Guid? excludeTeamId = null)
        {
            var normalizedName = name.Trim().ToLower();

            return await _context.Teams.AnyAsync(t =>
                t.Name.ToLower() == normalizedName &&
                (!excludeTeamId.HasValue ||
                 t.Id != excludeTeamId.Value));
        }

        // =========================================================
        // ADD MEMBER
        // =========================================================

        public async Task AddMemberAsync(
            TeamMember teamMember)
        {
            await _context.TeamMembers.AddAsync(teamMember);

            await _context.SaveChangesAsync();
        }
        // =========================================================
// GET TEAM LEADER
// =========================================================

public async Task<TeamMember?> GetTeamLeaderAsync(
    Guid teamId)
{
    if (teamId == Guid.Empty)
    {
        return null;
    }

    return await _context.TeamMembers
        .AsNoTracking()
        .Include(tm => tm.User)
        .Include(tm => tm.ContributorType)
        .Include(tm => tm.ContributorSubType)
        .Where(tm =>
            tm.TeamId == teamId &&
            tm.IsTeamLeader &&
            tm.IsActive)
        .FirstOrDefaultAsync();
}

        // =========================================================
        // UPDATE MEMBER
        // =========================================================

        public async Task UpdateMemberAsync(
            TeamMember teamMember)
        {
            _context.TeamMembers.Update(teamMember);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // REMOVE MEMBER
        // =========================================================

        public async Task RemoveMemberAsync(
            TeamMember teamMember)
        {
            _context.TeamMembers.Remove(teamMember);

            await _context.SaveChangesAsync();
        }


        // =========================================================
        // UPDATE TEAM
        // =========================================================

        public async Task UpdateAsync(
            Team team)
        {
            team.UpdatedAt = DateTime.UtcNow;

            _context.Teams.Update(team);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // DELETE TEAM
        // =========================================================

        public async Task DeleteAsync(
            Team team)
        {
            _context.Teams.Remove(team);

            await _context.SaveChangesAsync();
        }
    }
}