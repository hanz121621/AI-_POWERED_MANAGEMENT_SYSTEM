using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
namespace AI_PMS.Infrastructure.AI.Services;
public class TeamLeaderAIService : ITeamLeaderAIService
{
    private readonly ITeamPerformanceService _teamPerformanceService;
    private readonly IProjectProgressService _projectProgressService;
    private readonly IBottleneckDetectionService _bottleneckDetectionService;
    private readonly IDeadlinePredictionService _deadlinePredictionService;
    public TeamLeaderAIService(
        ITeamPerformanceService teamPerformanceService,
        IProjectProgressService projectProgressService,
        IBottleneckDetectionService bottleneckDetectionService,
        IDeadlinePredictionService deadlinePredictionService)
    {
        _teamPerformanceService = teamPerformanceService;
        _projectProgressService = projectProgressService;
        _bottleneckDetectionService = bottleneckDetectionService;
        _deadlinePredictionService = deadlinePredictionService;
    }
    public async Task<TeamLeaderAIResponse> AnalyzeProjectAsync(
        Guid projectId)
    {
        if (projectId == Guid.Empty)
        {
            throw new ArgumentException(
                "Project ID is required.",
                nameof(projectId));
        }
        // =====================================================
        // RUN TEAM LEADER AI ANALYSIS
        // =====================================================
var teamPerformance =
    await _teamPerformanceService
        .AnalyzeTeamPerformanceForProjectAsync(projectId);

var projectProgress =
    await _projectProgressService
        .PredictProgressForProjectAsync(projectId);

var bottlenecks =
    await _bottleneckDetectionService
        .DetectBottlenecksForProjectAsync(projectId);

var deadlinePrediction =
    await _deadlinePredictionService
        .PredictDeadlineForProjectAsync(projectId);
             // =====================================================
        // OVERALL STATUS
        // =====================================================
        var overallStatus =
            DetermineOverallStatus(
                projectProgress,
                bottlenecks,
                deadlinePrediction);
        // =====================================================
        // OVERALL ANALYSIS
        // =====================================================
        var overallAnalysis =
            BuildOverallAnalysis(
                teamPerformance,
                projectProgress,
                bottlenecks,
                deadlinePrediction,
                overallStatus);
        // =====================================================
        // KEY FINDINGS
        // =====================================================
        var keyFindings =
            BuildKeyFindings(
                teamPerformance,
                projectProgress,
                bottlenecks,
                deadlinePrediction);
        // =====================================================
        // RECOMMENDATIONS
        // =====================================================
        var recommendations =
            BuildRecommendations(
                teamPerformance,
                projectProgress,
                bottlenecks,
                deadlinePrediction);
        // =====================================================
        // SUGGESTED ACTIONS
        // =====================================================
        var suggestedActions =
            BuildSuggestedActions(
                teamPerformance,
                projectProgress,
                bottlenecks,
                deadlinePrediction);
        return new TeamLeaderAIResponse
        {
            ProjectId = projectId,
            ProjectName =
                projectProgress.ProjectName,
            TeamPerformance =
                teamPerformance,
            ProjectProgress =
                projectProgress,
            Bottlenecks =
                bottlenecks,
            DeadlinePrediction =
                deadlinePrediction,
            OverallStatus =
                overallStatus,
            OverallAnalysis =
                overallAnalysis,
            KeyFindings =
                keyFindings,
            Recommendations =
                recommendations,
            SuggestedActions =
                suggestedActions
        };
    }
    // =========================================================
    // OVERALL STATUS
    // =========================================================
    private static string DetermineOverallStatus(
        ProjectProgressResponse progress,
        BottleneckResponse bottlenecks,
        DeadlinePredictionResponse deadline)
    {
        if (deadline.RiskLevel.Equals(
                "High",
                StringComparison.OrdinalIgnoreCase))
        {
            return "High Risk";
        }
        if (progress.ProgressStatus.Equals(
                "At Risk",
                StringComparison.OrdinalIgnoreCase))
        {
            return "At Risk";
        }
        if (bottlenecks.Bottlenecks.Count >= 2)
        {
            return "Needs Attention";
        }
        if (deadline.RiskLevel.Equals(
                "Medium",
                StringComparison.OrdinalIgnoreCase))
        {
            return "Needs Attention";
        }
        return "On Track";
    }
    // =========================================================
    // OVERALL ANALYSIS
    // =========================================================
    private static string BuildOverallAnalysis(
        TeamPerformanceResponse teamPerformance,
        ProjectProgressResponse progress,
        BottleneckResponse bottlenecks,
        DeadlinePredictionResponse deadline,
        string overallStatus)
    {
        var memberCount =
            teamPerformance.TeamMembers?.Count ?? 0;
        var bottleneckCount =
            bottlenecks.Bottlenecks?.Count ?? 0;
        return
            $"The project is currently classified as '{overallStatus}'. " +
            $"Current project progress is " +
            $"{progress.CurrentProgressPercentage}% with a predicted progress of " +
            $"{progress.PredictedProgressPercentage}%. " +
            $"The team performance analysis covers {memberCount} team member(s). " +
            $"{bottleneckCount} bottleneck(s) were detected. " +
            $"The predicted deadline status is " +
            $"'{deadline.DelayStatus}' with a {deadline.RiskLevel} risk level.";
    }
    // =========================================================
    // KEY FINDINGS
    // =========================================================
    private static List<string> BuildKeyFindings(
        TeamPerformanceResponse teamPerformance,
        ProjectProgressResponse progress,
        BottleneckResponse bottlenecks,
        DeadlinePredictionResponse deadline)
    {
        var findings = new List<string>();
        // Project progress
        findings.Add(
            $"Current project progress is " +
            $"{progress.CurrentProgressPercentage}%.");
        findings.Add(
            $"Predicted project progress is " +
            $"{progress.PredictedProgressPercentage}%.");
        // Team findings
        if (teamPerformance.KeyFindings != null)
        {
            findings.AddRange(
                teamPerformance.KeyFindings
                    .Take(3));
        }
        // Bottlenecks
        if (bottlenecks.Bottlenecks.Count > 0)
        {
            findings.Add(
                $"{bottlenecks.Bottlenecks.Count} bottleneck(s) " +
                "require team leader attention.");
        }
        // Deadline
        findings.Add(
            $"Deadline status: {deadline.DelayStatus}.");
        findings.Add(
            $"Deadline risk level: {deadline.RiskLevel}.");
        if (deadline.DaysDifference > 0)
        {
            findings.Add(
                $"The predicted completion is " +
                $"{deadline.DaysDifference} day(s) after " +
                "the official deadline.");
        }
        else if (deadline.DaysDifference < 0)
        {
            findings.Add(
                $"The project is predicted to finish " +
                $"{Math.Abs(deadline.DaysDifference)} day(s) " +
                "ahead of the official deadline.");
        }
        return findings
            .Distinct()
            .Take(10)
            .ToList();
    }
    // =========================================================
    // RECOMMENDATIONS
    // =========================================================
    private static List<string> BuildRecommendations(
        TeamPerformanceResponse teamPerformance,
        ProjectProgressResponse progress,
        BottleneckResponse bottlenecks,
        DeadlinePredictionResponse deadline)
    {
        var recommendations =
            new List<string>();
        // Bottleneck recommendations have highest priority.
        if (bottlenecks.Recommendations != null)
        {
            recommendations.AddRange(
                bottlenecks.Recommendations);
        }
        // Progress recommendations.
        if (progress.Recommendations != null)
        {
            recommendations.AddRange(
                progress.Recommendations);
        }
        // Deadline recommendations.
        if (deadline.Recommendations != null)
        {
            recommendations.AddRange(
                deadline.Recommendations);
        }
        // Team recommendations.
        if (teamPerformance.Recommendations != null)
        {
            recommendations.AddRange(
                teamPerformance.Recommendations);
        }
        return recommendations
            .Where(r => !string.IsNullOrWhiteSpace(r))
            .Distinct()
            .Take(8)
            .ToList();
    }
    // =========================================================
    // SUGGESTED ACTIONS
    // =========================================================
    private static List<string> BuildSuggestedActions(
        TeamPerformanceResponse teamPerformance,
        ProjectProgressResponse progress,
        BottleneckResponse bottlenecks,
        DeadlinePredictionResponse deadline)
    {
        var actions =
            new List<string>();
        // Action 1: blocked work
        if (bottlenecks.Bottlenecks.Count > 0)
        {
            actions.Add(
                "Review and resolve the highest-severity " +
                "bottlenecks before assigning additional work.");
        }
        // Action 2: deadline
        if (deadline.DaysDifference > 0)
        {
            actions.Add(
                "Reprioritize remaining work and adjust team " +
                "workload to reduce the predicted deadline delay.");
        }
        else
        {
            actions.Add(
                "Continue monitoring the project schedule " +
                "against the official deadline.");
        }
        // Action 3: progress
        if (progress.ProgressStatus.Equals(
                "At Risk",
                StringComparison.OrdinalIgnoreCase))
        {
            actions.Add(
                "Review blocked and remaining tasks with the " +
                "team and create an immediate recovery plan.");
        }
        else
        {
            actions.Add(
                "Monitor task completion and sprint progress " +
                "to maintain the current trajectory.");
        }
        // Team performance actions
        if (teamPerformance.TeamMembers != null)
        {
            var overloadedMembers =
                teamPerformance.TeamMembers
                    .Where(m =>
                        m.TotalTasks >= 3 ||
                        m.ActualHours > m.EstimatedHours)
                    .Select(m => m.MemberName)
                    .Where(n =>
                        !string.IsNullOrWhiteSpace(n))
                    .Distinct()
                    .Take(2)
                    .ToList();
            foreach (var member in overloadedMembers)
            {
                actions.Add(
                    $"Review the workload of team member " +
                    $"'{member}' and rebalance tasks if necessary.");
            }
        }
        return actions
            .Distinct()
            .Take(8)
            .ToList();
    }
}
