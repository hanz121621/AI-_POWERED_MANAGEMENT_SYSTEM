using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.DTOs.Teams;
using  AI_PMS.Application.Interfaces.Repositories.Sprints;

using AI_PMS.Application.Interfaces.Repositories.Projects;
using AI_PMS.Application.Interfaces.Repositories.Sprints;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Teams;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Teams
{
    public class TeamLeaderProjectService
        : ITeamLeaderProjectService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly ISprintRepository _sprintRepository;
        private readonly ITaskRepository _taskRepository;
        private readonly IUserRepository _userRepository;

        public TeamLeaderProjectService(
            IProjectRepository projectRepository,
            ITeamRepository teamRepository,
            ISprintRepository sprintRepository,
            ITaskRepository taskRepository,
            IUserRepository userRepository)
        {
            _projectRepository = projectRepository;
            _teamRepository = teamRepository;
            _sprintRepository = sprintRepository;
            _taskRepository = taskRepository;
            _userRepository = userRepository;
        }

        // =========================================================
        // TL-PROJECT-001
        // VIEW ASSIGNED PROJECTS
        // =========================================================

        public async Task<IEnumerable<TeamLeaderProjectDto>>
            GetAssignedProjectsAsync(
                Guid teamLeaderId)
        {
            if (teamLeaderId == Guid.Empty)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            // -----------------------------------------------------
            // Find teams where this user is an active Team Leader
            // -----------------------------------------------------

            var teams =
                await _teamRepository.GetAllAsync();

            var leaderTeams =
                teams
                    .Where(t =>
                        t.IsActive &&
                        t.TeamMembers.Any(tm =>
                            tm.UserId == teamLeaderId &&
                            tm.IsTeamLeader &&
                            tm.IsActive &&
                            tm.User != null &&
                            tm.User.IsActive))
                    .ToList();

            if (!leaderTeams.Any())
            {
                return Enumerable.Empty<TeamLeaderProjectDto>();
            }

            var teamIds =
                leaderTeams
                    .Select(t => t.Id)
                    .ToHashSet();

            // -----------------------------------------------------
            // Get projects
            // -----------------------------------------------------

            var projects =
                await _projectRepository.GetAllAsync();

            var assignedProjects =
                projects
                    .Where(p =>
                        !p.IsDeleted &&
                        p.TeamId.HasValue &&
                        teamIds.Contains(p.TeamId.Value))
                    .OrderBy(p => p.Name)
                    .ToList();

            var result =
                new List<TeamLeaderProjectDto>();

            foreach (var project in assignedProjects)
            {
                var team =
                    leaderTeams.FirstOrDefault(t =>
                        t.Id == project.TeamId);

                string managerName = string.Empty;

                if (project.ManagerId.HasValue)
                {
                    var manager =
                        await _userRepository.GetByIdAsync(
                            project.ManagerId.Value);

                    managerName =
                        manager?.FullName ?? string.Empty;
                }

                // -------------------------------------------------
                // Current sprint
                // -------------------------------------------------

                Guid? currentSprintId = null;
                string? currentSprintName = null;

                var sprints =
                    await _sprintRepository
                        .GetProjectSprintsAsync(project.Id);

                var now = DateTime.UtcNow;

                var currentSprint =
                    sprints
                        .Where(s =>
                            s.TeamId == project.TeamId &&
                            s.StartDate <= now &&
                            s.EndDate >= now)
                        .OrderByDescending(s => s.StartDate)
                        .FirstOrDefault();

                if (currentSprint != null)
                {
                    currentSprintId =
                        currentSprint.Id;

                    currentSprintName =
                        currentSprint.Name;
                }

                result.Add(
                    new TeamLeaderProjectDto
                    {
                        Id = project.Id,

                        Name = project.Name,

                        Description =
                            project.Description
                            ?? string.Empty,

                        StatusId =
                            project.StatusId,

                        StatusName =
                            project.Status?.Name
                            ?? string.Empty,

                        ProgressPercentage =
                            project.ProgressPercentage,

                        TeamId =
                            project.TeamId,

                        TeamName =
                            team?.Name
                            ?? string.Empty,

                        ManagerId =
                            project.ManagerId,

                        ManagerName =
                            managerName,

                        PriorityId =
                            (int)project.Priority,

                        PriorityName =
                            project.Priority.ToString(),

                        StartDate =
                            project.StartDate,

                        Deadline =
                            project.Deadline,

                        CurrentSprintId =
                            currentSprintId,

                        CurrentSprintName =
                            currentSprintName
                    });
            }

            return result;
        }

        // =========================================================
        // INTERFACE IMPLEMENTATION
        // TL-PROJECT-001
        // GET MY PROJECTS
        // =========================================================

        public async Task<IEnumerable<ProjectDto>>
            GetMyProjectsAsync(
                Guid teamLeaderId)
        {
            if (teamLeaderId == Guid.Empty)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            var assignedProjects =
                await GetAssignedProjectsAsync(
                    teamLeaderId);

            var result =
                new List<ProjectDto>();

            foreach (var project in assignedProjects)
            {
                var taskCount = 0;
                var sprintCount = 0;

                // -------------------------------------------------
                // Count sprints
                // -------------------------------------------------

                var sprints =
                    await _sprintRepository
                        .GetProjectSprintsAsync(project.Id);

                sprintCount =
                    sprints.Count();

                // -------------------------------------------------
                // Count tasks through project sprints
                // -------------------------------------------------

                foreach (var sprint in sprints)
                {
                    var sprintTasks =
                        await _taskRepository
                            .GetSprintTasksAsync(sprint.Id);

                    taskCount +=
                        sprintTasks.Count(t => !t.IsDeleted);
                }

                result.Add(
                    new ProjectDto
                    {
                        Id =
                            project.Id,

                        Name =
                            project.Name,

                        Description =
                            project.Description,

                        StatusId =
                            project.StatusId,

                        StatusName =
                            project.StatusName,

                        // We don't have these flags on the
                        // actual status entity, so derive them
                        // from the actual project data.

                        IsStatusActive =
                            true,

                        IsCompletedStatus =
                            project.ProgressPercentage >= 100,

                        IsArchivedStatus =
                            false,

                        IsCancelledStatus =
                            false,

                        ManagerId =
                            project.ManagerId,

                        TeamId =
                            project.TeamId,

                        PriorityId =
                            project.PriorityId,

                        PriorityName =
                            project.PriorityName,

                        StartDate =
                            project.StartDate,

                        Deadline =
                            project.Deadline,

                        ProgressPercentage =
                            project.ProgressPercentage,

                        TaskCount =
                            taskCount,

                        SprintCount =
                            sprintCount,

                        CreatedAt =
                            DateTime.UtcNow,

                        UpdatedAt =
                            null,

                        CompletedAt =
                            project.ProgressPercentage >= 100
                                ? DateTime.UtcNow
                                : null,

                        ArchivedAt =
                            null,

                        IsCompleted =
                            project.ProgressPercentage >= 100,

                        IsArchived =
                            false
                    });
            }

            return result;
        }

        // =========================================================
        // TL-PROJECT-002
        // GET PROJECT
        // =========================================================

        public async Task<ProjectDto?>
            GetProjectAsync(
                Guid teamLeaderId,
                Guid projectId)
        {
            if (teamLeaderId == Guid.Empty ||
                projectId == Guid.Empty)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            var project =
                await _projectRepository
                    .GetByIdAsync(projectId);

            if (project == null ||
                project.IsDeleted)
            {
                return null;
            }

            // -----------------------------------------------------
            // Project must belong to a team
            // -----------------------------------------------------

            if (!project.TeamId.HasValue)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            var membership =
                await _teamRepository
                    .GetTeamLeaderMembershipAsync(
                        project.TeamId.Value,
                        teamLeaderId);

            if (membership == null)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            // -----------------------------------------------------
            // Count tasks
            // -----------------------------------------------------

            var sprints =
                await _sprintRepository
                    .GetProjectSprintsAsync(project.Id);

            var taskCount = 0;

            foreach (var sprint in sprints)
            {
                var sprintTasks =
                    await _taskRepository
                        .GetSprintTasksAsync(sprint.Id);

                taskCount +=
                    sprintTasks.Count(t => !t.IsDeleted);
            }

            var managerName = string.Empty;

            if (project.ManagerId.HasValue)
            {
                var manager =
                    await _userRepository
                        .GetByIdAsync(
                            project.ManagerId.Value);

                managerName =
                    manager?.FullName ?? string.Empty;
            }

            return new ProjectDto
            {
                Id =
                    project.Id,

                Name =
                    project.Name,

                Description =
                    project.Description,

                StatusId =
                    project.StatusId,

                StatusName =
                    project.Status?.Name
                    ?? string.Empty,

                IsStatusActive =
                    true,

                IsCompletedStatus =
                    project.ProgressPercentage >= 100,

                IsArchivedStatus =
                    false,

                IsCancelledStatus =
                    false,

                ManagerId =
                    project.ManagerId,

                TeamId =
                    project.TeamId,

                PriorityId =
                    (int)project.Priority,

                PriorityName =
                    project.Priority.ToString(),

                StartDate =
                    project.StartDate,

                Deadline =
                    project.Deadline,

                ProgressPercentage =
                    project.ProgressPercentage,

                TaskCount =
                    taskCount,

                SprintCount =
                    sprints.Count(),

                CreatedAt =
                    project.CreatedAt,

                UpdatedAt =
                    project.UpdatedAt,

                CompletedAt =
                    project.ProgressPercentage >= 100
                        ? project.UpdatedAt
                        : null,

                ArchivedAt =
                    null,

                IsCompleted =
                    project.ProgressPercentage >= 100,

                IsArchived =
                    false
            };
        }

        // =========================================================
        // TL-PROJECT-002
        // VIEW PROJECT DETAILS
        // =========================================================

        public async Task<TeamLeaderProjectDetailsDto?>
            GetProjectDetailsAsync(
                Guid teamLeaderId,
                Guid projectId)
        {
            if (teamLeaderId == Guid.Empty ||
                projectId == Guid.Empty)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            // -----------------------------------------------------
            // Get project
            // -----------------------------------------------------

            var project =
                await _projectRepository
                    .GetByIdAsync(projectId);

            if (project == null ||
                project.IsDeleted)
            {
                return null;
            }

            // -----------------------------------------------------
            // Project must belong to a team
            // -----------------------------------------------------

            if (!project.TeamId.HasValue)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            var teamId =
                project.TeamId.Value;

            // -----------------------------------------------------
            // Verify Team Leader
            // -----------------------------------------------------

            var membership =
                await _teamRepository
                    .GetTeamLeaderMembershipAsync(
                        teamId,
                        teamLeaderId);

            if (membership == null)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            // -----------------------------------------------------
            // Get team
            // -----------------------------------------------------

            var team =
                await _teamRepository
                    .GetByIdAsync(teamId);

            if (team == null ||
                !team.IsActive)
            {
                throw new InvalidOperationException(
                    "Unable to load team information. Please try again.");
            }

            // -----------------------------------------------------
            // Manager
            // -----------------------------------------------------

            string? managerName = null;

            if (project.ManagerId.HasValue)
            {
                var manager =
                    await _userRepository
                        .GetByIdAsync(
                            project.ManagerId.Value);

                managerName =
                    manager?.FullName;
            }

            // -----------------------------------------------------
            // Team Leader
            // -----------------------------------------------------

            var teamLeader =
                team.TeamMembers
                    .FirstOrDefault(tm =>
                        tm.UserId == teamLeaderId &&
                        tm.IsTeamLeader &&
                        tm.IsActive);

            // -----------------------------------------------------
            // Sprints
            // -----------------------------------------------------

            var sprints =
                await _sprintRepository
                    .GetProjectSprintsAsync(projectId);

            var now =
                DateTime.UtcNow;

            var currentSprint =
                sprints
                    .Where(s =>
                        s.TeamId == teamId &&
                        s.StartDate <= now &&
                        s.EndDate >= now)
                    .OrderByDescending(
                        s => s.StartDate)
                    .FirstOrDefault();

            // -----------------------------------------------------
            // Team members
            // -----------------------------------------------------

            var members =
                team.TeamMembers
                    .Where(tm =>
                        tm.IsActive &&
                        tm.User != null &&
                        tm.User.IsActive)
                    .Select(tm =>
                        new TeamLeaderProjectMemberDto
                        {
                            UserId =
                                tm.UserId,

                            FullName =
                                tm.User!.FullName,

                            Email =
                                tm.User.Email,

                            IsTeamLeader =
                                tm.IsTeamLeader,

                            IsActive =
                                tm.User.IsActive,

                            JoinedAt =
                                tm.JoinedAt
                        })
                    .ToList();

            // -----------------------------------------------------
            // Current sprint tasks
            // -----------------------------------------------------

            var taskDtos =
                new List<TeamLeaderProjectTaskDto>();

            if (currentSprint != null)
            {
                var tasks =
                    await _taskRepository
                        .GetSprintTasksAsync(
                            currentSprint.Id);

                tasks =
                    tasks
                        .Where(t => !t.IsDeleted)
                        .ToList();

                foreach (var task in tasks)
                {
                    string? developerName = null;

                    if (task.AssignedContributorSDId.HasValue)
                    {
                        var developer =
                            await _userRepository
                                .GetByIdAsync(
                                    task.AssignedContributorSDId.Value);

                        developerName =
                            developer?.FullName;
                    }

                    taskDtos.Add(
                        new TeamLeaderProjectTaskDto
                        {
                            Id =
                                task.Id,

                            SprintId =
                                task.SprintId,

                            Title =
                                task.Title,

                            Description =
                                task.Description,

                            Status =
                                task.Status,

                            Priority =
                                task.Priority,

                            EstimatedHours =
                                task.EstimatedHours,

                            ActualHours =
                                task.ActualHours,

                            DueDate =
                                task.DueDate,

                            AssignedContributorSDId =
                                task.AssignedContributorSDId,

                            AssignedDeveloperName =
                                developerName,

                            CreatedAt =
                                task.CreatedAt,

                            UpdatedAt =
                                task.UpdatedAt
                        });
                }
            }

            // -----------------------------------------------------
            // Build project details
            // -----------------------------------------------------

            return new TeamLeaderProjectDetailsDto
            {
                Id =
                    project.Id,

                Name =
                    project.Name,

                Description =
                    project.Description
                    ?? string.Empty,

                StatusId =
                    project.StatusId,

                StatusName =
                    project.Status?.Name
                    ?? string.Empty,

                ProgressPercentage =
                    project.ProgressPercentage,

                PriorityId =
                    (int)project.Priority,

                PriorityName =
                    project.Priority.ToString(),

                StartDate =
                    project.StartDate,

                Deadline =
                    project.Deadline,

                ManagerId =
                    project.ManagerId,

                ManagerName =
                    managerName,

                TeamId =
                    team.Id,

                TeamName =
                    team.Name,

                TeamLeaderId =
                    teamLeader?.UserId,

                TeamLeaderName =
                    teamLeader?.User?.FullName,

                // -------------------------------------------------
                // Project specification
                // -------------------------------------------------

                Objectives =
                    project.Specification?.Objectives,

                Scope =
                    project.Specification?.Scope,

                FunctionalRequirements =
                    project.Specification
                        ?.FunctionalRequirements,

                NonFunctionalRequirements =
                    project.Specification
                        ?.NonFunctionalRequirements,

                Deliverables =
                    project.Specification?.Deliverables,

                TechnologyStack =
                    project.Specification?.TechnologyStack,

                // -------------------------------------------------
                // Current sprint
                // -------------------------------------------------

                CurrentSprintId =
                    currentSprint?.Id,

                CurrentSprintName =
                    currentSprint?.Name,

                CurrentSprintGoal =
                    currentSprint?.Goal,

                CurrentSprintStatus =
                    currentSprint?.Status,

                CurrentSprintStartDate =
                    currentSprint?.StartDate,

                CurrentSprintEndDate =
                    currentSprint?.EndDate,

                // -------------------------------------------------
                // Team
                // -------------------------------------------------

                TeamMembers =
                    members,

                // -------------------------------------------------
                // Tasks
                // -------------------------------------------------

                Tasks =
                    taskDtos,

                // -------------------------------------------------
                // Audit
                // -------------------------------------------------

                CreatedAt =
                    project.CreatedAt,

                UpdatedAt =
                    project.UpdatedAt
            };
        }
    }
}