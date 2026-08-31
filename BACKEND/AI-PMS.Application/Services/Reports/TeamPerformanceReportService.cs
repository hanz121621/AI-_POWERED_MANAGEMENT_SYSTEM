using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Reports;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Reports
{
    public class TeamPerformanceReportService
        : ITeamPerformanceReportService
    {
        private readonly ITeamRepository _teamRepository;
        private readonly ITaskRepository _taskRepository;

        public TeamPerformanceReportService(
            ITeamRepository teamRepository,
            ITaskRepository taskRepository)
        {
            _teamRepository = teamRepository;
            _taskRepository = taskRepository;
        }

        public async Task<TeamPerformanceReportDto>
            GetTeamPerformanceReportAsync(
                Guid teamId,
                DateTime? startDate = null,
                DateTime? endDate = null)
        {
            try
            {
                // =====================================================
                // GET TEAM
                // =====================================================

                var team =
                    await _teamRepository.GetByIdAsync(teamId);

                if (team == null)
                {
                    return new TeamPerformanceReportDto
                    {
                        Success = false,
                        Message = "Team not found.",
                        GeneratedAt = DateTime.UtcNow
                    };
                }

                // =====================================================
                // GET ALL TASKS
                // =====================================================

                var allTasks =
                    await _taskRepository.GetAllAsync();

                // =====================================================
                // GET TEAM MEMBERS
                // =====================================================

                var teamMembers =
                    team.TeamMembers
                        .Where(m => m.IsActive)
                        .ToList();

                var memberUserIds =
                    teamMembers
                        .Select(m => m.UserId)
                        .ToHashSet();

                // =====================================================
                // TEAM TASKS
                //
                // TaskItem currently contains SprintId rather than
                // TeamId, so team membership is determined through
                // AssignedContributorSDId.
                // =====================================================

                var teamTasks =
                    allTasks
                        .Where(t =>
                            t.AssignedContributorSDId.HasValue &&
                            memberUserIds.Contains(
                                t.AssignedContributorSDId.Value))
                        .ToList();

                // =====================================================
                // DATE FILTER
                // =====================================================

                if (startDate.HasValue)
                {
                    teamTasks =
                        teamTasks
                            .Where(t =>
                                t.CreatedAt >= startDate.Value)
                            .ToList();
                }

                if (endDate.HasValue)
                {
                    var endDateExclusive =
                        endDate.Value.Date.AddDays(1);

                    teamTasks =
                        teamTasks
                            .Where(t =>
                                t.CreatedAt < endDateExclusive)
                            .ToList();
                }

                // =====================================================
                // TASK STATISTICS
                // =====================================================

                var totalTasks =
                    teamTasks.Count;

                var completedTasks =
                    teamTasks.Count(t =>
                        t.Status == ProjectTaskStatus.Completed);

                var blockedTasks =
                    teamTasks.Count(t =>
                        t.Status == ProjectTaskStatus.Blocked);

                var delayedTasks =
                    teamTasks.Count(t =>
                        t.DueDate < DateTime.UtcNow &&
                        t.Status != ProjectTaskStatus.Completed);

                // =====================================================
                // COMPLETION RATE
                // =====================================================

                decimal completionRate = 0;

                if (totalTasks > 0)
                {
                    completionRate =
                        Math.Round(
                            (decimal)completedTasks /
                            totalTasks *
                            100,
                            2);
                }

                // =====================================================
                // WORKLOAD
                // =====================================================

                var totalEstimatedHours =
                    teamTasks.Sum(t => t.EstimatedHours);

                var totalActualHours =
                    teamTasks.Sum(t => t.ActualHours);

                decimal workloadPercentage = 0;

                if (totalEstimatedHours > 0)
                {
                    workloadPercentage =
                        Math.Round(
                            (decimal)totalActualHours /
                            totalEstimatedHours *
                            100,
                            2);
                }

                // =====================================================
                // TASK DISTRIBUTION
                // =====================================================

                var taskDistribution =
                    teamTasks
                        .GroupBy(t => t.Status.ToString())
                        .Select(g =>
                            new TaskDistributionDto
                            {
                                Status = g.Key,

                                TaskCount = g.Count(),

                                Percentage =
                                    totalTasks == 0
                                        ? 0
                                        : Math.Round(
                                            (decimal)g.Count() /
                                            totalTasks *
                                            100,
                                            2)
                            })
                        .OrderByDescending(x => x.TaskCount)
                        .ToList();

                // =====================================================
                // TEAM LEADERS
                // =====================================================

                var teamLeaders =
                    teamMembers
                        .Where(m => m.IsTeamLeader)
                        .Select(m =>
                            BuildMemberReport(
                                m,
                                teamTasks,
                                totalEstimatedHours))
                        .ToList();

                // =====================================================
                // CONTRIBUTORS
                //
                // IMPORTANT:
                // ContributorType and ContributorSubType come
                // directly from configured TeamMember data.
                //
                // No hard-coded Developer/Staff classification.
                // =====================================================

                var contributors =
                    teamMembers
                        .Where(m => !m.IsTeamLeader)
                        .Select(m =>
                            BuildMemberReport(
                                m,
                                teamTasks,
                                totalEstimatedHours))
                        .ToList();

                // =====================================================
                // RETURN REPORT
                // =====================================================

                return new TeamPerformanceReportDto
                {
                    TeamId = team.Id,

                    TeamName = team.Name,

                    CompletionRate = completionRate,

                    TotalTasks = totalTasks,

                    CompletedTasks = completedTasks,

                    DelayedTasks = delayedTasks,

                    BlockedTasks = blockedTasks,

                    TotalEstimatedHours =
                        totalEstimatedHours,

                    TotalActualHours =
                        totalActualHours,

                    WorkloadPercentage =
                        workloadPercentage,

                    TaskDistribution =
                        taskDistribution,

                    TeamLeaders =
                        teamLeaders,

                    Contributors =
                        contributors,

                    GeneratedAt =
                        DateTime.UtcNow,

                    Success = true,

                    Message =
                        "Team performance report generated successfully."
                };
            }
            catch (Exception)
            {
                return new TeamPerformanceReportDto
                {
                    Success = false,

                    Message =
                        "Unable to generate team performance report.",

                    GeneratedAt =
                        DateTime.UtcNow
                };
            }
        }

        // =============================================================
        // BUILD MEMBER PERFORMANCE
        // =============================================================

        private TeamPerformanceMemberDto
            BuildMemberReport(
                AI_PMS.Domain.Entities.Teams.TeamMember member,
                List<AI_PMS.Domain.Entities.Tasks.TaskItem> teamTasks,
                int totalEstimatedHours)
        {
            var userTasks =
                teamTasks
                    .Where(t =>
                        t.AssignedContributorSDId ==
                        member.UserId)
                    .ToList();

            var assignedTasks =
                userTasks.Count;

            var completedTasks =
                userTasks.Count(t =>
                    t.Status ==
                    ProjectTaskStatus.Completed);

            var blockedTasks =
                userTasks.Count(t =>
                    t.Status ==
                    ProjectTaskStatus.Blocked);

            var delayedTasks =
                userTasks.Count(t =>
                    t.DueDate < DateTime.UtcNow &&
                    t.Status !=
                    ProjectTaskStatus.Completed);

            var estimatedHours =
                userTasks.Sum(t =>
                    t.EstimatedHours);

            var actualHours =
                userTasks.Sum(t =>
                    t.ActualHours);

            decimal completionRate = 0;

            if (assignedTasks > 0)
            {
                completionRate =
                    Math.Round(
                        (decimal)completedTasks /
                        assignedTasks *
                        100,
                        2);
            }

            decimal workloadPercentage = 0;

            if (totalEstimatedHours > 0)
            {
                workloadPercentage =
                    Math.Round(
                        (decimal)estimatedHours /
                        totalEstimatedHours *
                        100,
                        2);
            }

            return new TeamPerformanceMemberDto
            {
                UserId =
                    member.UserId,

                UserName =
                    member.User?.FullName
                    ?? member.User?.FullName
                    ?? member.User?.Email
                    ?? member.UserId.ToString(),

                // =================================================
                // CONFIGURED CONTRIBUTOR DATA
                // =================================================

                ContributorTypeId =
                    member.ContributorTypeId,

                ContributorType =
                    member.ContributorType?.Name
                    ?? "Unclassified",

                ContributorSubTypeId =
                    member.ContributorSubTypeId,

                ContributorSubType =
                    member.ContributorSubType?.Name,

                // =================================================
                // TEAM LEADER
                // =================================================

                IsTeamLeader =
                    member.IsTeamLeader,

                // =================================================
                // PERFORMANCE
                // =================================================

                AssignedTasks =
                    assignedTasks,

                CompletedTasks =
                    completedTasks,

                DelayedTasks =
                    delayedTasks,

                BlockedTasks =
                    blockedTasks,

                EstimatedHours =
                    estimatedHours,

                ActualHours =
                    actualHours,

                CompletionRate =
                    completionRate,

                WorkloadPercentage =
                    workloadPercentage
            };
        }
    }
}
