using AI_PMS.Application.Interfaces.Repositories.Contributors;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using AI_PMS.Domain.Entities.Teams;

namespace AI_PMS.Infrastructure.Repositories.Contributors
{
    public class ContributorSubTypeRepository : IContributorSubTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public ContributorSubTypeRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // CREATE
        // =====================================================

        public async Task<ContributorSubType> AddAsync(
            ContributorSubType contributorSubType)
        {
            _context.ContributorSubTypes.Add(contributorSubType);

            await _context.SaveChangesAsync();

            return contributorSubType;
        }

        // =====================================================
        // GET BY ID
        // =====================================================

        public async Task<ContributorSubType?> GetByIdAsync(Guid id)
        {
            return await _context.ContributorSubTypes
                .Include(x => x.ContributorType)
                .Include(x => x.TeamMembers)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        // =====================================================
        // GET BY NAME WITHIN TYPE
        // =====================================================

        public async Task<ContributorSubType?> GetByNameAsync(
            Guid contributorTypeId,
            string name)
        {
            var normalizedName = name.Trim().ToLowerInvariant();

            return await _context.ContributorSubTypes
                .FirstOrDefaultAsync(x =>
                    x.ContributorTypeId == contributorTypeId &&
                    x.Name.ToLower() == normalizedName);
        }

        // =====================================================
        // GET ALL
        // =====================================================

        public async Task<List<ContributorSubType>> GetAllAsync()
        {
            return await _context.ContributorSubTypes
                .Include(x => x.ContributorType)
                .OrderBy(x => x.Name)
                .ToListAsync();
        }

        // =====================================================
        // GET BY CONTRIBUTOR TYPE
        // =====================================================

        public async Task<List<ContributorSubType>>
            GetByContributorTypeIdAsync(Guid contributorTypeId)
        {
            return await _context.ContributorSubTypes
                .Include(x => x.ContributorType)
                .Where(x => x.ContributorTypeId == contributorTypeId)
                .OrderBy(x => x.Name)
                .ToListAsync();
        }

        // =====================================================
        // GET ACTIVE
        // =====================================================

        public async Task<List<ContributorSubType>> GetActiveAsync()
        {
            return await _context.ContributorSubTypes
                .Include(x => x.ContributorType)
                .Where(x => x.IsActive)
                .OrderBy(x => x.Name)
                .ToListAsync();
        }

        // =====================================================
        // UPDATE
        // =====================================================

        public async Task UpdateAsync(
            ContributorSubType contributorSubType)
        {
            _context.ContributorSubTypes.Update(contributorSubType);

            await _context.SaveChangesAsync();
        }

        // =====================================================
        // DELETE
        // =====================================================

        public async Task DeleteAsync(
            ContributorSubType contributorSubType)
        {
            _context.ContributorSubTypes.Remove(contributorSubType);

            await _context.SaveChangesAsync();
        }
    }
}