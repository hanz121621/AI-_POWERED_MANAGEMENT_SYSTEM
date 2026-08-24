using AI_PMS.Application.Interfaces.Repositories.Contributors;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Contributors;

public class ContributorTypeRepository : IContributorTypeRepository
{
    private readonly ApplicationDbContext _context;

    public ContributorTypeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ContributorType> AddAsync(
        ContributorType contributorType)
    {
        _context.ContributorTypes.Add(contributorType);

        await _context.SaveChangesAsync();

        return contributorType;
    }

    public async Task<ContributorType?> GetByIdAsync(Guid id)
    {
        return await _context.ContributorTypes
            .Include(x => x.SubTypes)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<ContributorType?> GetByNameAsync(string name)
    {
        var normalizedName = name.Trim().ToLowerInvariant();

        return await _context.ContributorTypes
            .FirstOrDefaultAsync(x =>
                x.Name.ToLower() == normalizedName);
    }

    public async Task<List<ContributorType>> GetAllAsync()
    {
        return await _context.ContributorTypes
            .Include(x => x.SubTypes)
            .OrderBy(x => x.Name)
            .ToListAsync();
    }

    public async Task<List<ContributorType>> GetActiveAsync()
    {
        return await _context.ContributorTypes
            .Include(x => x.SubTypes)
            .Where(x => x.IsActive)
            .OrderBy(x => x.Name)
            .ToListAsync();
    }

    public async Task UpdateAsync(
        ContributorType contributorType)
    {
        _context.ContributorTypes.Update(contributorType);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(
        ContributorType contributorType)
    {
        _context.ContributorTypes.Remove(contributorType);

        await _context.SaveChangesAsync();
    }
}