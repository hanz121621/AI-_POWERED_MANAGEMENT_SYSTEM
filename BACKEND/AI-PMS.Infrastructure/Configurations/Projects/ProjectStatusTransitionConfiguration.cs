
using AI_PMS.Domain.Entities.Projects;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AI_PMS.Infrastructure.Configurations.Projects
{
    public class ProjectStatusTransitionConfiguration
        : IEntityTypeConfiguration<ProjectStatusTransition>
    {
        public void Configure(
            EntityTypeBuilder<ProjectStatusTransition> builder)
        {
            builder.ToTable("ProjectStatusTransitions");

            // Primary Key
            builder.HasKey(t => t.Id);

            // From Status
            builder.Property(t => t.FromStatusId)
                .IsRequired();

            // To Status
            builder.Property(t => t.ToStatusId)
                .IsRequired();

            // Is Allowed
            builder.Property(t => t.IsAllowed)
                .IsRequired()
                .HasDefaultValue(true);

            // Description
            builder.Property(t => t.Description)
                .HasMaxLength(500);

            // Timestamps
            builder.Property(t => t.CreatedAt)
                .IsRequired();

            builder.Property(t => t.UpdatedAt)
                .IsRequired(false);

            // =====================================================
            // FROM STATUS
            // =====================================================

            builder.HasOne(t => t.FromStatus)
                .WithMany(s => s.FromTransitions)
                .HasForeignKey(t => t.FromStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // TO STATUS
            // =====================================================

            builder.HasOne(t => t.ToStatus)
                .WithMany(s => s.ToTransitions)
                .HasForeignKey(t => t.ToStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // INDEXES
            // =====================================================

            builder.HasIndex(t => new
            {
                t.FromStatusId,
                t.ToStatusId
            })
            .IsUnique();

            builder.HasIndex(t => t.FromStatusId);

            builder.HasIndex(t => t.ToStatusId);

            builder.HasIndex(t => t.IsAllowed);
        }
    }
}