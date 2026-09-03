using Microsoft.OpenApi;
using System.Text;

using AI_PMS.Application.Interfaces;
using AI_PMS.Application.Interface;

using AI_PMS.Infrastructure.AI.Configuration;
using AI_PMS.Infrastructure.AI.Services;
using AI_PMS.Infrastructure.Persistence;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ============================================================
// CONTROLLERS
// ============================================================

builder.Services.AddControllers();

// ============================================================
// DATABASE
// ============================================================

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// ============================================================
// CORS
// ============================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ============================================================
// JWT AUTHENTICATION
// ============================================================

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "JWT Key is missing from appsettings.json.");

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "JWT Issuer is missing from appsettings.json.");

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "JWT Audience is missing from appsettings.json.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)),

                ValidateIssuer = true,
                ValidIssuer = jwtIssuer,

                ValidateAudience = true,
                ValidAudience = jwtAudience,

                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero
            };
    });

// ============================================================
// AUTHORIZATION
// ============================================================

builder.Services.AddAuthorization();

// ============================================================
// SWAGGER
// AI ONLY
// ============================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("ai", new OpenApiInfo
    {
        Title = "AI-PMS AI Engine API",
        Version = "v1",
        Description =
            "AI Engine endpoints for Developer, Staff and Team Leader"
    });

    options.DocInclusionPredicate(
        (documentName, apiDescription) =>
        {
            return apiDescription.GroupName == "AI";
        });
});

// ============================================================
// AI CONFIGURATION
// ============================================================

builder.Services.Configure<AIOptions>(
    builder.Configuration.GetSection("AI"));

// ============================================================
// OLLAMA AI SERVICE
// ============================================================

builder.Services.AddHttpClient<OllamaService>();

builder.Services.AddScoped<IAIService>(
    provider =>
        provider.GetRequiredService<OllamaService>());

// ============================================================
// TASK DECOMPOSITION
// ============================================================

builder.Services.AddScoped<TaskDecompositionService>();

builder.Services.AddScoped<ITaskDecompositionService>(
    provider =>
        provider.GetRequiredService<TaskDecompositionService>());

// ============================================================
// TASK SIZE DETECTION
// ============================================================

builder.Services.AddScoped<TaskSizeDetectionService>();

builder.Services.AddScoped<ITaskSizeDetectionService>(
    provider =>
        provider.GetRequiredService<TaskSizeDetectionService>());

// ============================================================
// TASK ANALYSIS AI
// Developer / Staff / Team Leader
// ============================================================

builder.Services.AddScoped<TaskAnalysisService>();

builder.Services.AddScoped<ITaskAnalysisService>(
    provider =>
        provider.GetRequiredService<TaskAnalysisService>());

// ============================================================
// HIERARCHICAL TASK DECOMPOSITION
// ============================================================

builder.Services.AddScoped<HierarchicalTaskDecompositionService>();

builder.Services.AddScoped<IHierarchicalTaskDecompositionService>(
    provider =>
        provider.GetRequiredService<
            HierarchicalTaskDecompositionService>());

// ============================================================
// AI SUGGESTION SERVICE
// ============================================================

builder.Services.AddScoped<AISuggestionService>();

builder.Services.AddScoped<IAISuggestionService>(
    provider =>
        provider.GetRequiredService<AISuggestionService>());

// ============================================================
// RISK PREDICTION
// ============================================================

builder.Services.AddScoped<RiskPredictionService>();

builder.Services.AddScoped<IRiskPredictionService>(
    provider =>
        provider.GetRequiredService<RiskPredictionService>());

// ============================================================
// RECOMMENDATION
// ============================================================

builder.Services.AddScoped<RecommendationService>();

builder.Services.AddScoped<IRecommendationService>(
    provider =>
        provider.GetRequiredService<RecommendationService>());

// ============================================================
// DEVELOPER AI RECOMMENDATION
// ============================================================

