using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Domain.Entities.Users;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Domain.Enums;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Users;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // CREATE USER
    // =========================================================

    public async Task<User> AddAsync(User user)
    {
        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return user;
    }

    // =========================================================
    // GET USER BY ID
    // =========================================================

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .Include(u => u.ContributorType)
            .Include(u => u.ContributorSubType)
            .FirstOrDefaultAsync(
                u => u.Id == id);
    }

    // =========================================================
    // GET USER BY EMAIL
    // =========================================================

    public async Task<User?> GetByEmailAsync(
        string email)
    {
        var normalizedEmail =
            email.Trim().ToLowerInvariant();

        return await _context.Users
            .Include(u => u.ContributorType)
            .Include(u => u.ContributorSubType)
            .FirstOrDefaultAsync(
                u => u.Email.ToLower() ==
                     normalizedEmail);
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    public async Task<List<User>> GetAllAsync()
    {
        return await _context.Users
            .Include(u => u.ContributorType)
            .Include(u => u.ContributorSubType)
            .OrderBy(u => u.FullName)
            .ToListAsync();
    }

    // =========================================================
    // UPDATE USER
    // =========================================================

    public async Task UpdateAsync(User user)
    {
        user.UpdatedAt = DateTime.UtcNow;

        _context.Users.Update(user);

        await _context.SaveChangesAsync();
    }
                  // =========================================================
// GET ACTIVE TEAM MEMBERSHIPS FOR USER
// =========================================================

public async Task<List<TeamMember>> GetActiveTeamMembershipsAsync(
    Guid userId)
{
    return await _context.TeamMembers
        .Include(tm => tm.Team)
        .Include(tm => tm.ContributorType)
        .Include(tm => tm.ContributorSubType)
        .Where(tm =>
            tm.UserId == userId &&
            tm.IsActive &&
            tm.Team != null &&
            tm.Team.IsActive)
        .OrderBy(tm => tm.JoinedAt)
        .ToListAsync();
}

// =========================================================
// GET ASSIGNED PROJECTS FOR USER
// =========================================================
//
// A project is considered assigned to the user when:
//
// 1. The user is the Project Manager
//
// OR
//
// 2. The project is assigned to one of the user's active teams.
//

public async Task<List<Project>> GetAssignedProjectsAsync(
    Guid userId)
{
    var teamIds = await _context.TeamMembers
        .Where(tm =>
            tm.UserId == userId &&
            tm.IsActive)
        .Select(tm => tm.TeamId)
        .ToListAsync();

    return await _context.Projects
        .Include(p => p.Status)
        .Where(p =>
            !p.IsDeleted &&
            (
                p.ManagerId == userId ||
                (p.TeamId.HasValue &&
                 teamIds.Contains(p.TeamId.Value))
            ))
        .OrderBy(p => p.Name)
        .ToListAsync();
}
    // =========================================================
    // DELETE USER
    // =========================================================

    public async Task DeleteAsync(User user)
    {
        _context.Users.Remove(user);

        await _context.SaveChangesAsync();
    }

    // =========================================================
    // PASSWORD RESET
    // =========================================================

    public async Task<User?>
        GetByPasswordResetTokenAsync(
            string token)
    {
        return await _context.Users
            .FirstOrDefaultAsync(
                u => u.PasswordResetToken == token);
    }

    // =========================================================
    // ACTIVE CONTRIBUTORS
    // =========================================================

    public async Task<List<User>>
        GetActiveDevelopersAsync()
    {
        return await _context.Users
            .Include(u => u.ContributorType)
            .Include(u => u.ContributorSubType)
            .Where(u =>
                u.Role == Role.Contributor &&
                u.IsActive)
            .OrderBy(u => u.FullName)
            .ToListAsync();
    }

    // =========================================================
    // ACTIVE USERS
    // =========================================================

    public async Task<List<User>>
        GetActiveUsersAsync()
    {
        return await _context.Users
            .Include(u => u.ContributorType)
            .Include(u => u.ContributorSubType)
            .Where(u => u.IsActive)
            .OrderBy(u => u.FullName)
            .ToListAsync();
    }
// =========================================================
// CHECK WHETHER CONTRIBUTOR TYPE HAS ACTIVE SUBTYPES
// =========================================================

public async Task<bool> ContributorTypeHasSubTypesAsync(
    Guid contributorTypeId)
{
    return await _context.ContributorSubTypes
        .AnyAsync(cst =>
            cst.ContributorTypeId == contributorTypeId &&
            cst.IsActive);
}
        // =========================================================
    // CHECK CONTRIBUTOR TYPE EXISTS
    // =========================================================

    public async Task<bool> ContributorTypeExistsAsync(
        Guid contributorTypeId)
    {
        return await _context.ContributorTypes
            .AnyAsync(ct =>
                ct.Id == contributorTypeId &&
                ct.IsActive);
    }
        // =========================================================
    // CHECK CONTRIBUTOR SUBTYPE EXISTS
    // =========================================================

    public async Task<bool> ContributorSubTypeExistsAsync(
        Guid contributorSubTypeId)
    {
        return await _context.ContributorSubTypes
            .AnyAsync(cst =>
                cst.Id == contributorSubTypeId &&
                cst.IsActive);
    }
        // =========================================================
    // CHECK CONTRIBUTOR CLASSIFICATION EXISTS
    // =========================================================

    public async Task<bool> ContributorClassificationExistsAsync(
        Guid contributorTypeId,
        Guid contributorSubTypeId)
    {
        return await _context.ContributorSubTypes
            .AnyAsync(cst =>
                cst.Id == contributorSubTypeId &&
                cst.ContributorTypeId == contributorTypeId &&
                cst.IsActive);
    }

    // =========================================================
    // ACTIVATE / DEACTIVATE USER
    // =========================================================

    public async Task SetActiveStatusAsync(
        Guid userId,
        bool isActive)
    {
        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Id == userId);

        if (user == null)
            return;

        user.IsActive = isActive;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }
}