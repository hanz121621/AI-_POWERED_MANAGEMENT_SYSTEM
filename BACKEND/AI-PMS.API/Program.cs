
using System.Text;

using MediatR;
using System.Security.Claims;

using AI_PMS.API.Authorization;
using AI_PMS.API.Services;

using AI_PMS.Application.DTOs.Auth;
using AI_PMS.Application.Interfaces.AI;
using AI_PMS.Infrastructure.AI.Configuration;
using AI_PMS.Infrastructure.AI.Services;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Auth;
using AI_PMS.Application.Interfaces.Communication;
using AI_PMS.Application.Interfaces.Contributors;
using AI_PMS.Application.Interfaces.Data;
using AI_PMS.Application.Interfaces.NotificationSettings;
using AI_PMS.Application.Interfaces.Permissions;
using AI_PMS.Application.Interfaces.Preferences;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Application.Interfaces.Repositories.Activities;
using AI_PMS.Application.Interfaces.Repositories.Auth;
using AI_PMS.Application.Interfaces.Repositories.Communication;
using AI_PMS.Application.Interfaces.Repositories.Contributors;
using AI_PMS.Application.Interfaces.Repositories.NotificationSettings;
using AI_PMS.Application.Interfaces.Repositories.Permissions;
using AI_PMS.Application.Interfaces.Repositories.Projects;
using AI_PMS.Application.Interfaces.Notifications;
using AI_PMS.Application.Interfaces.Repositories.Notifications;
using AI_PMS.Application.Services.Notifications;
using AI_PMS.Application.Interfaces.Repositories.Reports;
using AI_PMS.Application.Interfaces.Reports;
using AI_PMS.Application.Services.Reports;
using AI_PMS.Infrastructure.Repositories.Reports;
using AI_PMS.Infrastructure.Repositories.Notifications;
using AI_PMS.Application.Interfaces.Repositories.SecuritySettings;
using AI_PMS.Application.Interfaces.Repositories.SubTasks;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Repositories.Sprints;
using AI_PMS.Application.Interfaces.Repositories.UserPreferences;
using AI_PMS.Application.Interfaces.Security;
using AI_PMS.Application.Interfaces.SecuritySettings;
using AI_PMS.Application.Interfaces.Sprints;
using AI_PMS.Application.Interfaces.SubTasks;
using AI_PMS.Application.Interfaces.SystemSettings;
using AI_PMS.Application.Interfaces.Tasks;
using AI_PMS.Application.Interfaces.Teams;
using AI_PMS.Application.Interfaces.UserPreferences;
using AI_PMS.Application.Interfaces.Users;

using AI_PMS.Application.Services.Teams;

using AI_PMS.Application.Services.Activities;
using AI_PMS.Application.Services.Auth;
using AI_PMS.Application.Services.Communication;
using AI_PMS.Application.Services.Contributors;
using AI_PMS.Application.Services.NotificationSettings;
using AI_PMS.Application.Services.Permissions;
using AI_PMS.Application.Services.Preferences;
using AI_PMS.Application.Services.Projects;
using AI_PMS.Application.Services.SecuritySettings;
using AI_PMS.Application.Services.Sprints;

using AI_PMS.Application.Services.SystemSettings;
using AI_PMS.Application.Services.Tasks;
using AI_PMS.Application.Services.UserPreferences;
using AI_PMS.Application.Services.Users;

using AI_PMS.Application.Interfaces.Repositories.TaskComments;
using AI_PMS.Application.Interfaces.TaskComments;
using AI_PMS.Application.Services.TaskComments;
using AI_PMS.Application.Interfaces.Repositories.TaskSubmissions;
using AI_PMS.Application.Interfaces.TaskSubmissions;
using AI_PMS.Application.Services.TaskSubmissions;


using AI_PMS.Application.Users.Commands.CreateUser;
using AI_PMS.Application.Validators.SystemSettings;

using AI_PMS.Domain.Enums;

