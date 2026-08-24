using AI_PMS.Domain.Entities.Activities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AI_PMS.Infrastructure.Configurations.Activities
{
    public class AuditLogConfiguration
        : IEntityTypeConfiguration<AuditLog>
    {
        public void Configure(
            EntityTypeBuilder<AuditLog> builder)
        {
            builder.ToTable("AuditLogs");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.UserId)
                .IsRequired();

            builder.Property(a => a.Action)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.EntityType)
                .HasMaxLength(100);

            builder.Property(a => a.Description)
                .HasMaxLength(2000);

            builder.Property(a => a.IpAddress)
                .HasMaxLength(100);

            builder.Property(a => a.UserAgent)
                .HasMaxLength(500);

            builder.Property(a => a.CreatedAt)
                .IsRequired();

            builder.HasIndex(a => a.UserId);

            builder.HasIndex(a => a.CreatedAt);

            builder.HasIndex(a => a.EntityId);

            builder.HasIndex(a => a.Action);
        }
    }
}