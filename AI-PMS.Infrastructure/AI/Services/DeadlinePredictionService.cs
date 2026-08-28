using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using AI_PMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.AI.Services;

public class DeadlinePredictionService : IDeadlinePredictionService
{
    private readonly ApplicationDbContext _dbContext;

    public DeadlinePredictionService(
        ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // =========================================================
    // MANUAL DEADLINE PREDICTION
    // POST /api/DeadlinePrediction
    // =========================================================

    public async Task<DeadlinePredictionResponse> PredictDeadlineAsync(
        DeadlinePredictionRequest request)
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

        if (!request.ProjectDeadline.HasValue)
        {
            throw new ArgumentException(
                "Project deadline is required.",
                nameof(request));
        }

        var predictedCompletionDate =
            CalculatePredictedCompletionDate(request);

        return BuildResponse(
            request,
            predictedCompletionDate);
    }

    // =========================================================
    // DATABASE PROJECT DEADLINE PREDICTION
    // POST /api/DeadlinePrediction/project/{projectId}
    // =========================================================

    public async Task<DeadlinePredictionResponse>
        PredictDeadlineForProjectAsync(Guid projectId)
    {
        var project = await _dbContext.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project == null)
        {
            throw new KeyNotFoundException(
                $"Project with ID '{projectId}' was not found.");
        }

        if (!project.EndDate.HasValue)
        {
            throw new InvalidOperationException(
                "The selected project does not have an official deadline.");
        }

        var tasks = project.Tasks?.ToList()
                    ?? new List<AI_PMS.Domain.Entities.TaskItem>();

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
            Math.Max(
                totalTasks - completedTasks,
                0);

        var overdueTasks = tasks.Count(t =>
            t.DueDate.HasValue &&
            t.DueDate.Value < DateTime.UtcNow &&
            !t.Status.ToString()
                .Equals(
                    "Done",
                    StringComparison.OrdinalIgnoreCase));

        var totalEstimatedHours =
            tasks.Sum(t => t.EstimatedHours ?? 0);

        var totalActualHours =
            tasks.Sum(t => t.ActualHours ?? 0);

        var completionRate =
            totalTasks > 0
                ? (double)completedTasks /
                  totalTasks * 100
                : 0;

        var request = new DeadlinePredictionRequest
        {
            ProjectName = project.Name,

            ProjectDeadline = project.EndDate,

            TotalTasks = totalTasks,

            CompletedTasks = completedTasks,

            RemainingTasks = remainingTasks,

            InProgressTasks = inProgressTasks,

            BlockedTasks = blockedTasks,

            OverdueTasks = overdueTasks,

            TotalEstimatedHours =
                totalEstimatedHours,

            TotalActualHours =
                totalActualHours,

            CompletionRate =
                Math.Round(
                    completionRate,
                    2)
        };

        var predictedCompletionDate =
            CalculatePredictedCompletionDate(request);