using AI_PMS.Infrastructure.Data;
using AI_PMS.Infrastructure.Repositories.Activities;
using AI_PMS.Infrastructure.Repositories.Auth;
using AI_PMS.Infrastructure.Repositories.Communication;
using AI_PMS.Infrastructure.Repositories.Contributors;
using AI_PMS.Infrastructure.Repositories.Permissions;
using AI_PMS.Infrastructure.Repositories.Projects;
using AI_PMS.Infrastructure.Repositories.SecuritySettings;
using AI_PMS.Infrastructure.Repositories.Sprints;
using AI_PMS.Infrastructure.Repositories.SubTasks;
using AI_PMS.Infrastructure.Repositories.SystemSettings;
using AI_PMS.Infrastructure.Repositories.Tasks;
using AI_PMS.Infrastructure.Repositories.Teams;
using AI_PMS.Infrastructure.Repositories.Users;
using AI_PMS.Infrastructure.Repositories.UserPreferences;
using AI_PMS.Infrastructure.Repositories.NotificationSettings;
using AI_PMS.Infrastructure.Security;
using AI_PMS.Infrastructure.Repositories.TaskComments;
using AI_PMS.Infrastructure.Repositories.TaskSubmissions;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using AI_PMS.Application.Services.AI;

var builder = WebApplication.CreateBuilder(args);

// =========================================================
// AI / OLLAMA
// =========================================================

builder.Services.AddHttpClient<IAiSuggestionService, AiSuggestionService>(
    client =>
    {
        client.BaseAddress =
            new Uri("http://localhost:11434");

        client.Timeout =
            TimeSpan.FromMinutes(120);
    });
    builder.Services.AddScoped<AI_PMS.Application.Interfaces.Repositories.AI.IAiSuggestionRepository, AI_PMS.Infrastructure.Repositories.AI.AiSuggestionRepository>();
// =========================================================
// DATABASE
// =========================================================
//builder.Services.AddScoped<AI_PMS.Application.Interfaces.AI.IAiProjectContextService, AI_PMS.Application.Services.AI.AiProjectContextService>();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IApplicationDbContext>(
    provider => provider.GetRequiredService<ApplicationDbContext>());

// =========================================================
// CONTROLLERS
// =========================================================

builder.Services.AddControllers();

builder.Services.AddMediatR(
    cfg => cfg.RegisterServicesFromAssembly(
        typeof(CreateUserCommand).Assembly));

// =========================================================
// SECURITY
// =========================================================

builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();

builder.Services.AddScoped<PasswordHasher>();
builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<RefreshTokenService>();

builder.Services.AddScoped<
    IContributorReportService,
    ContributorReportService>();

    builder.Services.AddScoped<
    ITeamLeaderProjectService,
    TeamLeaderProjectService>();


builder.Services.AddScoped<
    IProjectParticipationService,
    ProjectParticipationService>();

    builder.Services.AddScoped<ISprintService, SprintService>();

    // =========================================================
// TEAM LEADER SPRINT PARTICIPATION
// =========================================================

builder.Services.AddScoped<
    ITeamLeaderSprintRepository,
    TeamLeaderSprintRepository>();

builder.Services.AddScoped<
    ITeamLeaderSprintService,
    TeamLeaderSprintService>();

    builder.Services.AddScoped<
    ITeamLeaderTaskService,
    TeamLeaderTaskService>();

    builder.Services.AddScoped<
    IProjectParticipationRepository,
    ProjectParticipationRepository>();

// =========================================================
// AUTH REPOSITORIES
// =========================================================

builder.Services.AddScoped<
    IRefreshTokenRepository,
    RefreshTokenRepository>();

builder.Services.AddScoped<RefreshTokenRepository>();

// =========================================================
// USER MANAGEMENT
// =========================================================

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserRepository>();

builder.Services.AddScoped<IUserService, UserService>();

// =========================================================
// PERMISSION MANAGEMENT
// =========================================================

