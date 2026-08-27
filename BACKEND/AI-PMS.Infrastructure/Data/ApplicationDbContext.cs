
using AI_PMS.Domain.Entities.Users;
using AI_PMS.Domain.Entities.Auth;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Domain.Entities.Permissions;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Entities.SubTasks;
using AI_PMS.Domain.Entities.Activities;
using AI_PMS.Domain.Entities.SystemSettings;
using AI_PMS.Domain.Entities.SecuritySettings;
using AI_PMS.Infrastructure.Configurations.Activities;
using AI_PMS.Domain.Entities.NotificationSettings;
using AI_PMS.Domain.Entities.AISettings;
using AI_PMS.Domain.Entities.DashboardSettings;
using AI_PMS.Application.Interfaces.Data;
using AI_PMS.Domain.Entities.Communication;
using AI_PMS.Domain.Entities.Notifications;
using AI_PMS.Domain.Entities.Risks;



using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Data
{public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // =========================================================
        // TABLES
        // =========================================================

        public DbSet<User> Users =>
            Set<User>();

        public DbSet<RefreshToken> RefreshTokens =>
            Set<RefreshToken>();

        public DbSet<Sprint> Sprints =>
            Set<Sprint>();

        public DbSet<TaskItem> Tasks =>
            Set<TaskItem>();

        public DbSet<SubTask> SubTasks =>
        
            Set<SubTask>();

        public DbSet<Team> Teams =>
            Set<Team>();

        public DbSet<TeamMember> TeamMembers =>
            Set<TeamMember>();
            public DbSet<TeamMemberRequest> TeamMemberRequests =>
    Set<TeamMemberRequest>();
    public DbSet<Message> Messages =>
    Set<Message>();

public DbSet<MessageMention> MessageMentions =>
    Set<MessageMention>();

public DbSet<Notification> Notifications =>
    Set<Notification>();

public DbSet<NotificationType> NotificationTypes =>
    Set<NotificationType>();

public DbSet<RiskIssue> RiskIssues =>
    Set<RiskIssue>();

        public DbSet<ActivityLog> ActivityLogs { get; set; } = null!;

        public DbSet<AuditLog> AuditLogs { get; set; } = null!;

        // =========================================================
        // CONTRIBUTOR TYPE TABLES
        // =========================================================

        public DbSet<ContributorType> ContributorTypes =>
            Set<ContributorType>();

        public DbSet<ContributorSubType> ContributorSubTypes =>
            Set<ContributorSubType>();

        // =========================================================
        // SYSTEM SETTINGS
        // =========================================================

        public DbSet<SystemSetting> SystemSettings =>
            Set<SystemSetting>();

        public DbSet<NotificationSetting> NotificationSettings { get; set; } = null!;

        public DbSet<SecuritySetting> SecuritySettings { get; set; } = null!;

      

      
        // =========================================================
        // PERMISSIONS
        // =========================================================

        public DbSet<Permission> Permissions =>
            Set<Permission>();

        public DbSet<RolePermission> RolePermissions =>
            Set<RolePermission>();

        public DbSet<UserPermission> UserPermissions =>
            Set<UserPermission>();

        // =========================================================
        // PROJECTS
        // =========================================================

        public DbSet<Project> Projects { get; set; } = null!;

        public DbSet<ProjectSpecification> ProjectSpecifications { get; set; } = null!;  
        public DbSet<ProjectStatusDefinition> ProjectStatusDefinitions
        {
            get;
            set;
        } = null!;

        public DbSet<ProjectStatusTransition> ProjectStatusTransitions
        {
            get;
            set;
        } = null!;
     
        // =========================================================
        // MODEL CONFIGURATION
        // =========================================================

        protected override void OnModelCreating(
            ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =====================================================
            // CONTRIBUTOR TYPE SEED
            // =====================================================

            ContributorTypeSeed.Seed(modelBuilder);
           

            // =====================================================
            // USER
            // =====================================================

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.PhoneNumber)
                .IsUnique();

            // =====================================================
            // USER -> CONTRIBUTOR TYPE
            // =====================================================

            modelBuilder.Entity<User>()
                .HasOne(u => u.ContributorType)
                .WithMany()
                .HasForeignKey(u => u.ContributorTypeId)
                .OnDelete(DeleteBehavior.SetNull);

            // =====================================================
            // USER -> CONTRIBUTOR SUBTYPE
            // =====================================================

            modelBuilder.Entity<User>()
                .HasOne(u => u.ContributorSubType)
                .WithMany()
                .HasForeignKey(u => u.ContributorSubTypeId)
                .OnDelete(DeleteBehavior.SetNull);

            // =====================================================
            // REFRESH TOKEN -> USER
            // =====================================================

            modelBuilder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // =====================================================
            // CONTRIBUTOR TYPE
            // =====================================================

            modelBuilder.Entity<ContributorType>()
                .HasIndex(ct => ct.Name)
                .IsUnique();

            // =====================================================
            // CONTRIBUTOR SUBTYPE
            // =====================================================

            modelBuilder.Entity<ContributorSubType>()
                .HasIndex(cst => new
                {
                    cst.ContributorTypeId,
                    cst.Name
                })
                .IsUnique();

            // =====================================================
            // CONTRIBUTOR TYPE -> SUBTYPES
            // =====================================================

            modelBuilder.Entity<ContributorSubType>()
                .HasOne(cst => cst.ContributorType)
                .WithMany(ct => ct.SubTypes)
                .HasForeignKey(cst => cst.ContributorTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // PERMISSION
            // =====================================================

            modelBuilder.Entity<Permission>()
                .HasIndex(p => p.Name)
                .IsUnique();

            // =====================================================
            // ROLE -> PERMISSION
            // =====================================================

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Prevent the same permission from being assigned
            // to the same role more than once.

            modelBuilder.Entity<RolePermission>()
                .HasIndex(rp => new
                {
                    rp.Role,
                    rp.PermissionId
                })
                .IsUnique();

            // =====================================================
            // USER -> PERMISSION
            // =====================================================

            modelBuilder.Entity<UserPermission>()
                .HasOne(up => up.User)
                .WithMany()
                .HasForeignKey(up => up.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserPermission>()
                .HasOne(up => up.Permission)
                .WithMany(p => p.UserPermissions)
                .HasForeignKey(up => up.PermissionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Prevent duplicate user-specific permission overrides.

            modelBuilder.Entity<UserPermission>()
                .HasIndex(up => new
                {
                    up.UserId,
                    up.PermissionId
                })
                .IsUnique();
              
                // =====================================================
// PROJECT -> PROJECT SPECIFICATION
// ONE PROJECT HAS ONE SPECIFICATION
// =====================================================

modelBuilder.Entity<ProjectSpecification>(entity =>
{
    entity.HasKey(x => x.Id);

    entity.HasIndex(x => x.ProjectId)
        .IsUnique();

    entity.HasOne(x => x.Project)
        .WithOne(p => p.Specification)
        .HasForeignKey<ProjectSpecification>(x => x.ProjectId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.Property(x => x.Objectives)
        .IsRequired()
        .HasMaxLength(5000);

    entity.Property(x => x.Scope)
        .IsRequired()
        .HasMaxLength(5000);

    entity.Property(x => x.FunctionalRequirements)
        .IsRequired()
        .HasMaxLength(10000);

    entity.Property(x => x.NonFunctionalRequirements)
        .IsRequired()
        .HasMaxLength(10000);

    entity.Property(x => x.Deliverables)
        .IsRequired()
        .HasMaxLength(5000);

    entity.Property(x => x.TechnologyStack)
        .IsRequired()
        .HasMaxLength(2000);

    entity.Property(x => x.Assumptions)
        .HasMaxLength(5000);

    entity.Property(x => x.Constraints)
        .HasMaxLength(5000);
});
modelBuilder.Entity<TeamMemberRequest>(entity =>
{
    entity.ToTable("TeamMemberRequests");

    entity.HasKey(e => e.Id);

    entity.Property(e => e.Reason)
        .HasMaxLength(1000);

    entity.Property(e => e.ReviewComment)
        .HasMaxLength(1000);

    entity.Property(e => e.Status)
        .HasConversion<int>()
        .IsRequired();

    entity.Property(e => e.RequestType)
        .HasConversion<int>()
        .IsRequired();

    entity.Property(e => e.CreatedAt)
        .IsRequired();

    entity.HasIndex(e => new
    {
        e.TeamId,
        e.UserId,
        e.Status,
        e.RequestType
    });

    entity.HasOne(e => e.Team)
        .WithMany()
        .HasForeignKey(e => e.TeamId)
        .OnDelete(DeleteBehavior.Cascade);
});
            // =====================================================
            // SPRINT -> PROJECT
            // =====================================================

            modelBuilder.Entity<Sprint>()
                .HasOne<Project>()
                .WithMany()
                .HasForeignKey(s => s.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // =====================================================
            // TASK -> SPRINT
            // =====================================================

            modelBuilder.Entity<TaskItem>()
                .HasOne<Sprint>()
                .WithMany()
                .HasForeignKey(t => t.SprintId)
                .OnDelete(DeleteBehavior.Cascade);

            // =====================================================
            // TEAM -> MANAGER
            // =====================================================

            modelBuilder.Entity<Team>()
                .HasOne(t => t.Manager)
                .WithMany()
                .HasForeignKey(t => t.ManagerId)
                .OnDelete(DeleteBehavior.SetNull);

            // =====================================================
            // TEAM MEMBER -> CONTRIBUTOR TYPE
            // =====================================================

            modelBuilder.Entity<TeamMember>()
                .HasOne(tm => tm.ContributorType)
                .WithMany(ct => ct.TeamMembers)
                .HasForeignKey(tm => tm.ContributorTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // TEAM MEMBER -> CONTRIBUTOR SUBTYPE
            // =====================================================

           modelBuilder.Entity<TeamMember>()
    .HasOne(tm => tm.ContributorSubType)
    .WithMany(cst => cst.TeamMembers)
    .HasForeignKey(tm => tm.ContributorSubTypeId)
    .OnDelete(DeleteBehavior.Restrict);

            // =====================================================
            // TEAM NAME UNIQUE
            // =====================================================

            modelBuilder.Entity<Team>()
                .HasIndex(t => t.Name)
                .IsUnique();

            // =====================================================
            // TEAM MEMBER -> TEAM
            // =====================================================

            modelBuilder.Entity<TeamMember>()
                .HasOne(tm => tm.Team)
                .WithMany(t => t.TeamMembers)
                .HasForeignKey(tm => tm.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            // =====================================================
            // TEAM MEMBER -> USER
            // =====================================================

            modelBuilder.Entity<TeamMember>()
                .HasOne(tm => tm.User)
                .WithMany()
                .HasForeignKey(tm => tm.UserId)
                .OnDelete(DeleteBehavior.Restrict);

                // =====================================================
// TEAM MEMBER REQUEST
// =====================================================

modelBuilder.Entity<TeamMemberRequest>(entity =>
{
    entity.HasKey(x => x.Id);

    entity.Property(x => x.Status)
        .HasConversion<int>()
        .IsRequired();

    entity.Property(x => x.Reason)
        .HasMaxLength(1000);

    entity.Property(x => x.ReviewComment)
        .HasMaxLength(1000);

    // -------------------------------------------------
    // TEAM
    // -------------------------------------------------

    entity.HasOne(x => x.Team)
        .WithMany()
        .HasForeignKey(x => x.TeamId)
        .OnDelete(DeleteBehavior.Cascade);

    // -------------------------------------------------
    // PREVENT DUPLICATE PENDING REQUESTS
    // -------------------------------------------------

    entity.HasIndex(x => new
    {
        x.TeamId,
        x.UserId,
        x.Status
    });
});

            // =====================================================
            // PREVENT DUPLICATE TEAM MEMBERS
            // =====================================================

            modelBuilder.Entity<TeamMember>()
                .HasIndex(tm => new
                {
                    tm.TeamId,
                    tm.UserId
                })
                .IsUnique();

            // =====================================================
            // AUTOMATIC CONFIGURATIONS
            // =====================================================

            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(ApplicationDbContext).Assembly);

            // =====================================================
            // ACTIVITY LOG CONFIGURATION
            // =====================================================

            modelBuilder.ApplyConfiguration(
                new ActivityLogConfiguration());

            // =====================================================
            // AUDIT LOG CONFIGURATION
            // =====================================================

            modelBuilder.ApplyConfiguration(
                new AuditLogConfiguration());

            // =====================================================
            // USER PREFERENCE UNIQUE INDEXES
            // =====================================================

          // =========================================================
// DASHBOARD PREFERENCE
// =========================================================

modelBuilder.Entity<DashboardPreference>(entity =>
{
    entity.HasKey(x => x.Id);

    entity.HasIndex(x => x.UserId)
        .IsUnique();

    entity.HasOne<User>()
        .WithOne()
        .HasForeignKey<DashboardPreference>(x => x.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.Property(x => x.DefaultView)
        .IsRequired()
        .HasMaxLength(50);

    entity.Property(x => x.DefaultFilter)
        .IsRequired()
        .HasMaxLength(50);
});

// =========================================================
// AI PREFERENCE
// =========================================================

modelBuilder.Entity<AIPreference>(entity =>
{
    entity.HasKey(x => x.Id);

    entity.HasIndex(x => x.UserId)
        .IsUnique();

    entity.Property(x => x.SuggestionApprovalMode)
        .IsRequired()
        .HasMaxLength(50);

    entity.HasOne(x => x.User)
        .WithOne()
        .HasForeignKey<AIPreference>(x => x.UserId)
        .OnDelete(DeleteBehavior.Cascade);
});
        }
    }
}
