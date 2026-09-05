using AI_PMS.Application.DTOs.Sprints;
using AI_PMS.Application.Interfaces.Sprints;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Application.Interfaces.Repositories.Projects;
using AI_PMS.Domain.Entities.Sprints;
using  AI_PMS.Application.Interfaces.Repositories.Sprints;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Sprints
{
    public class SprintService : ISprintService
    {
        private readonly ISprintRepository _sprintRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly ITaskRepository _taskRepository;
        private readonly IUserRepository _userRepository;

   public SprintService(
    ISprintRepository sprintRepository,
    IProjectRepository projectRepository,
    ITeamRepository teamRepository,
    ITaskRepository taskRepository,
    IUserRepository userRepository)
{
    _sprintRepository = sprintRepository;
    _projectRepository = projectRepository;
    _teamRepository = teamRepository;
    _taskRepository = taskRepository;
    _userRepository = userRepository;
}

        // =========================================================
        // SPRINT-001
        // CREATE SPRINT
        // =========================================================

        public async Task<(bool Success, string Message)>
            CreateSprintAsync(
                Guid managerId,
                CreateSprintDto dto)
        {
            if (managerId == Guid.Empty)
            {
                return (
                    false,
                    "Invalid manager identity."
                );
            }

            if (dto == null)
            {
                return (
                    false,
                    "Sprint information is required."
                );
            }

            // -----------------------------------------------------
            // GET PROJECT
            // -----------------------------------------------------

            var project =
                await _projectRepository.GetByIdAsync(
                    dto.ProjectId);

            if (project == null)
            {
                return (
                    false,
                    "Project not found."
                );
            }

            // -----------------------------------------------------
            // MANAGER AUTHORIZATION
            // -----------------------------------------------------

            if (!project.ManagerId.HasValue ||
                project.ManagerId.Value != managerId)
            {
                return (
                    false,
                    "You are not authorized to create a Sprint for this project."
                );
            }

            // -----------------------------------------------------
            // PROJECT MUST BE ELIGIBLE
            // -----------------------------------------------------

            if (project.Status == null)
            {
                return (
                    false,
                    "Project status could not be determined."
                );
            }

            if (!project.Status.IsActive ||
                project.Status.IsArchivedStatus ||
                project.Status.IsCancelledStatus ||
                project.Status.IsCompletedStatus)
            {
                return (
                    false,
                    "Sprints cannot be created for the current project status."
                );
            }

            // -----------------------------------------------------
            // NAME
            // -----------------------------------------------------

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return (
                    false,
                    "Sprint name is required."
                );
            }

            var sprintName = dto.Name.Trim();

            // -----------------------------------------------------
            // DATE VALIDATION
            // -----------------------------------------------------

            if (dto.StartDate > dto.EndDate)
            {
                return (
                    false,
                    "Sprint end date cannot be earlier than the start date."
                );
            }

            // -----------------------------------------------------
            // PROJECT TIMELINE
            // -----------------------------------------------------

            if (dto.StartDate < project.StartDate ||
                dto.EndDate > project.Deadline)
            {
                return (
                    false,
                    "Sprint dates must fall within the project timeline."
                );
            }

            // -----------------------------------------------------
            // DUPLICATE NAME
            // -----------------------------------------------------

            var existingSprint =
                await _sprintRepository.GetByNameAsync(
                    dto.ProjectId,
                    sprintName);

            if (existingSprint != null)
            {
                return (
                    false,
                    "A Sprint with this name already exists in this project."
                );
            }

            // -----------------------------------------------------
            // SPRINT DATE CONFLICT
            // -----------------------------------------------------

            var projectSprints =
                await _sprintRepository
                    .GetProjectSprintsAsync(dto.ProjectId);

            var dateConflict =
                projectSprints.Any(s =>
                    dto.StartDate <= s.EndDate &&
                    dto.EndDate >= s.StartDate);

            if (dateConflict)
            {
                return (
                    false,
                    "The Sprint dates conflict with an existing Sprint."
                );
            }

            // -----------------------------------------------------
            // CREATE
            // -----------------------------------------------------

            var sprint = new Sprint
            {
                Id = Guid.NewGuid(),

                ProjectId = dto.ProjectId,

                CreatedBy = managerId,

                Name = sprintName,

                Goal = string.IsNullOrWhiteSpace(dto.Goal)
                    ? string.Empty
                    : dto.Goal.Trim(),
StartDate = dto.StartDate.ToUniversalTime(),
    EndDate = dto.EndDate.ToUniversalTime(),
    

                Priority = dto.Priority,

                // Status comes from configured/default workflow.
                // Current Sprint entity uses Planned as the
                // configured initial value.
                IsDeleted = false,

                CreatedAt = DateTime.UtcNow,

                UpdatedAt = null,

                // IMPORTANT:
                // Sprint is NOT automatically assigned to a Team.
                TeamId = null
            };

            await _sprintRepository.AddAsync(sprint);

            return (
                true,
                "Sprint created successfully."
            );
        }

                 
            

// =========================================================
// DEV-SPRINT-001 / STAFF-SPRINT-001
// VIEW MY SPRINTS
// =========================================================

public async Task<IEnumerable<SprintDto>> GetMySprintsAsync(
    Guid contributorId)
{
    // ---------------------------------------------------------
    // 1. VALIDATE USER ID
    // ---------------------------------------------------------

    if (contributorId == Guid.Empty)
    {
        throw new InvalidOperationException(
            "Invalid contributor identity.");
    }

    // ---------------------------------------------------------
    // 2. GET USER
    // ---------------------------------------------------------

    var contributor =
        await _userRepository.GetByIdAsync(
            contributorId);

    if (contributor == null)
    {
        throw new InvalidOperationException(
            "Contributor not found.");
    }

    // ---------------------------------------------------------
    // 3. USER MUST BE CONTRIBUTOR
    // ---------------------------------------------------------

    if (contributor.Role != Role.Contributor)
    {
        throw new InvalidOperationException(
            "Only Contributors can access Sprint Participation.");
    }

    // ---------------------------------------------------------
    // 4. USER MUST BE ACTIVE
    // ---------------------------------------------------------

    if (!contributor.IsActive)
    {
        throw new InvalidOperationException(
            "Contributor account is inactive.");
    }

    // ---------------------------------------------------------
    // 5. GET ALL SPRINTS
    // ---------------------------------------------------------

    var allSprints =
        await _sprintRepository.GetAllAsync();

    // ---------------------------------------------------------
    // 6. FIND SPRINTS WHERE CONTRIBUTOR HAS TASKS
    // ---------------------------------------------------------

    var result = new List<SprintDto>();

    foreach (var sprint in allSprints)
    {
        var tasks =
            await _taskRepository
                .GetSprintTasksAsync(sprint.Id);

        // Only expose sprints where the contributor
        // actually has assigned work.
        var hasMyTasks =
            tasks.Any(t =>
                t.AssignedContributorSDId ==
                contributorId);

        if (!hasMyTasks)
            continue;

        result.Add(
            MapToDto(sprint));
    }

    // ---------------------------------------------------------
    // 7. RETURN
    // ---------------------------------------------------------

    return result;
}


// =========================================================
// DEV-SPRINT-001 / STAFF-SPRINT-001
// VIEW MY SPRINT TASKS
// =========================================================

public async Task<object?> GetMySprintTasksAsync(
    Guid contributorId,
    Guid sprintId)
{
    // ---------------------------------------------------------
    // 1. VALIDATE CONTRIBUTOR
    // ---------------------------------------------------------

    if (contributorId == Guid.Empty)
    {
        return null;
    }

    var contributor =
        await _userRepository.GetByIdAsync(
            contributorId);

    if (contributor == null)
    {
        return null;
    }

    if (contributor.Role != Role.Contributor ||
        !contributor.IsActive)
    {
        return null;
    }

    // ---------------------------------------------------------
    // 2. GET SPRINT
    // ---------------------------------------------------------

    var sprint =
        await _sprintRepository.GetByIdAsync(
            sprintId);

    if (sprint == null)
    {
        return null;
    }

    // ---------------------------------------------------------
    // 3. GET SPRINT TASKS
    // ---------------------------------------------------------

    var allTasks =
        await _taskRepository
            .GetSprintTasksAsync(sprintId);

    // ---------------------------------------------------------
    // 4. ONLY THIS CONTRIBUTOR'S TASKS
    // ---------------------------------------------------------

    var myTasks =
        allTasks
            .Where(t =>
                t.AssignedContributorSDId ==
                contributorId)
            .Select(task => new
            {
                task.Id,
                task.SprintId,
                task.Title,
                task.Description,
                task.AssignedContributorSDId,
                task.Priority,
                task.Status,
                task.EstimatedHours,
                task.ActualHours,
                task.DueDate,
                task.CreatedAt,
                task.UpdatedAt
            })
            .ToList();

    // ---------------------------------------------------------
    // 5. NO TASKS
    // ---------------------------------------------------------

    if (!myTasks.Any())
    {
        return new
        {
            Sprint = MapToDto(sprint),
            Tasks = myTasks,
            TaskCount = 0,
            HasTasks = false,
            Message = "No sprint tasks assigned."
        };
    }

    // ---------------------------------------------------------
    // 6. RETURN SPRINT + TASKS
    // ---------------------------------------------------------

    return new
    {
        Sprint = MapToDto(sprint),

        Tasks = myTasks,

        TaskCount = myTasks.Count,

        HasTasks = true,

        Message = (string?)null
    };
}


// =========================================================
// DEV-SPRINT-002 / STAFF-SPRINT-002
// VIEW MY SPRINT GOALS AND PROGRESS
// =========================================================

public async Task<SprintProgressDto?> GetMySprintProgressAsync(
    Guid contributorId,
    Guid sprintId)
{
    // ---------------------------------------------------------
    // 1. VALIDATE CONTRIBUTOR
    // ---------------------------------------------------------

    if (contributorId == Guid.Empty)
    {
        return null;
    }

    var contributor =
        await _userRepository.GetByIdAsync(
            contributorId);

    if (contributor == null)
    {
        return null;
    }

    if (contributor.Role != Role.Contributor ||
        !contributor.IsActive)
    {
        return null;
    }

    // ---------------------------------------------------------
    // 2. GET SPRINT
    // ---------------------------------------------------------

    var sprint =
        await _sprintRepository.GetByIdAsync(
            sprintId);

    if (sprint == null)
    {
        return null;
    }

    // ---------------------------------------------------------
    // 3. GET ALL SPRINT TASKS
    // ---------------------------------------------------------

    var allTasks =
        await _taskRepository
            .GetSprintTasksAsync(
                sprintId);

    // ---------------------------------------------------------
    // 4. VERIFY CONTRIBUTOR HAS ACCESS
    // ---------------------------------------------------------

    var myTasks =
        allTasks
            .Where(t =>
                t.AssignedContributorSDId ==
                contributorId)
            .ToList();

    if (!myTasks.Any())
    {
        return new SprintProgressDto
        {
            SprintId = sprint.Id,
            ProjectId = sprint.ProjectId,
            SprintName = sprint.Name,
            Goal = sprint.Goal,
            Status = sprint.Status.ToString(),
            TeamId = sprint.TeamId,

            TotalTasks = 0,
            CompletedTasks = 0,
            InProgressTasks = 0,
            PendingTasks = 0,
            InReviewTasks = 0,
            BlockedTasks = 0,
            OverdueTasks = 0,

            CompletionPercentage = 0,
            TeamProgressPercentage = 0,

            HasTasks = false,

            Message = "No sprint tasks assigned."
        };
    }

    // ---------------------------------------------------------
    // 5. CALCULATE TEAM / SPRINT PROGRESS
    // ---------------------------------------------------------

    int totalTasks =
        allTasks.Count;

    int completedTasks =
        allTasks.Count(t =>
            t.Status ==
            ProjectTaskStatus.Completed);

    int inProgressTasks =
        allTasks.Count(t =>
            t.Status ==
            ProjectTaskStatus.InProgress);

    int pendingTasks =
        allTasks.Count(t =>
            t.Status ==
            ProjectTaskStatus.Todo);

    int inReviewTasks =
        allTasks.Count(t =>
            t.Status ==
            ProjectTaskStatus.InReview);

    int blockedTasks =
        allTasks.Count(t =>
            t.Status ==
            ProjectTaskStatus.Blocked);

    int overdueTasks =
        allTasks.Count(t =>
            t.DueDate.Date < DateTime.UtcNow.Date &&
            t.Status !=
                ProjectTaskStatus.Completed);

    // ---------------------------------------------------------
    // 6. CONTRIBUTOR PROGRESS
    // ---------------------------------------------------------

    int myTotalTasks =
        myTasks.Count;

    int myCompletedTasks =
        myTasks.Count(t =>
            t.Status ==
            ProjectTaskStatus.Completed);

    double myProgress =
        myTotalTasks == 0
            ? 0
            : Math.Round(
                (double)myCompletedTasks /
                myTotalTasks * 100,
                2);

    // ---------------------------------------------------------
    // 7. TEAM / SPRINT PROGRESS
    // ---------------------------------------------------------

    double teamProgress =
        totalTasks == 0
            ? 0
            : Math.Round(
                (double)completedTasks /
                totalTasks * 100,
                2);

    // ---------------------------------------------------------
    // 8. RETURN PROGRESS
    // ---------------------------------------------------------

    return new SprintProgressDto
    {
        SprintId =
            sprint.Id,

        ProjectId =
            sprint.ProjectId,

        SprintName =
            sprint.Name,

        Goal =
            sprint.Goal,

        Status =
            sprint.Status.ToString(),

        TeamId =
            sprint.TeamId,

        TotalTasks =
            totalTasks,

        CompletedTasks =
            completedTasks,

        InProgressTasks =
            inProgressTasks,

        PendingTasks =
            pendingTasks,

        InReviewTasks =
            inReviewTasks,

        BlockedTasks =
            blockedTasks,

        OverdueTasks =
            overdueTasks,

        CompletionPercentage =
            teamProgress,

        TeamProgressPercentage =
            teamProgress,

        TeamLeaderProgressPercentage =
            teamProgress,

        HasTasks =
            true,

        Message =
            null
    };
}

        // =========================================================
        // GET ALL SPRINTS
        // =========================================================

        public async Task<IEnumerable<SprintDto>>
            GetAllSprintsAsync()
        {
            var sprints =
                await _sprintRepository.GetAllAsync();

            return sprints
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // GET SPRINT BY ID
        // =========================================================

        public async Task<SprintDto?>
            GetSprintByIdAsync(Guid id)
        {
            var sprint =
                await _sprintRepository.GetByIdAsync(id);

            if (sprint == null)
                return null;

            return MapToDto(sprint);
        }

        // =========================================================
        // GET PROJECT SPRINTS
        // =========================================================

        public async Task<IEnumerable<SprintDto>>
            GetProjectSprintsAsync(
                Guid projectId)
        {
            var sprints =
                await _sprintRepository
                    .GetProjectSprintsAsync(projectId);

            return sprints
                .Select(MapToDto)
                .ToList();
        }

        // =========================================================
        // SPRINT-002
        // UPDATE SPRINT
        // =========================================================

        public async Task<(bool Success, string Message)>
            UpdateSprintAsync(
                Guid id,
                UpdateSprintDto dto)
        {
            if (dto == null)
            {
                return (
                    false,
                    "Sprint information is required."
                );
            }

            var sprint =
                await _sprintRepository.GetByIdAsync(id);

            if (sprint == null)
            {
                return (
                    false,
                    "Sprint not found."
                );
            }

            // -----------------------------------------------------
            // GET PROJECT
            // -----------------------------------------------------

            var project =
                await _projectRepository.GetByIdAsync(
                    sprint.ProjectId);

            if (project == null)
            {
                return (
                    false,
                    "Project not found."
                );
            }

            // -----------------------------------------------------
            // NAME
            // -----------------------------------------------------

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return (
                    false,
                    "Sprint name is required."
                );
            }

            var newName =
                dto.Name.Trim();

            var newGoal =
                string.IsNullOrWhiteSpace(dto.Goal)
                    ? string.Empty
                    : dto.Goal.Trim();

            // -----------------------------------------------------
            // STATUS RULE
            // -----------------------------------------------------

            if (sprint.Status == Domain.Enums.SprintStatus.Completed)
            {
                return (
                    false,
                    "A completed Sprint cannot be modified."
                );
            }

            // -----------------------------------------------------
            // DATES
            // -----------------------------------------------------

            if (dto.StartDate > dto.EndDate)
            {
                return (
                    false,
                    "Sprint end date cannot be earlier than the start date."
                );
            }

            // -----------------------------------------------------
            // PROJECT TIMELINE
            // -----------------------------------------------------

            if (dto.StartDate < project.StartDate ||
                dto.EndDate > project.Deadline)
            {
                return (
                    false,
                    "Sprint dates must fall within the project timeline."
                );
            }

            // -----------------------------------------------------
            // DUPLICATE NAME
            // -----------------------------------------------------

            var existingSprint =
                await _sprintRepository.GetByNameAsync(
                    sprint.ProjectId,
                    newName);

            if (existingSprint != null &&
                existingSprint.Id != id)
            {
                return (
                    false,
                    "A Sprint with this name already exists in this project."
                );
            }

            // -----------------------------------------------------
            // CONFLICT WITH OTHER SPRINTS
            // -----------------------------------------------------

            var projectSprints =
                await _sprintRepository
                    .GetProjectSprintsAsync(
                        sprint.ProjectId);

            var dateConflict =
                projectSprints.Any(s =>
                    s.Id != id &&
                    dto.StartDate <= s.EndDate &&
                    dto.EndDate >= s.StartDate);

            if (dateConflict)
            {
                return (
                    false,
                    "The updated Sprint dates conflict with another Sprint."
                );
            }

            // -----------------------------------------------------
            // CHECK CHANGES
            // -----------------------------------------------------

            bool anythingChanged =
                !string.Equals(
                    sprint.Name.Trim(),
                    newName,
                    StringComparison.OrdinalIgnoreCase)
                ||
                !string.Equals(
                    sprint.Goal?.Trim() ?? string.Empty,
                    newGoal,
                    StringComparison.Ordinal)
                ||
                sprint.StartDate != dto.StartDate
                ||
                sprint.EndDate != dto.EndDate
                ||
                sprint.Priority != dto.Priority;

            if (!anythingChanged)
            {
                return (
                    false,
                    "No changes detected. The Sprint already contains these values."
                );
            }

            // -----------------------------------------------------
            // UPDATE
            // -----------------------------------------------------

            sprint.Name = newName;

            sprint.Goal = newGoal;

            sprint.StartDate = dto.StartDate;

            sprint.EndDate = dto.EndDate;

            sprint.Priority = dto.Priority;

            sprint.UpdatedAt = DateTime.UtcNow;

            await _sprintRepository.UpdateAsync(sprint);

            return (
                true,
                "Sprint updated successfully."
            );
        }

        // =========================================================
        // SOFT DELETE SPRINT
        // =========================================================

        public async Task<bool>
            DeleteSprintAsync(Guid id)
        {
            var sprint =
                await _sprintRepository.GetByIdAsync(id);

            if (sprint == null)
                return false;

            sprint.IsDeleted = true;

            sprint.UpdatedAt = DateTime.UtcNow;

            await _sprintRepository.UpdateAsync(sprint);

            return true;
        }

        // =========================================================
        // SPRINT-003
        // ASSIGN SPRINT TO TEAM
        // =========================================================
// =========================================================
// SPRINT-003
// ASSIGN SPRINT TO TEAM
// =========================================================

public async Task<(bool Success, string Message)>
    AssignSprintToTeamAsync(
        Guid managerId,
        Guid sprintId,
        Guid teamId)
{
    // -----------------------------------------------------
    // 1. VALIDATE MANAGER
    // -----------------------------------------------------

    if (managerId == Guid.Empty)
    {
        return (
            false,
            "Invalid manager identity."
        );
    }

    // -----------------------------------------------------
    // 2. VALIDATE SPRINT ID
    // -----------------------------------------------------

    if (sprintId == Guid.Empty)
    {
        return (
            false,
            "Invalid Sprint."
        );
    }

    // -----------------------------------------------------
    // 3. VALIDATE TEAM ID
    // -----------------------------------------------------

    if (teamId == Guid.Empty)
    {
        return (
            false,
            "Invalid Team."
        );
    }

    // -----------------------------------------------------
    // 4. GET SPRINT
    // -----------------------------------------------------

    var sprint =
        await _sprintRepository.GetByIdAsync(sprintId);

    if (sprint == null)
    {
        return (
            false,
            "Sprint not found."
        );
    }

    // -----------------------------------------------------
    // 5. GET PROJECT
    // -----------------------------------------------------

    var project =
        await _projectRepository.GetByIdAsync(
            sprint.ProjectId);

    if (project == null)
    {
        return (
            false,
            "Project not found."
        );
    }

    // -----------------------------------------------------
    // 6. MANAGER AUTHORIZATION
    // -----------------------------------------------------

    if (!project.ManagerId.HasValue ||
        project.ManagerId.Value != managerId)
    {
        return (
            false,
            "You are not authorized to assign this Sprint."
        );
    }

    // -----------------------------------------------------
    // 7. PROJECT MUST HAVE A TEAM
    // -----------------------------------------------------

    if (!project.TeamId.HasValue ||
        project.TeamId.Value == Guid.Empty)
    {
        return (
            false,
            "No Team is currently assigned to this project."
        );
    }

    // -----------------------------------------------------
    // 8. SELECTED TEAM MUST BE PROJECT TEAM
    // -----------------------------------------------------

    if (project.TeamId.Value != teamId)
    {
        return (
            false,
            "The selected Team is not assigned to this project."
        );
    }

    // -----------------------------------------------------
    // 9. GET TEAM FROM DATABASE
    // -----------------------------------------------------
    //
    // We do NOT trust a Team ID supplied by the client.
    // The project-Team relationship has already been checked.
    //
    // This requires ITeamRepository in SprintService.
    //

    var team =
        await _teamRepository.GetByIdAsync(teamId);

    if (team == null)
    {
        return (
            false,
            "The Team assigned to this project could not be found."
        );
    }

    // -----------------------------------------------------
    // 10. TEAM MUST BE ACTIVE
    // -----------------------------------------------------

    if (!team.IsActive)
    {
        return (
            false,
            "The Team assigned to this project is no longer active."
        );
    }

    // -----------------------------------------------------
    // 11. CHECK EXISTING SPRINT ASSIGNMENT
    // -----------------------------------------------------

    if (sprint.TeamId.HasValue)
    {
        if (sprint.TeamId.Value == teamId)
        {
            return (
                false,
                "This Sprint is already assigned to this Team."
            );
        }

        return (
            false,
            "This Sprint is already assigned to another Team."
        );
    }

    // -----------------------------------------------------
    // 12. CHECK TEAM MANAGER / LEADER
    // -----------------------------------------------------
    //
    // Current Team entity uses ManagerId as the available
    // team leadership relationship.
    //
    // We do not invent TeamLeaderId because it does not
    // currently exist in your Team model.
    //

    if (!team.ManagerId.HasValue ||
        team.ManagerId.Value == Guid.Empty)
    {
        return (
            false,
            "The Team does not currently have a Team Leader/Manager assigned."
        );
    }

    // -----------------------------------------------------
    // 13. ASSIGN SPRINT
    // -----------------------------------------------------

    sprint.TeamId = teamId;
    sprint.UpdatedAt = DateTime.UtcNow;

    await _sprintRepository.AssignTeamAsync(sprint);

    // -----------------------------------------------------
    // 14. SUCCESS
    // -----------------------------------------------------
    //
    // Notification and activity-log integration should be
    // connected when those application services/repositories
    // are available.
    //

    return (
        true,
        "Sprint assigned to the project Team successfully."
    );
}
// =========================================================
// SPRINT-004
// START SPRINT
// =========================================================

public async Task<(bool Success, string Message)>
    StartSprintAsync(
        Guid managerId,
        Guid sprintId)
{
    // ---------------------------------------------------------
    // 1. VALIDATE MANAGER
    // ---------------------------------------------------------

    if (managerId == Guid.Empty)
    {
        return (
            false,
            "Invalid manager identity."
        );
    }

    // ---------------------------------------------------------
    // 2. GET SPRINT
    // ---------------------------------------------------------

    var sprint =
        await _sprintRepository.GetByIdAsync(
            sprintId);

    if (sprint == null)
    {
        return (
            false,
            "Sprint not found."
        );
    }

    // ---------------------------------------------------------
    // 3. GET PROJECT
    // ---------------------------------------------------------

    var project =
        await _projectRepository.GetByIdAsync(
            sprint.ProjectId);

    if (project == null)
    {
        return (
            false,
            "Project not found."
        );
    }

    // ---------------------------------------------------------
    // 4. MANAGER AUTHORIZATION
    // ---------------------------------------------------------

    if (!project.ManagerId.HasValue ||
        project.ManagerId.Value != managerId)
    {
        return (
            false,
            "You are not authorized to start this Sprint."
        );
    }

    // ---------------------------------------------------------
    // 5. VALIDATE PROJECT STATUS
    // ---------------------------------------------------------

    if (project.Status == null)
    {
        return (
            false,
            "Project status could not be determined."
        );
    }

    if (!project.Status.IsActive ||
        project.Status.IsArchivedStatus ||
        project.Status.IsCancelledStatus ||
        project.Status.IsCompletedStatus)
    {
        return (
            false,
            "The Sprint cannot be started because the project is not in an executable status."
        );
    }

    // ---------------------------------------------------------
    // 6. VALIDATE SPRINT STATUS
    // ---------------------------------------------------------

    // A Sprint must currently be Planned before it can start.

    if (sprint.Status != Domain.Enums.SprintStatus.Planned)
    {
        return (
            false,
            "Only a Planned Sprint can be started."
        );
    }

    // ---------------------------------------------------------
    // 7. VALIDATE SPRINT DATES
    // ---------------------------------------------------------

    if (sprint.StartDate > sprint.EndDate)
    {
        return (
            false,
            "Sprint end date cannot be earlier than the start date."
        );
    }

    // ---------------------------------------------------------
    // 8. VALIDATE REQUIRED INFORMATION
    // ---------------------------------------------------------

    if (string.IsNullOrWhiteSpace(sprint.Name))
    {
        return (
            false,
            "Sprint name is required before the Sprint can start."
        );
    }

    if (sprint.ProjectId == Guid.Empty)
    {
        return (
            false,
            "Sprint project information is invalid."
        );
    }

    if (sprint.CreatedBy == Guid.Empty)
    {
        return (
            false,
            "Sprint creator information is missing."
        );
    }

    // ---------------------------------------------------------
    // 9. TEAM MUST BE ASSIGNED TO SPRINT
    // ---------------------------------------------------------

    if (!sprint.TeamId.HasValue ||
        sprint.TeamId.Value == Guid.Empty)
    {
        return (
            false,
            "A Team must be assigned to the Sprint before it can be started."
        );
    }

    // ---------------------------------------------------------
    // 10. PROJECT MUST HAVE A TEAM
    // ---------------------------------------------------------

    if (!project.TeamId.HasValue ||
        project.TeamId.Value == Guid.Empty)
    {
        return (
            false,
            "The project does not currently have an assigned Team."
        );
    }

    // ---------------------------------------------------------
    // 11. SPRINT TEAM MUST MATCH PROJECT TEAM
    // ---------------------------------------------------------

    if (sprint.TeamId.Value != project.TeamId.Value)
    {
        return (
            false,
            "The Sprint Team is no longer associated with the project."
        );
    }

    // ---------------------------------------------------------
    // 12. GET CURRENT TEAM
    // ---------------------------------------------------------

    var team =
        await _teamRepository.GetByIdAsync(
            project.TeamId.Value);

    if (team == null)
    {
        return (
            false,
            "The assigned Team could not be found."
        );
    }

    // ---------------------------------------------------------
    // 13. TEAM MUST BE ACTIVE
    // ---------------------------------------------------------

    if (!team.IsActive)
    {
        return (
            false,
            "The assigned Team is no longer active."
        );
    }

    // ---------------------------------------------------------
    // 14. VALIDATE TEAM LEADER
    // ---------------------------------------------------------

    if (!team.ManagerId.HasValue ||
        team.ManagerId.Value == Guid.Empty)
    {
        return (
            false,
            "The Team currently has no Team Leader assigned."
        );
    }

    // ---------------------------------------------------------
    // 15. START SPRINT
    // ---------------------------------------------------------

    sprint.Status =
        Domain.Enums.SprintStatus.Active;

    sprint.UpdatedAt =
        DateTime.UtcNow;

    // ---------------------------------------------------------
    // 16. SAVE
    // ---------------------------------------------------------

    await _sprintRepository.UpdateAsync(
        sprint);

    // ---------------------------------------------------------
    // 17. TEAM LEADER
    // ---------------------------------------------------------
    //
    // Current Team entity uses ManagerId as the current
    // Team leadership relationship.
    //
    // The notification module will use:
    //
    // team.ManagerId
    //
    // rather than a hard-coded user.
    //
    // ---------------------------------------------------------

    return (
        true,
        "Sprint started successfully."
    );
}
// =========================================================
// SPRINT-006
// COMPLETE SPRINT
// =========================================================

public async Task<(bool Success, string Message)>
    CompleteSprintAsync(
        Guid managerId,
        Guid sprintId)
{
    // ---------------------------------------------------------
    // 1. VALIDATE MANAGER
    // ---------------------------------------------------------

    if (managerId == Guid.Empty)
    {
        return (
            false,
            "Invalid manager identity."
        );
    }

    // ---------------------------------------------------------
    // 2. VALIDATE SPRINT ID
    // ---------------------------------------------------------

    if (sprintId == Guid.Empty)
    {
        return (
            false,
            "Invalid Sprint."
        );
    }

    // ---------------------------------------------------------
    // 3. GET SPRINT
    // ---------------------------------------------------------

    var sprint =
        await _sprintRepository.GetByIdAsync(
            sprintId);

    if (sprint == null)
    {
        return (
            false,
            "Sprint not found."
        );
    }

    // ---------------------------------------------------------
    // 4. GET PROJECT
    // ---------------------------------------------------------

    var project =
        await _projectRepository.GetByIdAsync(
            sprint.ProjectId);

    if (project == null)
    {
        return (
            false,
            "Project not found."
        );
    }

    // ---------------------------------------------------------
    // 5. MANAGER AUTHORIZATION
    // ---------------------------------------------------------

    if (!project.ManagerId.HasValue ||
        project.ManagerId.Value != managerId)
    {
        return (
            false,
            "You are not authorized to complete this Sprint."
        );
    }

    // ---------------------------------------------------------
    // 6. SPRINT MUST BE ACTIVE
    // ---------------------------------------------------------

    if (sprint.Status != SprintStatus.Active)
    {
        return (
            false,
            "Only an Active Sprint can be completed."
        );
    }

    // ---------------------------------------------------------
    // 7. VALIDATE PROJECT STATUS
    // ---------------------------------------------------------

    if (project.Status == null)
    {
        return (
            false,
            "Project status could not be determined."
        );
    }

    if (!project.Status.IsActive ||
        project.Status.IsArchivedStatus ||
        project.Status.IsCancelledStatus)
    {
        return (
            false,
            "The Sprint cannot be completed because the project is not in a valid execution status."
        );
    }

    // ---------------------------------------------------------
    // 8. VALIDATE SPRINT INFORMATION
    // ---------------------------------------------------------

    if (sprint.ProjectId == Guid.Empty)
    {
        return (
            false,
            "Sprint project information is invalid."
        );
    }

    if (string.IsNullOrWhiteSpace(sprint.Name))
    {
        return (
            false,
            "Sprint name is required."
        );
    }

    if (sprint.StartDate > sprint.EndDate)
    {
        return (
            false,
            "Sprint end date cannot be earlier than the start date."
        );
    }

    // ---------------------------------------------------------
    // 9. TEAM MUST EXIST
    // ---------------------------------------------------------

    if (!sprint.TeamId.HasValue ||
        sprint.TeamId.Value == Guid.Empty)
    {
        return (
            false,
            "The Sprint does not have an assigned Team."
        );
    }

    // ---------------------------------------------------------
    // 10. PROJECT TEAM MUST MATCH SPRINT TEAM
    // ---------------------------------------------------------

    if (!project.TeamId.HasValue ||
        project.TeamId.Value == Guid.Empty)
    {
        return (
            false,
            "The project does not currently have an assigned Team."
        );
    }

    if (sprint.TeamId.Value != project.TeamId.Value)
    {
        return (
            false,
            "The Sprint Team is no longer associated with the project."
        );
    }

    // ---------------------------------------------------------
    // 11. GET CURRENT TEAM
    // ---------------------------------------------------------

    var team =
        await _teamRepository.GetByIdAsync(
            sprint.TeamId.Value);

    if (team == null)
    {
        return (
            false,
            "The Sprint Team could not be found."
        );
    }

    // ---------------------------------------------------------
    // 12. TEAM MUST BE ACTIVE
    // ---------------------------------------------------------

    if (!team.IsActive)
    {
        return (
            false,
            "The Sprint Team is no longer active."
        );
    }

    // ---------------------------------------------------------
    // 13. TEAM LEADER MUST EXIST
    // ---------------------------------------------------------

    if (!team.ManagerId.HasValue ||
        team.ManagerId.Value == Guid.Empty)
    {
        return (
            false,
            "The Sprint Team currently has no Team Leader assigned."
        );
    }

    // ---------------------------------------------------------
    // 14. GET ACTUAL SPRINT TASKS
    // ---------------------------------------------------------

    var tasks =
        await _taskRepository.GetSprintTasksAsync(
            sprint.Id);

    // ---------------------------------------------------------
    // 15. IDENTIFY INCOMPLETE TASKS
    // ---------------------------------------------------------

    var incompleteTasks =
        tasks
            .Where(t =>
                t.Status != ProjectTaskStatus.Completed)
            .ToList();

    // ---------------------------------------------------------
    // 16. CURRENT INCOMPLETE-TASK RULE
    // ---------------------------------------------------------
    //
    // We do NOT automatically reassign tasks.
    //
    // The current system has no configured target Sprint /
    // backlog rule yet.
    //
    // Therefore incomplete tasks remain in their current
    // Sprint and are reported to the Manager.
    //
    // This prevents accidental task reassignment.
    // ---------------------------------------------------------

    // ---------------------------------------------------------
    // 17. COMPLETE SPRINT
    // ---------------------------------------------------------

    sprint.Status =
        SprintStatus.Completed;

    sprint.UpdatedAt =
        DateTime.UtcNow;

    // ---------------------------------------------------------
    // 18. SAVE
    // ---------------------------------------------------------
    //
    // If SaveChangesAsync fails, the status is not successfully
    // persisted and the operation returns an error.
    // ---------------------------------------------------------

    try
    {
        await _sprintRepository.UpdateAsync(
            sprint);
    }
    catch
    {
        return (
            false,
            "The Sprint could not be completed because a database error occurred."
        );
    }

    // ---------------------------------------------------------
    // 19. SUCCESS MESSAGE
    // ---------------------------------------------------------

    if (incompleteTasks.Count > 0)
    {
        return (
            true,
            $"Sprint completed successfully. " +
            $"{incompleteTasks.Count} incomplete task(s) remain in the Sprint backlog and were not reassigned."
        );
    }

    return (
        true,
        "Sprint completed successfully. All Sprint tasks are completed."
    );
}

// =========================================================
// SPRINT-007
// VIEW SPRINT BACKLOG
// =========================================================

public async Task<SprintBacklogDto?> GetSprintBacklogAsync(
    Guid managerId,
    Guid sprintId,
    ProjectTaskStatus? status = null,
    string? priority = null,
    Guid? assignedUserId = null,
    DateTime? deadlineFrom = null,
    DateTime? deadlineTo = null,
    string? search = null,
    bool sortDescending = false)
{
    // ---------------------------------------------------------
    // 1. VALIDATE MANAGER
    // ---------------------------------------------------------

    if (managerId == Guid.Empty)
    {
        return null;
    }

    // ---------------------------------------------------------
    // 2. GET SPRINT
    // ---------------------------------------------------------

    var sprint = await _sprintRepository
        .GetByIdAsync(sprintId);

    if (sprint == null)
    {
        return null;
    }

    // ---------------------------------------------------------
    // 3. GET PROJECT
    // ---------------------------------------------------------

    var project = await _projectRepository
        .GetByIdAsync(sprint.ProjectId);

    if (project == null)
    {
        return null;
    }

    // ---------------------------------------------------------
    // 4. MANAGER AUTHORIZATION
    // ---------------------------------------------------------

    if (!project.ManagerId.HasValue ||
        project.ManagerId.Value != managerId)
    {
        return null;
    }

    // ---------------------------------------------------------
    // 5. GET SPRINT TASKS
    // ---------------------------------------------------------

    var tasks = await _taskRepository
        .GetSprintTasksAsync(sprintId);

    // ---------------------------------------------------------
    // 6. FILTER BY STATUS
    // ---------------------------------------------------------

    if (status.HasValue)
    {
        tasks = tasks
            .Where(t => t.Status == status.Value)
            .ToList();
    }

    // ---------------------------------------------------------
    // 7. FILTER BY PRIORITY
    // ---------------------------------------------------------

    if (!string.IsNullOrWhiteSpace(priority))
    {
        if (Enum.TryParse<TaskPriority>(
            priority.Trim(),
            true,
            out var parsedPriority))
        {
            tasks = tasks
                .Where(t => t.Priority == parsedPriority)
                .ToList();
        }
    }

    // ---------------------------------------------------------
    // 8. FILTER BY ASSIGNED CONTRIBUTOR
    // ---------------------------------------------------------

    if (assignedUserId.HasValue)
    {
        tasks = tasks
            .Where(t =>
                t.AssignedContributorSDId ==
                assignedUserId.Value)
            .ToList();
    }

    // ---------------------------------------------------------
    // 9. FILTER BY DEADLINE FROM
    // ---------------------------------------------------------

    if (deadlineFrom.HasValue)
    {
        tasks = tasks
            .Where(t =>
                t.DueDate.Date >=
                deadlineFrom.Value.Date)
            .ToList();
    }

    // ---------------------------------------------------------
    // 10. FILTER BY DEADLINE TO
    // ---------------------------------------------------------

    if (deadlineTo.HasValue)
    {
        tasks = tasks
            .Where(t =>
                t.DueDate.Date <=
                deadlineTo.Value.Date)
            .ToList();
    }

    // ---------------------------------------------------------
    // 11. SEARCH
    // ---------------------------------------------------------

    if (!string.IsNullOrWhiteSpace(search))
    {
        var searchTerm = search.Trim();

        tasks = tasks
            .Where(t =>
                t.Title.Contains(
                    searchTerm,
                    StringComparison.OrdinalIgnoreCase)
                ||
                (t.Description ?? string.Empty)
                    .Contains(
                        searchTerm,
                        StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    // ---------------------------------------------------------
    // 12. SORT BY DEADLINE
    // ---------------------------------------------------------

    tasks = sortDescending
        ? tasks
            .OrderByDescending(t => t.DueDate)
            .ToList()
        : tasks
            .OrderBy(t => t.DueDate)
            .ToList();

    // ---------------------------------------------------------
    // 13. BUILD BACKLOG
    // ---------------------------------------------------------

    var backlogItems = new List<SprintBacklogTaskDto>();

    foreach (var task in tasks)
    {
        string? contributorName = null;

        if (task.AssignedContributorSDId.HasValue)
        {
            var contributor =
                await _userRepository.GetByIdAsync(
                    task.AssignedContributorSDId.Value);

            if (contributor != null)
            {
                contributorName =
                    contributor.FullName;
            }
        }

        backlogItems.Add(new SprintBacklogTaskDto
        {
            Id = task.Id,

            SprintId = task.SprintId,

            Title = task.Title,

            Description = task.Description,

            AssignedContributorSDId =
                task.AssignedContributorSDId,

            AssignedDeveloperName =
                contributorName,

            Priority = task.Priority,

            Status = task.Status,

            EstimatedHours =
                task.EstimatedHours,

            ActualHours =
                task.ActualHours,

            DueDate =
                task.DueDate,

            CreatedAt =
                task.CreatedAt,

            UpdatedAt =
                task.UpdatedAt
        });
    }

    // ---------------------------------------------------------
    // 14. RETURN BACKLOG
    // ---------------------------------------------------------

    return new SprintBacklogDto
    {
        SprintId = sprint.Id,

        ProjectId = sprint.ProjectId,

        SprintName = sprint.Name,

        Goal = sprint.Goal,

        Status = sprint.Status,

        TeamId = sprint.TeamId,

        TotalTasks = backlogItems.Count,

        Tasks = backlogItems,

        HasTasks = backlogItems.Any(),

        Message = backlogItems.Any()
            ? null
            : "This Sprint currently has no tasks in its backlog."
    };
}




        // =========================================================
        // ENTITY -> DTO
        // =========================================================

        private static SprintDto MapToDto(
            Sprint sprint)
        {
            return new SprintDto
            {
                Id = sprint.Id,

                ProjectId = sprint.ProjectId,

                CreatedBy = sprint.CreatedBy,

                Name = sprint.Name,

                Goal = sprint.Goal,

                StartDate = sprint.StartDate,

                EndDate = sprint.EndDate,

                Status = sprint.Status,

                Priority = sprint.Priority,

                TeamId = sprint.TeamId,

                CreatedAt = sprint.CreatedAt,

                UpdatedAt = sprint.UpdatedAt
            };
        }
    }
}