builder.Services.AddScoped<
    IPermissionRepository,
    PermissionRepository>();

builder.Services.AddScoped<
    IRolePermissionRepository,
    RolePermissionRepository>();

builder.Services.AddScoped<
    IUserPermissionRepository,
    UserPermissionRepository>();

builder.Services.AddScoped<
    IPermissionService,
    PermissionService>();

builder.Services.AddScoped<
    IRolePermissionService,
    RolePermissionService>();

builder.Services.AddScoped<
    AI_PMS.Application.Interfaces.Permissions.IUserPermissionService,
    UserPermissionService>();

builder.Services.AddScoped<PermissionRepository>();
builder.Services.AddScoped<RolePermissionRepository>();
builder.Services.AddScoped<UserPermissionRepository>();

// =========================================================
// AUTHENTICATION SERVICE
// =========================================================

builder.Services.AddScoped<IAuthService, AuthService>();

// =========================================================
// CONTRIBUTOR MANAGEMENT
// =========================================================

builder.Services.AddScoped<
    IContributorTypeRepository,
    ContributorTypeRepository>();

builder.Services.AddScoped<
    IContributorSubTypeRepository,
    ContributorSubTypeRepository>();

builder.Services.AddScoped<
    IContributorTypeService,
    ContributorTypeService>();

builder.Services.AddScoped<
    IContributorSubTypeService,
    ContributorSubTypeService>();

    builder.Services.AddScoped<
    ITeamLeaderTaskHistoryRepository,
    TeamLeaderTaskHistoryRepository>();

builder.Services.AddScoped<
    ITeamLeaderTaskHistoryService,
    TeamLeaderTaskHistoryService>();

// =========================================================
// TEAM MANAGEMENT
// =========================================================

builder.Services.AddScoped<ITeamRepository, TeamRepository>();

builder.Services.AddScoped<ITeamService, TeamService>();

builder.Services.AddScoped<
    ITeamMemberRequestRepository,
    TeamMemberRequestRepository>();

builder.Services.AddScoped<
    ITeamMemberRequestService,
    TeamMemberRequestService>();

builder.Services.AddScoped<
    ITeamLeaderWorkMonitoringRepository,
    TeamLeaderWorkMonitoringRepository>();

builder.Services.AddScoped<
    ITeamLeaderWorkMonitoringService,
    TeamLeaderWorkMonitoringService>();

// =========================================================
// PROJECT MANAGEMENT
// =========================================================

builder.Services.AddScoped<
    IProjectRepository,
    ProjectRepository>();

builder.Services.AddScoped<
    IProjectService,
    ProjectService>();

builder.Services.AddScoped<
    IProjectAssignmentService,
    ProjectAssignmentService>();

builder.Services.AddScoped<
    IProjectSpecificationRepository,
    ProjectSpecificationRepository>();

builder.Services.AddScoped<
    IProjectSpecificationService,
    ProjectSpecificationService>();

    builder.Services.AddScoped<
    IProjectService, ProjectService>();

builder.Services.AddScoped<
IProjectAssignmentService, 
ProjectAssignmentService>();

// =========================================================
// SPRINT MANAGEMENT
// =========================================================

builder.Services.AddScoped<
    ISprintRepository,
    SprintRepository>();

builder.Services.AddScoped<
    AI_PMS.Application.Interfaces.Repositories.Sprints.ISprintRepository,
    SprintRepository>();

// =========================================================
// TASK MANAGEMENT
// =========================================================

builder.Services.AddScoped<
    ITaskRepository,
    TaskRepository>();

builder.Services.AddScoped<
    ITaskService,
    TaskService>();

    builder.Services.AddScoped<
    ITeamLeaderTaskService,
    TeamLeaderTaskService>();


  builder.Services.AddScoped<
    ITaskCommentRepository,
    TaskCommentRepository>();

    builder.Services.AddScoped<
    ITaskCommentService,
    TaskCommentService>();

    builder.Services.AddScoped<
    ITaskSubmissionRepository,
    TaskSubmissionRepository>();

