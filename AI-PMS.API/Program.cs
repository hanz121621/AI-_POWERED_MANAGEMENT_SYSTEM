using AI_PMS.Application.Interfaces;
using AI_PMS.Infrastructure.AI.Configuration;
using AI_PMS.Infrastructure.AI.Services;
using AI_PMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

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
// SWAGGER
// ============================================================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
// HTTP CLIENT
// ============================================================

builder.Services.AddHttpClient();

// ============================================================
// AI CONFIGURATION
// ============================================================

builder.Services.Configure<AIOptions>(
    builder.Configuration.GetSection("AI"));

// ============================================================
// AI SERVICES
// ============================================================

// Main AI service - Ollama
builder.Services.AddScoped<
    IAIService,
    OllamaService>();

// AI Suggestions
builder.Services.AddScoped<
    IAISuggestionService,
    AISuggestionService>();

// Task Size Detection
builder.Services.AddScoped<
    ITaskSizeDetectionService,
    TaskSizeDetectionService>();

// Task Decomposition
builder.Services.AddScoped<
    ITaskDecompositionService,
    TaskDecompositionService>();

// Risk Prediction
builder.Services.AddScoped<
    IRiskPredictionService,
    RiskPredictionService>();

// Recommendation
builder.Services.AddScoped<
    IRecommendationService,
    RecommendationService>();

// Bottleneck Detection
builder.Services.AddScoped<
    IBottleneckDetectionService,
    BottleneckDetectionService>();
builder.Services.AddScoped<
    ITeamPerformanceService,
    TeamPerformanceService>();

// Deadline Prediction
builder.Services.AddScoped<
    IDeadlinePredictionService,
    DeadlinePredictionService>();

// Project Progress Prediction
builder.Services.AddScoped<
    IProjectProgressService,
    ProjectProgressService>();

// AI Usage Statistics

builder.Services.AddScoped<
    IAIUsageStatisticsService,
    AIUsageStatisticsService>();

// ============================================================
// BUILD APPLICATION
// ============================================================

var app = builder.Build();

// ============================================================
// SWAGGER
// ============================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ============================================================
// CORS
// ============================================================

app.UseCors("AllowAll");

// ============================================================
// AUTHENTICATION & AUTHORIZATION
// ============================================================

app.UseAuthentication();
app.UseAuthorization();

// ============================================================
// CONTROLLERS
// ============================================================

app.MapControllers();

// ============================================================
// RUN
// ============================================================

app.Run();