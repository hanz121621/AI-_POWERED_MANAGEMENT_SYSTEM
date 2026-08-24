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
                .Include(t => t.Manager)

                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.User)
                        .ThenInclude(u => u.ContributorType)


                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.User)
                        .ThenInclude(u => u.ContributorSubType)

                .FirstOrDefaultAsync(t => t.Id == id);
        }

        // =========================================================
        // GET ALL TEAMS
        // =========================================================

        public async Task<List<Team>> GetAllAsync()
        {
            return await _context.Teams
                .Include(t => t.Manager)

                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.User)
                        .ThenInclude(u => u.ContributorType)

               

                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.User)
                        .ThenInclude(u => u.ContributorSubType)

                .OrderBy(t => t.Name)
                .ToListAsync();
        }

        // =========================================================
        // GET TEAMS BY MANAGER
        // =========================================================

        public async Task<List<Team>> GetByManagerIdAsync(Guid managerId)
        {
            return await _context.Teams
                .Include(t => t.Manager)

                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.User)
                        .ThenInclude(u => u.ContributorType)

                

                .Include(t => t.TeamMembers)
                    .ThenInclude(tm => tm.User)
                        .ThenInclude(u => u.ContributorSubType)

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
                .Include(tm => tm.User)
                    .ThenInclude(u => u.ContributorType)

                .Include(tm => tm.User)
                    .ThenInclude(u => u.ContributorSubType)

         

                .Include(tm => tm.Team)

                .FirstOrDefaultAsync(tm =>
                    tm.TeamId == teamId &&
                    tm.UserId == userId);
        }

        // =========================================================
        // GET TEAM MEMBERS
        // =========================================================

        public async Task<List<TeamMember>> GetMembersAsync(Guid teamId)
        {
            return await _context.TeamMembers
                .Include(tm => tm.User)
                    .ThenInclude(u => u.ContributorType)

                .Include(tm => tm.User)
                    .ThenInclude(u => u.ContributorSubType)

              

                .Where(tm =>
                    tm.TeamId == teamId &&
                    tm.IsActive)

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
            return await _context.Teams.AnyAsync(t =>
                t.Name.ToLower() == name.Trim().ToLower() &&
                (!excludeTeamId.HasValue || t.Id != excludeTeamId.Value));
        }

        // =========================================================
        // ADD MEMBER
        // =========================================================

        public async Task AddMemberAsync(TeamMember teamMember)
        {
            await _context.TeamMembers.AddAsync(teamMember);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // REMOVE MEMBER
        // =========================================================

        public async Task RemoveMemberAsync(TeamMember teamMember)
        {
            _context.TeamMembers.Remove(teamMember);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // UPDATE TEAM
        // =========================================================

        public async Task UpdateAsync(Team team)
        {
            team.UpdatedAt = DateTime.UtcNow;

            _context.Teams.Update(team);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // DELETE TEAM
        // =========================================================

        public async Task DeleteAsync(Team team)
        {
            _context.Teams.Remove(team);

            await _context.SaveChangesAsync();
        }
    }
}