builder.Services.AddScoped<
    ITaskSubmissionService,
    TaskSubmissionService>();
// =========================================================
// SUBTASK MANAGEMENT
// =========================================================

builder.Services.AddScoped<
    ISubTaskRepository,
    SubTaskRepository>();

// =========================================================
// ACTIVITIES
// =========================================================

builder.Services.AddScoped<
    IActivityLogRepository,
    ActivityLogRepository>();

builder.Services.AddScoped<ActivityLogRepository>();

builder.Services.AddScoped<
    IActivityLogService,
    ActivityLogService>();

// =========================================================
// AUDIT LOGS
// =========================================================

builder.Services.AddScoped<
    IAuditLogRepository,
    AuditLogRepository>();

builder.Services.AddScoped<AuditLogRepository>();

builder.Services.AddScoped<
    IAuditLogService,
    AuditLogService>();

// =========================================================
// COMMUNICATION
// =========================================================

// ---------------------------------------------------------
// PROJECT ANNOUNCEMENTS
// ---------------------------------------------------------

builder.Services.AddScoped<
    IProjectAnnouncementService,
    ProjectAnnouncementService>();

builder.Services.AddScoped<
    IProjectAnnouncementRepository,
    ProjectAnnouncementRepository>();

builder.Services.AddScoped<
    IProjectAnnouncementRecipientRepository,
    ProjectAnnouncementRecipientRepository>();

// ---------------------------------------------------------
// DIRECT MESSAGES
// ---------------------------------------------------------

builder.Services.AddScoped<
    IMessageRepository,
    MessageRepository>();

builder.Services.AddScoped<
    IMessageService,
    MessageService>();

    // =========================================================
// NOTIFICATIONS
// =========================================================

builder.Services.AddScoped<
    INotificationRepository,
    NotificationRepository>();

builder.Services.AddScoped<
    INotificationService,
    NotificationService>();

// ---------------------------------------------------------
// MESSAGE MENTIONS
// ---------------------------------------------------------

builder.Services.AddScoped<
    IMessageMentionRepository,
    MessageMentionRepository>();

builder.Services.AddScoped<
    IMentionService,
    MentionService>();

// =========================================================
// DASHBOARD ANALYTICS
// =========================================================

builder.Services.AddScoped<
    IDashboardAnalyticsRepository,
    DashboardAnalyticsRepository>();

builder.Services.AddScoped<
    IDashboardAnalyticsService,
    DashboardAnalyticsService>();

builder.Services.AddScoped<
    IDashboardSectionService,
    DashboardSectionService>();

// =========================================================
// PREFERENCES
// =========================================================

builder.Services.AddScoped<
    IPreferenceService,
    PreferenceService>();

builder.Services.AddScoped<
    IUserPreferenceService,
    UserPreferenceService>();

builder.Services.AddScoped<
    ICustomThemeRepository,
    CustomThemeRepository>();

// =========================================================
// SECURITY SETTINGS
// =========================================================

builder.Services.AddScoped<
    ISecuritySettingRepository,
    SecuritySettingRepository>();

builder.Services.AddScoped<
    ISecuritySettingService,
    SecuritySettingService>();

// =========================================================
// NOTIFICATION SETTINGS
// =========================================================

builder.Services.AddScoped<
    INotificationSettingRepository,
    NotificationSettingRepository>();

builder.Services.AddScoped<
    INotificationSettingService,
    NotificationSettingService>();

    builder.Services.AddScoped<
    IMessageRepository,
    MessageRepository>();

builder.Services.AddScoped<
    IMessageService,
    MessageService>();

// =========================================================
// SYSTEM SETTINGS
// =========================================================

builder.Services.AddScoped<SystemSettingRepository>();

builder.Services.AddScoped<
    ISystemSettingService,
    SystemSettingService>();

builder.Services.AddScoped<SystemSettingValidator>();

