using AI_PMS.Application.Interfaces.Data;

using AI_PMS.Domain.Entities.AISettings;
using AI_PMS.Domain.Entities.Activities;
using AI_PMS.Domain.Entities.Auth;
using AI_PMS.Domain.Entities.Communication;
using AI_PMS.Domain.Entities.DashboardSettings;
using AI_PMS.Domain.Entities.Notifications;
using AI_PMS.Domain.Entities.NotificationSettings;
using AI_PMS.Domain.Entities.Permissions;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Risks;
using AI_PMS.Domain.Entities.SecuritySettings;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.SubTasks;
using AI_PMS.Domain.Entities.SystemSettings;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Domain.Entities.Users;
using AI_PMS.Domain.Entities.UserPreferences;
using AI_PMS.Domain.Entities.TaskComments;
using AI_PMS.Domain.Entities.TaskSubmissions;

using AI_PMS.Infrastructure.Configurations.Activities;

using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // =========================================================
        // USERS / AUTH
        // =========================================================

        public DbSet<User> Users => Set<User>();

        public DbSet<RefreshToken> RefreshTokens =>
            Set<RefreshToken>();

        // =========================================================
        // TEAMS
        // =========================================================

        public DbSet<Team> Teams =>
            Set<Team>();

        public DbSet<TeamMember> TeamMembers =>
            Set<TeamMember>();

        public DbSet<TeamMemberRequest> TeamMemberRequests =>
            Set<TeamMemberRequest>();

        public DbSet<ContributorType> ContributorTypes =>
            Set<ContributorType>();

        public DbSet<ContributorSubType> ContributorSubTypes =>
            Set<ContributorSubType>();

        // =========================================================
        // PROJECTS
        // =========================================================

        public DbSet<Project> Projects =>
            Set<Project>();

        public DbSet<ProjectSpecification> ProjectSpecifications =>
            Set<ProjectSpecification>();

        public DbSet<ProjectStatusDefinition> ProjectStatusDefinitions =>
            Set<ProjectStatusDefinition>();

        public DbSet<ProjectStatusTransition> ProjectStatusTransitions =>
            Set<ProjectStatusTransition>();

        // =========================================================
        // SPRINTS / TASKS
        // =========================================================

        public DbSet<Sprint> Sprints =>
            Set<Sprint>();

        public DbSet<TaskItem> Tasks =>
            Set<TaskItem>();

        public DbSet<SubTask> SubTasks =>
            Set<SubTask>();
        public DbSet<TaskComment> TaskComments { get; set; }
        public DbSet<TaskSubmission> TaskSubmissions { get; set; }
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
        // ACTIVITIES / AUDIT
        // =========================================================

        public DbSet<ActivityLog> ActivityLogs { get; set; } = null!;

        public DbSet<AuditLog> AuditLogs { get; set; } = null!;

        // =========================================================
        // COMMUNICATION
        // =========================================================

        public DbSet<Message> Messages =>
            Set<Message>();

        public DbSet<MessageMention> MessageMentions =>
            Set<MessageMention>();

        public DbSet<ProjectAnnouncement>
    ProjectAnnouncements { get; set; }

public DbSet<ProjectAnnouncementRecipient>
    ProjectAnnouncementRecipients { get; set; }
        // =========================================================
        // NOTIFICATIONS
        // =========================================================

        public DbSet<Notification> Notifications =>
            Set<Notification>();

        public DbSet<NotificationType> NotificationTypes =>
            Set<NotificationType>();

        public DbSet<NotificationSetting> NotificationSettings { get; set; } = null!;

        // =========================================================
        // RISKS
        // =========================================================

        public DbSet<RiskIssue> RiskIssues =>
            Set<RiskIssue>();

        // =========================================================
        // SYSTEM / SECURITY SETTINGS
        // =========================================================

        public DbSet<SystemSetting> SystemSettings =>
            Set<SystemSetting>();

        public DbSet<SecuritySetting> SecuritySettings { get; set; } = null!;

        // =========================================================
        // USER PREFERENCES
        // =========================================================

        public DbSet<DashboardPreference> DashboardPreferences =>
            Set<DashboardPreference>();
            public DbSet<DashboardPreferenceWidget> DashboardPreferenceWidgets =>
    Set<DashboardPreferenceWidget>();
    public DbSet<AIPreference> AIPreferences =>
    Set<AIPreference>();
    
    public DbSet<CustomTheme> CustomThemes =>
    Set<CustomTheme>();
        

    
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
                        
                        // =========================================================
// DASHBOARD PREFERENCE WIDGETS
// =========================================================

