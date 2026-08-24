using AI_PMS.Domain.Entities.AISettings;
using AI_PMS.Domain.Entities.DashboardSettings;
using AI_PMS.Domain.Entities.Users;
using AI_PMS.Domain.Entities.SystemSettings;
using Microsoft.EntityFrameworkCore;
using AI_PMS.Domain.Entities.Projects;


namespace AI_PMS.Application.Interfaces.Data;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
     DbSet<SystemSetting> SystemSettings { get; }


    Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default);
}