// =========================================================
// REPORTS
// =========================================================

builder.Services.AddScoped<
    IReportService,
    ReportService>();

// =========================================================
// CURRENT USER
// =========================================================

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<
    ICurrentUserService,
    CurrentUserService>();

// =========================================================
// AUTHORIZATION
// =========================================================

builder.Services.AddSingleton<
    IAuthorizationPolicyProvider,
    PermissionPolicyProvider>();

builder.Services.AddScoped<
    IAuthorizationHandler,
    PermissionAuthorizationHandler>();

builder.Services.AddAuthorization();

// =========================================================
// SWAGGER
// =========================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AI-PMS API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token only."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// =========================================================
// CORS
// =========================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
// =========================================================
// JWT AUTHENTICATION
// =========================================================

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtKey = builder.Configuration["Jwt:Key"];

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey!)
                ),

            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            ValidateLifetime = true,

            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role,

            ClockSkew = TimeSpan.Zero
        };

        // =====================================================
        // TEMPORARY JWT DEBUGGING
        // =====================================================

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                Console.WriteLine(
                    "========== JWT MESSAGE RECEIVED =========="
                );

                Console.WriteLine(
                    $"Authorization Header: " +
                    $"{context.Request.Headers.Authorization}"
                );

                return Task.CompletedTask;
            },

            OnTokenValidated = context =>
            {
                Console.WriteLine(
                    "========== JWT TOKEN VALIDATED =========="
                );

                Console.WriteLine(
                    $"User: {context.Principal?.Identity?.Name}"
                );

                Console.WriteLine(
                    $"Authenticated: " +
                    $"{context.Principal?.Identity?.IsAuthenticated}"
                );

                foreach (var claim in context.Principal?.Claims
                             ?? Enumerable.Empty<Claim>())
                {
                    Console.WriteLine(
                        $"CLAIM: {claim.Type} = {claim.Value}"
                    );
                }

                return Task.CompletedTask;
            },

            OnAuthenticationFailed = context =>
            {
                Console.WriteLine(
                    "========== JWT AUTHENTICATION FAILED =========="
                );

                Console.WriteLine(
                    $"Exception: {context.Exception.Message}"
                );

                return Task.CompletedTask;
            },

            OnChallenge = context =>
            {
                Console.WriteLine(
                    "========== JWT CHALLENGE =========="
                );

                Console.WriteLine(
                    $"Error: {context.Error}"
                );

                Console.WriteLine(
                    $"Error Description: " +
                    $"{context.ErrorDescription}"
                );

                return Task.CompletedTask;
            }
        };
    });
// =========================================================
// BUILD APPLICATION
// =========================================================
// Register HttpClient for Ollama
builder.Services.AddHttpClient<AI_PMS.Application.Interfaces.AI.IAiSuggestionService, AI_PMS.Application.Services.AI.AiSuggestionService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(300); // AI generation can take a few seconds
});

var app = builder.Build();

// =========================================================
// DATABASE SEEDING
// =========================================================

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();

    var passwordHasher = scope.ServiceProvider
        .GetRequiredService<PasswordHasher>();

    await DbSeeder.SeedAdminAsync(
        context,
        passwordHasher);
}

// =========================================================
// SWAGGER
// =========================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// =========================================================
// CORS
// IMPORTANT: MUST COME BEFORE AUTHENTICATION
// =========================================================

app.UseCors("Frontend");

// =========================================================
// HTTPS REDIRECTION
// Disabled for current local development.
// Backend is listening on:
// http://localhost:5043
// =========================================================

// app.UseHttpsRedirection();

// =========================================================
// AUTHENTICATION
// =========================================================

app.UseAuthentication();

// =========================================================
// AUTHORIZATION
// =========================================================

app.UseAuthorization();

// =========================================================
// CONTROLLERS
// =========================================================

app.MapControllers();

// =========================================================
// RUN APPLICATION
// =========================================================

app.Run();
