using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using AI_PMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.AI.Services;

public class ProjectProgressService : IProjectProgressService
{
    private readonly ApplicationDbContext _dbContext;

    public ProjectProgressService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // =========================================================
    // MANUAL PROJECT PROGRESS PREDICTION
    // POST /api/ProjectProgress
    // =========================================================

    public async Task<ProjectProgressResponse> PredictProgressAsync(
        ProjectProgressRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.ProjectName))
        {
            throw new ArgumentException(
                "Project name is required.",
                nameof(request));
        }

        var currentProgress =
            request.TotalTasks > 0
                ? (double)request.CompletedTasks /
                  request.TotalTasks * 100
                : 0;

        var predictedProgress =
            CalculatePredictedProgress(request);

        return BuildResponse(
            request,
            currentProgress,
            predictedProgress);
    }

    // =========================================================
    // DATABASE PROJECT PROGRESS PREDICTION
    // POST /api/ProjectProgress/project/{projectId}
    // =========================================================

    public async Task<ProjectProgressResponse>
        PredictProgressForProjectAsync(Guid projectId)
    {
        var project = await _dbContext.Projects
            .Include(p => p.Tasks)
            .Include(p => p.Sprints)
                .ThenInclude(s => s.Tasks)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project == null)
        {
            throw new KeyNotFoundException(
                $"Project with ID '{projectId}' was not found.");
        }

        var tasks = project.Tasks?.ToList()
                    ?? new List<AI_PMS.Domain.Entities.TaskItem>();

        var sprints = project.Sprints?.ToList()
                      ?? new List<AI_PMS.Domain.Entities.Sprint>();

        var totalTasks = tasks.Count;

        var completedTasks = tasks.Count(t =>
            t.Status.ToString()
                .Equals(
                    "Done",
                    StringComparison.OrdinalIgnoreCase));

        var inProgressTasks = tasks.Count(t =>
            t.Status.ToString()
                .Equals(
                    "InProgress",
                    StringComparison.OrdinalIgnoreCase));

        var blockedTasks = tasks.Count(t =>
            t.Status.ToString()
                .Equals(
                    "Blocked",
                    StringComparison.OrdinalIgnoreCase));

        var remainingTasks =
            totalTasks - completedTasks;

        if (remainingTasks < 0)
        {
            remainingTasks = 0;
        }

        var totalEstimatedHours =
            tasks.Sum(t => t.EstimatedHours ?? 0);

        var totalActualHours =
            tasks.Sum(t => t.ActualHours ?? 0);

        var completedSprints = sprints.Count(s =>
            s.EndDate < DateTime.UtcNow);

        var activeSprints = sprints.Count(s =>
            s.StartDate <= DateTime.UtcNow &&
            s.EndDate >= DateTime.UtcNow);

        var completionRate =
            totalTasks > 0
                ? (double)completedTasks /
                  totalTasks * 100
                : 0;

        var request = new ProjectProgressRequest
        {
            ProjectName = project.Name,

            TotalTasks = totalTasks,

            CompletedTasks = completedTasks,

            InProgressTasks = inProgressTasks,

            BlockedTasks = blockedTasks,

            RemainingTasks = remainingTasks,

            CompletionRate = Math.Round(
                completionRate,
                2),

            TotalSprints = sprints.Count,

            CompletedSprints = completedSprints,

            ActiveSprints = activeSprints,

            TotalEstimatedHours =
                totalEstimatedHours,

            TotalActualHours =
                totalActualHours
        };

        var predictedProgress =
            CalculatePredictedProgress(request);

        return BuildResponse(
            request,
            completionRate,
            predictedProgress);
    }

    // =========================================================
    // CALCULATE PREDICTED PROGRESS
    // =========================================================

    private static double CalculatePredictedProgress(
        ProjectProgressRequest request)
    {
        if (request.TotalTasks == 0)
        {
            return 0;
        }

        var currentProgress =
            request.CompletionRate;

        var remainingTasks =
            request.RemainingTasks;

        if (remainingTasks == 0)
        {
            return 100;
        }

        // Basic progress projection.
        //
        // The prediction starts from current progress
        // and considers the current amount of active work.
        //
        // This is intentionally conservative so that the
        // system does not claim unrealistic progress.

        var progressFactor = 0.0;

        if (request.InProgressTasks > 0)
        {
            progressFactor += 10;
        }

        if (request.BlockedTasks > 0)
        {
            progressFactor -=
                Math.Min(
                    request.BlockedTasks * 5,
                    20);
        }

        if (request.TotalActualHours >
            request.TotalEstimatedHours &&
            request.TotalEstimatedHours > 0)
        {
            progressFactor -= 5;
        }

        var predicted =
            currentProgress + progressFactor;

        if (predicted < currentProgress)
        {
            predicted = currentProgress;
        }

        if (predicted > 100)
        {
            predicted = 100;
        }

        return Math.Round(
            predicted,
            2);
    }

    // =========================================================
    // BUILD RESPONSE
    // =========================================================

    private static ProjectProgressResponse BuildResponse(
        ProjectProgressRequest request,
        double currentProgress,
        double predictedProgress)
    {
        var response =
            new ProjectProgressResponse
            {
                ProjectName =
                    request.ProjectName,

                CurrentProgressPercentage =
                    Math.Round(
                        currentProgress,
                        2),

                PredictedProgressPercentage =
                    Math.Round(
                        predictedProgress,
                        2)
            };

        // -----------------------------------------------------
        // STATUS
        // -----------------------------------------------------

        if (request.BlockedTasks > 0)
        {
            response.ProgressStatus =
                "At Risk";
        }
        else if (predictedProgress >= 80)
        {
            response.ProgressStatus =
                "On Track";
        }
        else if (predictedProgress >= 50)
        {
            response.ProgressStatus =
                "Progressing";
        }
        else
        {
            response.ProgressStatus =
                "Needs Attention";
        }

        // -----------------------------------------------------
        // ANALYSIS
        // -----------------------------------------------------

        response.OverallAnalysis =
            $"The project is currently " +
            $"{Math.Round(currentProgress, 2)}% complete. " +
            $"Based on the current project activity, " +
            $"the projected progress is approximately " +
            $"{Math.Round(predictedProgress, 2)}%.";

        // -----------------------------------------------------
        // KEY FINDINGS
        // -----------------------------------------------------

        if (request.TotalTasks == 0)
        {
            response.KeyFindings.Add(
                "The project currently has no tasks.");
        }
        else
        {
            response.KeyFindings.Add(
                $"{request.CompletedTasks} of " +
                $"{request.TotalTasks} tasks are completed.");

            if (request.InProgressTasks > 0)
            {
                response.KeyFindings.Add(
                    $"{request.InProgressTasks} task(s) " +
                    "are currently in progress.");
            }

            if (request.BlockedTasks > 0)
            {
                response.KeyFindings.Add(
                    $"{request.BlockedTasks} task(s) " +
                    "are currently blocked.");
            }

            if (request.RemainingTasks > 0)
            {
                response.KeyFindings.Add(
                    $"{request.RemainingTasks} task(s) " +
                    "remain to be completed.");
            }

            if (request.TotalActualHours >
                request.TotalEstimatedHours &&
                request.TotalEstimatedHours > 0)
            {
                response.KeyFindings.Add(
                    "Actual recorded hours exceed " +
                    "the estimated hours.");
            }
        }

        // -----------------------------------------------------
        // RECOMMENDATIONS
        // -----------------------------------------------------

        if (request.BlockedTasks > 0)
        {
            response.Recommendations.Add(
                "Prioritize resolving blocked tasks " +
                "to avoid further project delays.");
        }

        if (request.RemainingTasks > 0)
        {
            response.Recommendations.Add(
                "Continue monitoring remaining tasks " +
                "and maintain steady task completion.");
        }

        if (request.TotalActualHours >
            request.TotalEstimatedHours &&
            request.TotalEstimatedHours > 0)
        {
            response.Recommendations.Add(
                "Review task estimates where actual " +
                "hours consistently exceed planned hours.");
        }

        if (response.Recommendations.Count == 0)
        {
            response.Recommendations.Add(
                "Continue monitoring project progress " +
                "and task completion.");
        }

        return response;
    }
}