        return BuildResponse(
            request,
            predictedCompletionDate);
    }

    // =========================================================
    // CALCULATE PREDICTED COMPLETION DATE
    // =========================================================

    private static DateTime CalculatePredictedCompletionDate(
        DeadlinePredictionRequest request)
    {
        if (request.ProjectDeadline == null)
        {
            return DateTime.UtcNow;
        }

        if (request.RemainingTasks <= 0)
        {
            return DateTime.UtcNow;
        }

        /*
         * Basic project completion projection.
         *
         * This uses the current task workload and
         * project activity to estimate how much
         * additional time may be required.
         */

        var baseDays =
            Math.Max(
                request.RemainingTasks * 2,
                1);

        var additionalDays = 0;

        // Blocked tasks increase expected completion time.
        if (request.BlockedTasks > 0)
        {
            additionalDays +=
                request.BlockedTasks * 2;
        }

        // Overdue tasks increase expected completion time.
        if (request.OverdueTasks > 0)
        {
            additionalDays +=
                request.OverdueTasks * 2;
        }

        // Actual hours exceeding estimates indicates
        // that work may be taking longer than expected.
        if (request.TotalEstimatedHours > 0 &&
            request.TotalActualHours >
            request.TotalEstimatedHours)
        {
            additionalDays += 2;
        }

        return DateTime.UtcNow
            .Date
            .AddDays(
                baseDays + additionalDays);
    }

    // =========================================================
    // BUILD RESPONSE
    // =========================================================

    private static DeadlinePredictionResponse BuildResponse(
        DeadlinePredictionRequest request,
        DateTime predictedCompletionDate)
    {
        var officialDeadline =
            request.ProjectDeadline!.Value.Date;

        var predictedDate =
            predictedCompletionDate.Date;

        var daysDifference =
            (predictedDate -
             officialDeadline).Days;

        var delayStatus = "On Time";

        if (daysDifference > 0)
        {
            delayStatus = "Potential Delay";
        }
        else if (daysDifference < 0)
        {
            delayStatus = "Ahead of Schedule";
        }

        var riskLevel = "Low";

        if (request.BlockedTasks > 0 ||
            request.OverdueTasks > 0)
        {
            riskLevel = "Medium";
        }

        if (daysDifference > 7 ||
            request.BlockedTasks >= 2 ||
            request.OverdueTasks >= 2)
        {
            riskLevel = "High";
        }

        var response =
            new DeadlinePredictionResponse
            {
                ProjectName =
                    request.ProjectName,

                OfficialDeadline =
                    officialDeadline,

                PredictedCompletionDate =
                    predictedDate,

                DaysDifference =
                    daysDifference,

                DelayStatus =
                    delayStatus,

                RiskLevel =
                    riskLevel,

                CurrentProgressPercentage =
                    Math.Round(
                        request.CompletionRate,
                        2)
            };

        // =====================================================
        // OVERALL ANALYSIS
        // =====================================================

        response.OverallAnalysis =
            $"The project is currently " +
            $"{Math.Round(request.CompletionRate, 2)}% complete. " +
            $"The predicted completion date is " +
            $"{predictedDate:yyyy-MM-dd}, compared with the " +
            $"official deadline of " +
            $"{officialDeadline:yyyy-MM-dd}.";

        // =====================================================
        // KEY FACTORS
        // =====================================================

        if (request.RemainingTasks > 0)
        {
            response.KeyFactors.Add(
                $"{request.RemainingTasks} task(s) remain to be completed.");
        }

        if (request.BlockedTasks > 0)
        {
            response.KeyFactors.Add(
                $"{request.BlockedTasks} task(s) are currently blocked.");
        }

        if (request.OverdueTasks > 0)
        {
            response.KeyFactors.Add(
                $"{request.OverdueTasks} task(s) are overdue.");
        }

        if (request.TotalActualHours >
            request.TotalEstimatedHours &&
            request.TotalEstimatedHours > 0)
        {
            response.KeyFactors.Add(
                "Actual recorded hours exceed estimated hours.");
        }

        if (response.KeyFactors.Count == 0)
        {
            response.KeyFactors.Add(
                "No major delay factors were detected.");
        }

        // =====================================================
        // RECOMMENDATIONS
        // =====================================================

        if (request.BlockedTasks > 0)
        {
            response.Recommendations.Add(
                "Resolve blocked tasks and their dependencies as a priority.");
        }

        if (request.OverdueTasks > 0)
        {
            response.Recommendations.Add(
                "Review overdue tasks and adjust priorities or workload.");
        }

        if (daysDifference > 0)
        {
            response.Recommendations.Add(
                "Review the project schedule because the predicted completion date is after the official deadline.");
        }

        if (request.RemainingTasks > 0)
        {
            response.Recommendations.Add(
                "Continue monitoring remaining work and task completion rates.");
        }

        if (response.Recommendations.Count == 0)
        {
            response.Recommendations.Add(
                "Continue monitoring project progress against the official deadline.");
        }

        return response;
    }
}