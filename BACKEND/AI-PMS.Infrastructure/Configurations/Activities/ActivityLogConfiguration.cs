using AI_PMS.Domain.Entities.Activities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AI_PMS.Infrastructure.Configurations.Activities
{
    public class ActivityLogConfiguration
        : IEntityTypeConfiguration<ActivityLog>
    {
        public void Configure(
            EntityTypeBuilder<ActivityLog> builder)
        {
            builder.ToTable("ActivityLogs");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.UserId)
                .IsRequired();

            builder.Property(a => a.Action)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(a => a.ActivityType)
                .HasMaxLength(100);

            builder.Property(a => a.EntityType)
                .HasMaxLength(100);

            builder.Property(a => a.Description)
                .HasMaxLength(2000);

            builder.Property(a => a.CreatedAt)
                .IsRequired();

            // Indexes for report/activity filtering
            builder.HasIndex(a => a.UserId);

            builder.HasIndex(a => a.CreatedAt);

            builder.HasIndex(a => a.EntityId);

            builder.HasIndex(a => a.ActivityType);
        }
    }
}