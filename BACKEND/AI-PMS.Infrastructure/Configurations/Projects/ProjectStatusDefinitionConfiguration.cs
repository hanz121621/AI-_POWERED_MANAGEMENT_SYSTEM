
using AI_PMS.Domain.Entities.Projects;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AI_PMS.Infrastructure.Configurations.Projects
{
    public class ProjectStatusDefinitionConfiguration
        : IEntityTypeConfiguration<ProjectStatusDefinition>
    {
        public void Configure(
            EntityTypeBuilder<ProjectStatusDefinition> builder)
        {
            builder.ToTable("ProjectStatusDefinitions");

            // Primary Key
            builder.HasKey(s => s.Id);

            // Status Name
            builder.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(100);

            // Description
            builder.Property(s => s.Description)
                .HasMaxLength(500);

            // Configuration flags
            builder.Property(s => s.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(s => s.DisplayOrder)
                .IsRequired();

            builder.Property(s => s.IsInitialStatus)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(s => s.IsCompletedStatus)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(s => s.IsArchivedStatus)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(s => s.IsCancelledStatus)
                .IsRequired()
                .HasDefaultValue(false);

            // Timestamps
            builder.Property(s => s.CreatedAt)
                .IsRequired();

            builder.Property(s => s.UpdatedAt)
                .IsRequired(false);

            // Indexes
            builder.HasIndex(s => s.Name)
                .IsUnique();

            builder.HasIndex(s => s.DisplayOrder);

            builder.HasIndex(s => s.IsActive);

            builder.HasIndex(s => s.IsInitialStatus);
        }
    }
}