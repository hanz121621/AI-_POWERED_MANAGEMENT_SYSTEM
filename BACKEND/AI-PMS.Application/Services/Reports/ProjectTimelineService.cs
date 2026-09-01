using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.Interfaces.Repositories.Reports;
using AI_PMS.Application.Interfaces.Reports;
using AI_PMS.Domain.Entities.Tasks;

namespace AI_PMS.Application.Services.Reports
{
public class ProjectTimelineService
: IProjectTimelineService
{
private readonly IProjectTimelineRepository _repository;


    public ProjectTimelineService(
        IProjectTimelineRepository repository)
    {
        _repository = repository;
    }

    // =========================================================
    // REPORT-002
    // VIEW PROJECT TIMELINE
    // =========================================================

    public async Task<(
        bool Success,
        string Message,
        ProjectTimelineDto? Data
    )> GetProjectTimelineAsync(
        Guid managerId,
        Guid projectId)
    {
        // =====================================================
        // VALIDATE MANAGER
        // =====================================================

        if (managerId == Guid.Empty)
        {
            return (
                false,
                "Manager identity is required.",
                null
            );
        }

        // =====================================================
        // VALIDATE PROJECT
        // =====================================================

        if (projectId == Guid.Empty)
        {
            return (
                false,
                "Project ID is required.",
                null
            );
        }

        // =====================================================
        // AUTHORIZATION
        //
        // Manager can only view assigned projects.
        // =====================================================

        var project =
            await _repository.GetAuthorizedProjectAsync(
                projectId,
                managerId);

        if (project == null)
        {
            return (
                false,
                "Project not found or you are not authorized to view its timeline.",
                null
            );
        }

        // =====================================================
        // GET SPRINTS
        // =====================================================

        var sprints =
            await _repository.GetProjectSprintsAsync(
                projectId);

        // =====================================================
        // GET TASKS
        // =====================================================

        var tasks =
            await _repository.GetProjectTasksAsync(
                projectId);

        var now = DateTime.UtcNow;

        // =====================================================
        // PROJECT PROGRESS
        //
        // Progress is calculated dynamically from tasks.
        //
        // If project has tasks:
        // completed / total * 100
        //
        // If no tasks exist:
        // use current project progress only if available.
        // =====================================================

        decimal projectProgress = 0;

        if (tasks.Count > 0)
        {
            var completedTasks =
                tasks.Count(IsCompleted);

            projectProgress =
                Math.Round(
                    (decimal)completedTasks /
                    tasks.Count *
                    100m,
                    2);
        }
        else
        {
            projectProgress =
                Math.Clamp(
                    project.ProgressPercentage,
                    0m,
                    100m);
        }

        // =====================================================
        // CURRENT SPRINT
        // =====================================================

        var currentSprint =
            sprints
                .Where(s =>
                    s.StartDate <= now &&
                    s.EndDate >= now)
                .OrderByDescending(s => s.StartDate)
                .FirstOrDefault();

        // =====================================================
        // SPRINT TIMELINES
        // =====================================================

        var sprintDtos =
            sprints.Select(s =>
            {
                var sprintTasks =
                    tasks
                        .Where(t =>
                            t.SprintId == s.Id)
                        .ToList();

                var completed =
                    sprintTasks.Count(IsCompleted);

                var progress =
                    sprintTasks.Count > 0
                        ? Math.Round(
                            (decimal)completed /
                            sprintTasks.Count *
                            100m,
                            2)
                        : 0m;

                return new ProjectTimelineSprintDto
                {
                    SprintId = s.Id,

                    Name = s.Name,

                    Goal = s.Goal,

                    StartDate = s.StartDate,

                    EndDate = s.EndDate,

                    Status = s.Status.ToString(),

                    TotalTasks =
                        sprintTasks.Count,

                    CompletedTasks =
                        completed,

                    RemainingTasks =
                        sprintTasks.Count - completed,

                    ProgressPercentage =
                        progress,

                    IsCurrent =
                        currentSprint != null &&
                        currentSprint.Id == s.Id
                };
            }).ToList();

        // =====================================================
        // OVERDUE ITEMS
        //
        // 1. Overdue Sprint
        // 2. Overdue Task
        // 3. Project deadline
        //
        // Project deadline is included only if project itself
        // is not completed according to its stored status.
        // =====================================================

        var overdueItems =
            new List<ProjectTimelineOverdueItemDto>();

        // -----------------------------------------------------
        // OVERDUE SPRINTS
        // -----------------------------------------------------

        foreach (var sprint in sprints)
        {
            if (sprint.EndDate < now &&
                !string.Equals(
                    sprint.Status.ToString(),
                    "Completed",
                    StringComparison.OrdinalIgnoreCase))
            {
                overdueItems.Add(
                    new ProjectTimelineOverdueItemDto
                    {
                        Id = sprint.Id,

                        ItemType = "Sprint",

                        Name = sprint.Name,

                        Deadline = sprint.EndDate,

                        Status = sprint.Status.ToString()
                    });
            }
        }

        // -----------------------------------------------------
        // OVERDUE TASKS
        // -----------------------------------------------------

        foreach (var task in tasks)
        {
            if (task.DueDate < now &&
                !IsCompleted(task))
            {
                overdueItems.Add(
                    new ProjectTimelineOverdueItemDto
                    {
                        Id = task.Id,

                        ItemType = "Task",

                        Name = task.Title,

                        Deadline = task.DueDate,

                        Status = task.Status.ToString()
                    });
            }
        }

        // -----------------------------------------------------
        // OVERDUE PROJECT
        // -----------------------------------------------------

        var projectCompleted =
            project.ProgressPercentage >= 100m;

        if (project.Deadline < now &&
            !projectCompleted)
        {
            overdueItems.Add(
                new ProjectTimelineOverdueItemDto
                {
                    Id = project.Id,

                    ItemType = "Project",

                    Name = project.Name,

                    Deadline = project.Deadline,

                    Status = "Overdue"
                });
        }

        overdueItems =
            overdueItems
                .OrderBy(x => x.Deadline)
                .ToList();

        // =====================================================
        // MILESTONES
        //
        // No Milestone entity currently exists in the domain.
        // Therefore we explicitly report unavailable data.
        // =====================================================

        var result =
            new ProjectTimelineDto
            {
                ProjectId =
                    project.Id,

                ProjectName =
                    project.Name,

                ProjectStartDate =
                    project.StartDate,

                ProjectDeadline =
                    project.Deadline,

                CurrentProgressPercentage =
                    projectProgress,

                MilestonesAvailable =
                    false,

                MilestoneStatus =
                    "Unavailable: no Milestone entity or database table is currently configured.",

                Milestones =
                    new List<ProjectTimelineMilestoneDto>(),

                Sprints =
                    sprintDtos,

                OverdueItems =
                    overdueItems,

                OverdueItemCount =
                    overdueItems.Count
            };

        return (
            true,
            "Project timeline retrieved successfully.",
            result
        );
    }

    // =========================================================
    // TASK STATUS
    // =========================================================

    private static bool IsCompleted(
        TaskItem task)
    {
        return string.Equals(
            task.Status.ToString(),
            "Completed",
            StringComparison.OrdinalIgnoreCase);
    }
}

}
