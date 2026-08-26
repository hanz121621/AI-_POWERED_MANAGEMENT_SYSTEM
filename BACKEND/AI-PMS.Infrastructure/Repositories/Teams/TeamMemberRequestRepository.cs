using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Domain.Enums;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Teams
{
    public class TeamMemberRequestRepository
        : ITeamMemberRequestRepository
    {
        private readonly ApplicationDbContext _context;

        public TeamMemberRequestRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE
        // =========================================================

        public async Task<TeamMemberRequest> AddAsync(
            TeamMemberRequest request)
        {
            await _context.TeamMemberRequests.AddAsync(request);

            await _context.SaveChangesAsync();

            return request;
        }

        // =========================================================
        // GET BY ID
        // =========================================================

        public async Task<TeamMemberRequest?> GetByIdAsync(
            Guid id)
        {
            return await _context.TeamMemberRequests
                .Include(r => r.Team)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        // =========================================================
        // GET ALL
        // =========================================================

        public async Task<List<TeamMemberRequest>> GetAllAsync()
        {
            return await _context.TeamMemberRequests
                .Include(r => r.Team)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // GET BY TEAM
        // =========================================================

        public async Task<List<TeamMemberRequest>> GetByTeamIdAsync(
            Guid teamId)
        {
            return await _context.TeamMemberRequests
                .Include(r => r.Team)
                .Where(r => r.TeamId == teamId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // GET BY MANAGER
        // =========================================================

        public async Task<List<TeamMemberRequest>> GetByManagerIdAsync(
            Guid managerId)
        {
            return await _context.TeamMemberRequests
                .Include(r => r.Team)
                .Where(r => r.ManagerId == managerId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // GET PENDING
        // =========================================================

        public async Task<List<TeamMemberRequest>> GetPendingAsync()
        {
            return await _context.TeamMemberRequests
                .Include(r => r.Team)
                .Where(r =>
                    r.Status ==
                    TeamMemberRequestStatus.Pending)
                .OrderBy(r => r.CreatedAt)
                .ToListAsync();
        }

        // =========================================================
        // CHECK DUPLICATE PENDING REQUEST
        // =========================================================

        public async Task<bool> ExistsPendingRequestAsync(
            Guid teamId,
            Guid userId,
            TeamMemberRequestType requestType)
        {
            return await _context.TeamMemberRequests
                .AnyAsync(r =>
                    r.TeamId == teamId &&
                    r.UserId == userId &&
                    r.RequestType == requestType &&
                    r.Status ==
                        TeamMemberRequestStatus.Pending);
        }

        // =========================================================
        // UPDATE
        // =========================================================

        public async Task UpdateAsync(
            TeamMemberRequest request)
        {
            _context.TeamMemberRequests.Update(request);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // SAVE CHANGES
        // =========================================================

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}