modelBuilder.Entity<DashboardPreferenceWidget>(entity =>
{
    entity.ToTable("DashboardPreferenceWidgets");

    entity.HasKey(x => x.Id);

    entity.Property(x => x.WidgetKey)
        .IsRequired()
        .HasMaxLength(100);

    entity.Property(x => x.IsVisible)
        .IsRequired();

    entity.Property(x => x.DisplayOrder)
        .IsRequired();

    entity.HasOne(x => x.DashboardPreference)
        .WithMany(x => x.Widgets)
        .HasForeignKey(x => x.DashboardPreferenceId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasIndex(x => new
    {
        x.DashboardPreferenceId,
        x.WidgetKey
    })
    .IsUnique();

    entity.HasIndex(x => new
    {
        x.DashboardPreferenceId,
        x.DisplayOrder
    });
});
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

            modelBuilder.Entity<UserPermission>()
                .HasIndex(up => new
                {
                    up.UserId,
                    up.PermissionId
                })
                .IsUnique();

            // =====================================================
            // PROJECT -> SPECIFICATION
            // ONE PROJECT = ONE SPECIFICATION
            // =====================================================

            modelBuilder.Entity<ProjectSpecification>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.HasIndex(x => x.ProjectId)
                    .IsUnique();

                entity.HasOne(x => x.Project)
                    .WithOne(p => p.Specification)
                    .HasForeignKey<ProjectSpecification>(
                        x => x.ProjectId)
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

            // =====================================================
            // TEAM -> MANAGER
            // =====================================================

            modelBuilder.Entity<Team>()
                .HasOne(t => t.Manager)
                .WithMany()
                .HasForeignKey(t => t.ManagerId)
                .OnDelete(DeleteBehavior.SetNull);

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
            // TEAM MEMBER UNIQUE
            // =====================================================

            modelBuilder.Entity<TeamMember>()
                .HasIndex(tm => new
                {
                    tm.TeamId,
                    tm.UserId
                })
                .IsUnique();
                modelBuilder.Entity<MessageMention>(b =>
{
    b.HasKey(x => x.Id);

    b.HasOne(x => x.Message)
        .WithMany()
        .HasForeignKey(x => x.MessageId)
        .OnDelete(DeleteBehavior.Cascade);

    b.HasOne(x => x.TaskComment)
        .WithMany(x => x.Mentions)
        .HasForeignKey(x => x.TaskCommentId)
        .OnDelete(DeleteBehavior.Cascade);

    b.HasOne(x => x.MentionedUser)
        .WithMany()
        .HasForeignKey(x => x.MentionedUserId)
        .OnDelete(DeleteBehavior.Restrict);

    b.HasIndex(x => x.MessageId);

    b.HasIndex(x => x.TaskCommentId);

    b.HasIndex(x => x.MentionedUserId);
});

            // =====================================================
            // TEAM MEMBER REQUEST
            // ONLY ONE CONFIGURATION
            // =====================================================

            modelBuilder.Entity<TeamMemberRequest>(entity =>
            {
                entity.ToTable("TeamMemberRequests");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Status)
                    .HasConversion<int>()
                    .IsRequired();

                entity.Property(x => x.RequestType)
                    .HasConversion<int>()
                    .IsRequired();

                entity.Property(x => x.Reason)
                    .HasMaxLength(1000);

                entity.Property(x => x.ReviewComment)
                    .HasMaxLength(1000);

                entity.Property(x => x.CreatedAt)
                    .IsRequired();

                entity.HasOne(x => x.Team)
                    .WithMany()
                    .HasForeignKey(x => x.TeamId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(x => new
                {
                    x.TeamId,
                    x.UserId,
                    x.Status,
                    x.RequestType
                });
            });
 modelBuilder.Entity<ProjectAnnouncement>(entity =>
{
    entity.ToTable("ProjectAnnouncements");

    entity.HasKey(x => x.Id);

    entity.Property(x => x.Title)
        .IsRequired()
        .HasMaxLength(200);

    entity.Property(x => x.Message)
        .IsRequired()
        .HasMaxLength(5000);

    entity.HasOne(x => x.Project)
        .WithMany()
        .HasForeignKey(x => x.ProjectId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasOne(x => x.Team)
        .WithMany()
        .HasForeignKey(x => x.TeamId)
        .OnDelete(DeleteBehavior.SetNull);

    entity.HasOne(x => x.Sender)
        .WithMany()
        .HasForeignKey(x => x.SenderId)
        .OnDelete(DeleteBehavior.Restrict);

    entity.HasMany(x => x.Recipients)
        .WithOne(x => x.Announcement)
        .HasForeignKey(x => x.AnnouncementId)
        .OnDelete(DeleteBehavior.Cascade);
});


modelBuilder.Entity<ProjectAnnouncementRecipient>(entity =>
{
    entity.ToTable("ProjectAnnouncementRecipients");

    entity.HasKey(x => x.Id);

    entity.HasOne(x => x.RecipientUser)
        .WithMany()
        .HasForeignKey(x => x.RecipientUserId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasIndex(x => new
    {
        x.AnnouncementId,
        x.RecipientUserId
    })
    .IsUnique();
});

           // =========================================================
// USER → NOTIFICATION SETTING
// ONE USER HAS ONE NOTIFICATION SETTING
// =========================================================

modelBuilder.Entity<NotificationSetting>()
    .HasOne(ns => ns.User)
    .WithOne()
    .HasForeignKey<NotificationSetting>(
        ns => ns.UserId)
    .OnDelete(DeleteBehavior.Cascade);

modelBuilder.Entity<NotificationSetting>()
    .HasIndex(ns => ns.UserId)
    .IsUnique();
            // =====================================================
            // SPRINT -> PROJECT
            // =====================================================

            modelBuilder.Entity<Sprint>()
                .HasOne<Project>()
                .WithMany()
                .HasForeignKey(s => s.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

                // =========================================================
// CUSTOM THEME
// ONE USER CAN HAVE MANY CUSTOM THEMES
// =========================================================

modelBuilder.Entity<CustomTheme>(entity =>
{
    entity.HasKey(x => x.Id);

    entity.HasOne(x => x.User)
        .WithMany()
        .HasForeignKey(x => x.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.Property(x => x.Name)
        .IsRequired()
        .HasMaxLength(100);

    entity.Property(x => x.PrimaryColor)
        .IsRequired()
        .HasMaxLength(20);

    entity.Property(x => x.BackgroundColor)
        .IsRequired()
        .HasMaxLength(20);

    entity.Property(x => x.SidebarColor)
        .IsRequired()
        .HasMaxLength(20);

    entity.Property(x => x.TextColor)
        .IsRequired()
        .HasMaxLength(20);

    entity.HasIndex(x => new
    {
        x.UserId,
        x.Name
    })
    .IsUnique();
});

            // =====================================================
            // TASK -> SPRINT
            // =====================================================

            modelBuilder.Entity<TaskItem>()
                .HasOne<Sprint>()
                .WithMany()
                .HasForeignKey(t => t.SprintId)
                .OnDelete(DeleteBehavior.Cascade);
                     
                     // =====================================================
// DASHBOARD PREFERENCE
// ONE USER = ONE DASHBOARD PREFERENCE
// =====================================================

modelBuilder.Entity<DashboardPreference>(entity =>
{
    entity.ToTable("DashboardPreferences");

    entity.HasKey(x => x.Id);

    entity.HasIndex(x => x.UserId)
        .IsUnique();

    entity.HasOne(x => x.User)
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
            // =====================================================
            // AI PREFERENCE
            // =====================================================

           
           
           
           
           
           
           
           
           
           
           
           
           
           
           
           
           
        // =====================================================
// AI PREFERENCE
// =====================================================

modelBuilder.Entity<AIPreference>(entity =>
{
    entity.HasKey(x => x.Id);

    // One AI preference record per user
    entity.HasIndex(x => x.UserId)
        .IsUnique();

    // =====================================================
    // GENERAL AI CONFIGURATION
    // =====================================================

    entity.Property(x => x.SuggestionApprovalMode)
        .IsRequired()
        .HasMaxLength(50);

    entity.Property(x => x.AnalysisFrequencyMinutes)
        .IsRequired();

    // =====================================================
    // MANAGER AI PREFERENCES
    // =====================================================

    entity.Property(x => x.SummaryFrequencyMinutes)
        .IsRequired();

    entity.Property(x => x.AINotificationPriority)
        .IsRequired()
        .HasMaxLength(20);

    // =====================================================
    // AUDIT
    // =====================================================

    entity.Property(x => x.CreatedAt)
        .IsRequired();

    entity.Property(x => x.UpdatedAt)
        .IsRequired();

    // =====================================================
    // USER RELATIONSHIP
    // =====================================================

    entity.HasOne(x => x.User)
        .WithOne()
        .HasForeignKey<AIPreference>(x => x.UserId)
        .OnDelete(DeleteBehavior.Cascade);
});

            // =====================================================
            // AUTOMATIC ENTITY CONFIGURATIONS
            // =====================================================

            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(ApplicationDbContext).Assembly);

            // =====================================================
            // ACTIVITY LOG
            // =====================================================

            modelBuilder.ApplyConfiguration(
                new ActivityLogConfiguration());

            // =====================================================
            // AUDIT LOG
            // =====================================================

            modelBuilder.ApplyConfiguration(
                new AuditLogConfiguration());
        }
    }
}