builder.Services.AddScoped<DeveloperRecommendationService>();

builder.Services.AddScoped<IDeveloperRecommendationService>(
    provider =>
        provider.GetRequiredService<
            DeveloperRecommendationService>());

// ============================================================
// STAFF AI
// ============================================================

builder.Services.AddScoped<StaffAIService>();

builder.Services.AddScoped<IStaffAIService>(
    provider =>
        provider.GetRequiredService<StaffAIService>());

// ============================================================
// TEAM PERFORMANCE
// Required by Team Leader AI
// ============================================================

builder.Services.AddHttpClient<TeamPerformanceService>(
    client =>
    {
        client.Timeout = TimeSpan.FromMinutes(5);
    });

builder.Services.AddScoped<ITeamPerformanceService>(
    provider =>
        provider.GetRequiredService<TeamPerformanceService>());

// ============================================================
// PROJECT PROGRESS
// Required by Team Leader AI
// ============================================================

builder.Services.AddScoped<ProjectProgressService>();

builder.Services.AddScoped<IProjectProgressService>(
    provider =>
        provider.GetRequiredService<ProjectProgressService>());

// ============================================================
// BOTTLENECK DETECTION
// Required by Team Leader AI
// ============================================================

builder.Services.AddHttpClient<BottleneckDetectionService>(
    client =>
    {
        client.Timeout = TimeSpan.FromMinutes(5);
    });

builder.Services.AddScoped<IBottleneckDetectionService>(
    provider =>
        provider.GetRequiredService<BottleneckDetectionService>());

// ============================================================
// DEADLINE PREDICTION
// Required by Team Leader AI
// ============================================================

builder.Services.AddScoped<DeadlinePredictionService>();

builder.Services.AddScoped<IDeadlinePredictionService>(
    provider =>
        provider.GetRequiredService<DeadlinePredictionService>());

// ============================================================
// TEAM LEADER AI
// Must come AFTER all required services above
// ============================================================

builder.Services.AddScoped<TeamLeaderAIService>();

builder.Services.AddScoped<ITeamLeaderAIService>(
    provider =>
        provider.GetRequiredService<TeamLeaderAIService>());

// ============================================================
// USER REPOSITORY
// ============================================================

builder.Services.AddScoped<
    AI_PMS.Application.Interfaces.IUserRepository,
    AI_PMS.Infrastructure.Repositories.UserRepository>();

// ============================================================
// JWT TOKEN SERVICE
// ============================================================

builder.Services.Configure<
    AI_PMS.Infrastructure.Security.JwtSettings>(
        builder.Configuration.GetSection("Jwt"));

builder.Services.AddScoped<
    AI_PMS.Application.Interfaces.IJwtTokenService,
    AI_PMS.Infrastructure.Security.JwtTokenService>();

// ============================================================
// USER SERVICE
// ============================================================

builder.Services.AddScoped<
    AI_PMS.Application.Interface.IUserService,
    AI_PMS.Infrastructure.Services.UserService>();

// ============================================================
// BUILD APPLICATION
// ============================================================

var app = builder.Build();

// ============================================================
// DEVELOPMENT
// ============================================================

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// ============================================================
// SWAGGER
// AI ONLY
// ============================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/swagger/ai/swagger.json",
            "AI-PMS AI Engine v1");

        options.RoutePrefix = "swagger";
    });
}

// ============================================================
// HTTPS
// Disabled because API runs on HTTP 5291
// ============================================================

// app.UseHttpsRedirection();

// ============================================================
// CORS
// ============================================================

app.UseCors("AllowAll");

// ============================================================
// AUTHENTICATION
// ============================================================

app.UseAuthentication();

// ============================================================
// AUTHORIZATION
// ============================================================

app.UseAuthorization();

// ============================================================
// CONTROLLERS
// ============================================================

app.MapControllers();

// ============================================================
// RUN
// ============================================================

app.Run();