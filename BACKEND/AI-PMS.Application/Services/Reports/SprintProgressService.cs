using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.Interfaces.Repositories.Reports;
using AI_PMS.Application.Interfaces.Reports;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Reports
{
    public class SprintProgressService : ISprintProgressService
    {
        private readonly ISprintProgressRepository
            _repository;

        public SprintProgressService(
            ISprintProgressRepository repository)
        {
            _repository = repository;
        }

        // =========================================================
        // REPORT-004
        // VIEW SPRINT PROGRESS
        // =========================================================

        public async Task<SprintProgressDto?>
            GetSprintProgressAsync(
                Guid projectId,
                Guid sprintId,
                Guid managerId,
                CancellationToken cancellationToken = default)
        {
            // =====================================================
            // 1. VERIFY MANAGER AUTHORIZATION
            // =====================================================

            var authorized =
                await _repository.ProjectBelongsToManagerAsync(
                    projectId,
                    managerId,
                    cancellationToken);

            if (!authorized)
            {
                throw new UnauthorizedAccessException(
                    "You are not authorized to view this project's sprint progress.");
            }

            // =====================================================
            // 2. GET SPRINT
            // =====================================================

            var sprint =
                await _repository.GetSprintAsync(
                    projectId,
                    sprintId,
                    cancellationToken);

            if (sprint == null)
            {
                throw new KeyNotFoundException(
                    "Sprint not found.");
            }

            // =====================================================
            // 3. GET ACTUAL TASKS
            // =====================================================

            var tasks =
                await _repository.GetSprintTasksAsync(
                    sprintId,
                    cancellationToken);

            // =====================================================
            // 4. CALCULATE STATISTICS
            // =====================================================

            var totalTasks = tasks.Count;

            var completedTasks = tasks.Count(
                t => t.Status == ProjectTaskStatus.Completed);

            var inProgressTasks = tasks.Count(
                t => t.Status == ProjectTaskStatus.InProgress);

            var pendingTasks = tasks.Count(
                t => t.Status == ProjectTaskStatus.Todo);

            var blockedTasks = tasks.Count(
                t => t.Status == ProjectTaskStatus.Blocked);

            // =====================================================
            // 5. OVERDUE TASKS
            // =====================================================

            var now = DateTime.UtcNow;

            var overdueTasks = tasks.Count(
                t =>
                    t.DueDate < now &&
                    t.Status != ProjectTaskStatus.Completed);

            // =====================================================
            // 6. COMPLETION PERCENTAGE
            // =====================================================

            decimal completionPercentage = 0;

            if (totalTasks > 0)
            {
                completionPercentage =
                    Math.Round(
                        (decimal)completedTasks /
                        totalTasks *
                        100,
                        2);
            }

            // =====================================================
            // 7. RETURN REPORT
            // =====================================================

            return new SprintProgressDto
            {
                SprintId = sprint.Id,

                ProjectId = sprint.ProjectId,

                SprintName = sprint.Name,

                Goal = sprint.Goal,

                StartDate = sprint.StartDate,

                EndDate = sprint.EndDate,

                SprintStatus = sprint.Status,

                TotalTasks = totalTasks,

                CompletedTasks = completedTasks,

                InProgressTasks = inProgressTasks,

                PendingTasks = pendingTasks,

                BlockedTasks = blockedTasks,

                OverdueTasks = overdueTasks,

                CompletionPercentage =
                    completionPercentage,

                GeneratedAt = DateTime.UtcNow
            };
        }
    }
}
