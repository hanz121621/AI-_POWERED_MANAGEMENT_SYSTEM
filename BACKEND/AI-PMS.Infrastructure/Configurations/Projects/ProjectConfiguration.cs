
using AI_PMS.Domain.Entities.Projects;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AI_PMS.Infrastructure.Configurations.Projects
{
    public class ProjectConfiguration : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.ToTable("Projects");

            // Primary Key
            builder.HasKey(p => p.Id);

            // Basic Information
            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(p => p.Description)
                .HasMaxLength(2000);

            // Status
            builder.Property(p => p.StatusId)
                .IsRequired();

            builder.HasOne(p => p.Status)
                .WithMany(s => s.Projects)
                .HasForeignKey(p => p.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            // Manager
            builder.Property(p => p.ManagerId)
                .IsRequired(false);

            // Team
            builder.Property(p => p.TeamId)
                .IsRequired(false);

            // Dates
            builder.Property(p => p.StartDate)
                .IsRequired();

            builder.Property(p => p.Deadline)
                .IsRequired();

            // Progress
            builder.Property(p => p.ProgressPercentage)
                .HasPrecision(5, 2)
                .HasDefaultValue(0);

            // Timestamps
            builder.Property(p => p.CreatedAt)
                .IsRequired();

            builder.Property(p => p.UpdatedAt)
                .IsRequired(false);

            builder.Property(p => p.CompletedAt)
                .IsRequired(false);

            builder.Property(p => p.ArchivedAt)
                .IsRequired(false);

            // Indexes
            builder.HasIndex(p => p.Name)
                .IsUnique();

            builder.HasIndex(p => p.StatusId);

            builder.HasIndex(p => p.ManagerId);

            builder.HasIndex(p => p.TeamId);

            // Status transitions are configured separately
            // through ProjectStatusTransition.
        }
    }
}