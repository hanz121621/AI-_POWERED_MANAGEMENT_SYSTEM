using AI_PMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Organization> Organizations => Set<Organization>();

    public DbSet<Project> Projects => Set<Project>();

    public DbSet<Sprint> Sprints => Set<Sprint>();

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    public DbSet<AIConfiguration> AIConfigurations => Set<AIConfiguration>();

    public DbSet<AISuggestion> AISuggestions => Set<AISuggestion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(ApplicationDbContext).Assembly);
    }
}