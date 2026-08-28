
using System.Text;

using MediatR;

using AI_PMS.API.Authorization;
using AI_PMS.API.Services;

using AI_PMS.Application.DTOs.Auth;

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
using AI_PMS.Application.Interfaces.Repositories.SecuritySettings;
using AI_PMS.Application.Interfaces.Repositories.SubTasks;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Repositories.Users;
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
using AI_PMS.Application.Services.SubTasks;
using AI_PMS.Application.Services.SystemSettings;
using AI_PMS.Application.Services.Tasks;
using AI_PMS.Application.Services.Teams;
using AI_PMS.Application.Services.UserPreferences;
using AI_PMS.Application.Services.Users;

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

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// =========================================================
// DATABASE
// =========================================================

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

// =========================================================
// SPRINT MANAGEMENT
// =========================================================

builder.Services.AddScoped<
    ISprintRepository,
    SprintRepository>();

builder.Services.AddScoped<
    ISprintService,
    SprintService>();

// =========================================================
// TASK MANAGEMENT
// =========================================================

builder.Services.AddScoped<
    ITaskRepository,
    TaskRepository>();

builder.Services.AddScoped<
    ITaskService,
    TaskService>();

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

builder.Services.AddScoped<
    IProjectAnnouncementService,
    ProjectAnnouncementService>();

builder.Services.AddScoped<
    IProjectAnnouncementRepository,
    ProjectAnnouncementRepository>();

builder.Services.AddScoped<
    IProjectAnnouncementRecipientRepository,
    ProjectAnnouncementRecipientRepository>();

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
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            builder.Configuration["Jwt:Key"]!))
            };
    });

// =========================================================
// BUILD APPLICATION
// =========================================================

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