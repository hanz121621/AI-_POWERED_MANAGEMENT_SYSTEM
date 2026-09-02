using AI_PMS.Application.DTOs.Tasks;
using  AI_PMS.Application.Interfaces.Repositories.Sprints;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Sprints;
using AI_PMS.Application.Interfaces.Tasks;

using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Tasks
{
    public class TeamLeaderTaskService
        : ITeamLeaderTaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly ISprintRepository _sprintRepository;
        private readonly IUserRepository _userRepository;

        public TeamLeaderTaskService(
            ITaskRepository taskRepository,
            ITeamRepository teamRepository,
            ISprintRepository sprintRepository,
            IUserRepository userRepository)
        {
            _taskRepository = taskRepository;
            _teamRepository = teamRepository;
            _sprintRepository = sprintRepository;
            _userRepository = userRepository;
        }

        // =========================================================
        // TASK-001
        // CREATE TASK
        // TEAM LEADER
        // =========================================================

        public async Task<(bool Success, string Message, TaskDto? Task)>
            CreateTaskAsync(
                Guid teamLeaderId,
                CreateTeamLeaderTaskDto dto)
        {
            // -----------------------------------------------------
            // 1. Validate Team Leader
            // -----------------------------------------------------

            if (teamLeaderId == Guid.Empty)
            {
                return (
                    false,
                    "You are not authorised to create tasks for this project.",
                    null
                );
            }

            var teamLeaderMembership =
                await _teamRepository
                    .GetTeamLeaderMembershipAsync(
                        dto.TeamId,
                        teamLeaderId);

            if (teamLeaderMembership == null)
            {
                return (
                    false,
                    "You are not authorised to create tasks for this project.",
                    null
                );
            }

            // -----------------------------------------------------
            // 2. Validate Team
            // -----------------------------------------------------

            var team =
                await _teamRepository
                    .GetByIdAsync(dto.TeamId);

            if (team == null || !team.IsActive)
            {
                return (
                    false,
                    "Team not found.",
                    null
                );
            }

            // -----------------------------------------------------
            // 3. Validate Sprint
            // -----------------------------------------------------

            var sprint =
                await _sprintRepository
                    .GetByIdAsync(dto.SprintId);

            if (sprint == null || sprint.IsDeleted)
            {
                return (
                    false,
                    "Sprint not found.",
                    null
                );
            }

            // -----------------------------------------------------
            // 4. Sprint must belong to Team
            // -----------------------------------------------------

            if (sprint.TeamId != dto.TeamId)
            {
                return (
                    false,
                    "The selected sprint does not belong to your team.",
                    null
                );
            }

            // -----------------------------------------------------
            // 5. Validate Title
            // -----------------------------------------------------

            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return (
                    false,
                    "Please complete all required fields.",
                    null
                );
            }

            var title = dto.Title.Trim();

            // -----------------------------------------------------
            // 6. Validate Estimated Hours
            // -----------------------------------------------------

            if (dto.EstimatedHours < 0)
            {
                return (
                    false,
                    "Estimated hours cannot be negative.",
                    null
                );
            }

            // -----------------------------------------------------
            // 7. Validate Deadline
            // -----------------------------------------------------

            if (dto.DueDate < sprint.StartDate)
            {
                return (
                    false,
                    "Task deadline cannot be earlier than the sprint start date.",
                    null
                );
            }

            if (dto.DueDate > sprint.EndDate)
            {
                return (
                    false,
                    "Task deadline cannot be later than the sprint end date.",
                    null
                );
            }

            // -----------------------------------------------------
            // 8. Validate Assigned Member
            // -----------------------------------------------------

            var assignedUser =
                await _userRepository
                    .GetByIdAsync(
                        dto.AssignedContributorSDId);

            if (assignedUser == null)
            {
                return (
                    false,
                    "Team member not found.",
                    null
                );
            }

            if (!assignedUser.IsActive)
            {
                return (
                    false,
                    "The selected team member is inactive.",
                    null
                );
            }

            if (assignedUser.Role != Role.Contributor)
            {
                return (
                    false,
                    "The selected user must be a contributor.",
                    null
                );
            }

            // -----------------------------------------------------
            // 9. Verify Assigned Member Belongs To Team
            // -----------------------------------------------------

            var teamMember =
                await _teamRepository
                    .GetTeamMemberAsync(
                        dto.TeamId,
                        dto.AssignedContributorSDId);

            if (teamMember == null ||
                !teamMember.IsActive)
            {
                return (
                    false,
                    "This team member is not assigned to your team.",
                    null
                );
            }

            // -----------------------------------------------------
            // 10. Validate Parent Task
            // -----------------------------------------------------

            if (dto.ParentTaskId.HasValue)
            {
                var parentTask =
                    await _taskRepository
                        .GetByIdAsync(
                            dto.ParentTaskId.Value);

                if (parentTask == null ||
                    parentTask.IsDeleted)
                {
                    return (
                        false,
                        "Parent task not found.",
                        null
                    );
                }

                if (parentTask.SprintId != dto.SprintId)
                {
                    return (
                        false,
                        "The parent task does not belong to the selected sprint.",
                        null
                    );
                }
            }

            // -----------------------------------------------------
            // 11. Duplicate Task Check
            // -----------------------------------------------------

            var existingTask =
                await _taskRepository
                    .GetByTitleAsync(
                        dto.SprintId,
                        title);

            if (existingTask != null &&
                !existingTask.IsDeleted)
            {
                return (
                    false,
                    "A task with this title already exists in this sprint.",
                    null
                );
            }

            // -----------------------------------------------------
            // 12. Create Task
            // -----------------------------------------------------

            var task = new TaskItem
            {
                Id = Guid.NewGuid(),

                SprintId = dto.SprintId,

                CreatedBy = teamLeaderId,

                Title = title,

                Description =
                    dto.Description?.Trim() ?? string.Empty,

                AssignedContributorSDId =
                    dto.AssignedContributorSDId,

                Priority = dto.Priority,

                Status = ProjectTaskStatus.Todo,

                EstimatedHours =
                    dto.EstimatedHours,

                ActualHours = 0,

                DueDate = dto.DueDate,

                CreatedAt = DateTime.UtcNow,

                IsDeleted = false
            };

            await _taskRepository.AddAsync(task);

            // -----------------------------------------------------
            // 13. Return
            // -----------------------------------------------------

            return (
                true,
                "Task created successfully.",
                MapToDto(task)
            );
        }
          // =========================================================
// TASK-003
// DELETE TASK
// TEAM LEADER
// =========================================================

// =========================================================
// TASK-004
// ASSIGN TASK TO CONTRIBUTOR
// TEAM LEADER
// =========================================================

    public async Task<(bool Success, string Message, TaskDto? Task)>
    AssignTaskAsync(
        Guid teamLeaderId,
        Guid taskId,
        Guid contributorId)
{
    // ---------------------------------------------------------
    // 1. Validate Team Leader ID
    // ---------------------------------------------------------

    if (teamLeaderId == Guid.Empty)
    {
        return (
            false,
            "You are not authorised to assign this task.",
            null
        );
    }

    // ---------------------------------------------------------
    // 2. Validate Contributor ID
    // ---------------------------------------------------------

    if (contributorId == Guid.Empty)
    {
        return (
            false,
            "Team member not found.",
            null
        );
    }

    // ---------------------------------------------------------
    // 3. Find Task
    // ---------------------------------------------------------

    var task =
        await _taskRepository
            .GetByIdAsync(taskId);

    if (task == null ||
        task.IsDeleted)
    {
        return (
            false,
            "Task not found.",
            null
        );
    }

    // ---------------------------------------------------------
    // 4. Find Sprint
    // ---------------------------------------------------------

    var sprint =
        await _sprintRepository
            .GetByIdAsync(task.SprintId);

    if (sprint == null ||
        sprint.IsDeleted)
    {
        return (
            false,
            "Task not found.",
            null
        );
    }

    // ---------------------------------------------------------
    // 5. Verify Task Belongs To A Team
    // ---------------------------------------------------------

    if (!sprint.TeamId.HasValue)
    {
        return (
            false,
            "You are not authorised to assign this task.",
            null
        );
    }

    var teamId =
        sprint.TeamId.Value;

    // ---------------------------------------------------------
    // 6. Verify Team Leader Membership
    // ---------------------------------------------------------

    var membership =
        await _teamRepository
            .GetTeamLeaderMembershipAsync(
                teamId,
                teamLeaderId);

    if (membership == null)
    {
        return (
            false,
            "You are not authorised to assign this task.",
            null
        );
    }

    // ---------------------------------------------------------
    // 7. Find Contributor
    // ---------------------------------------------------------

    var contributor =
        await _userRepository
            .GetByIdAsync(contributorId);

    if (contributor == null)
    {
        return (
            false,
            "Team member not found.",
            null
        );
    }

    // ---------------------------------------------------------
    // 8. Contributor Must Be Active
    // ---------------------------------------------------------

    if (!contributor.IsActive)
    {
        return (
            false,
            "The selected team member is inactive.",
            null
        );
    }

    // ---------------------------------------------------------
    // 9. Contributor Must Have Contributor Role
    // ---------------------------------------------------------

    if (contributor.Role != Role.Contributor)
    {
        return (
            false,
            "The selected user must be a contributor.",
            null
        );
    }

    // ---------------------------------------------------------
    // 10. Verify Contributor Belongs To Team
    // ---------------------------------------------------------

    var teamMember =
        await _teamRepository
            .GetTeamMemberAsync(
                teamId,
                contributorId);

    if (teamMember == null ||
        !teamMember.IsActive)
    {
        return (
            false,
            "Contributor is not assigned to your team.",
            null
        );
    }

    // ---------------------------------------------------------
    // 11. Check Existing Assignment
    // ---------------------------------------------------------

    if (task.AssignedContributorSDId ==
        contributorId)
    {
        return (
            false,
            "This task is already assigned to this contributor.",
            MapToDto(task)
        );
    }

    // ---------------------------------------------------------
    // 12. Assign Contributor
    // ---------------------------------------------------------

    task.AssignedContributorSDId =
        contributorId;

    // ---------------------------------------------------------
    // 13. Update Timestamp
    // ---------------------------------------------------------

    task.UpdatedAt =
        DateTime.UtcNow;

    // ---------------------------------------------------------
    // 14. Save
    // ---------------------------------------------------------

    await _taskRepository
        .UpdateAsync(task);

    // ---------------------------------------------------------
    // 15. Return Updated Task
    // ---------------------------------------------------------

    return (
        true,
        "Task assigned successfully.",
        MapToDto(task)
    );
}
                    // =========================================================
// TASK-005
// SET TASK PRIORITY
// TEAM LEADER
// =========================================================

    public async Task<(bool Success, string Message, TaskDto? Task)>
    SetTaskPriorityAsync(
        Guid teamLeaderId,
        Guid taskId,
        SetTaskPriorityDto dto)
{
    // -----------------------------------------------------
    // 1. Validate Team Leader ID
    // -----------------------------------------------------

    if (teamLeaderId == Guid.Empty)
    {
        return (
            false,
            "You are not authorised to change this task priority.",
            null
        );
    }

    // -----------------------------------------------------
    // 2. Validate DTO
    // -----------------------------------------------------

    if (dto == null)
    {
        return (
            false,
            "Invalid priority value.",
            null
        );
    }

    // -----------------------------------------------------
    // 3. Validate Priority
    // -----------------------------------------------------

    if (!Enum.IsDefined(typeof(TaskPriority), dto.Priority))
    {
        return (
            false,
            "Invalid priority value.",
            null
        );
    }

    // -----------------------------------------------------
    // 4. Get Task
    // -----------------------------------------------------

    var task =
        await _taskRepository
            .GetByIdAsync(taskId);

    if (task == null ||
        task.IsDeleted)
    {
        return (
            false,
            "Task not found.",
            null
        );
    }

    // -----------------------------------------------------
    // 5. Get Sprint
    // -----------------------------------------------------

    var sprint =
        await _sprintRepository
            .GetByIdAsync(task.SprintId);

    if (sprint == null ||
        sprint.IsDeleted)
    {
        return (
            false,
            "Task not found.",
            null
        );
    }

    // -----------------------------------------------------
    // 6. Task must belong to a team
    // -----------------------------------------------------

    if (!sprint.TeamId.HasValue)
    {
        return (
            false,
            "You are not authorised to change this task priority.",
            null
        );
    }

    var teamId =
        sprint.TeamId.Value;

    // -----------------------------------------------------
    // 7. Verify Team Leader Membership
    // -----------------------------------------------------

    var membership =
        await _teamRepository
            .GetTeamLeaderMembershipAsync(
                teamId,
                teamLeaderId);

    if (membership == null)
    {
        return (
            false,
            "You are not authorised to change this task priority.",
            null
        );
    }

    // -----------------------------------------------------
    // 8. Check if priority is already the same
    // -----------------------------------------------------

    if (task.Priority == dto.Priority)
    {
        return (
            false,
            "The task already has this priority.",
            MapToDto(task)
        );
    }

    // -----------------------------------------------------
    // 9. Update Priority
    // -----------------------------------------------------

    task.Priority =
        dto.Priority;

    // -----------------------------------------------------
    // 10. Update Timestamp
    // -----------------------------------------------------

    task.UpdatedAt =
        DateTime.UtcNow;

    // -----------------------------------------------------
    // 11. Save
    // -----------------------------------------------------

    await _taskRepository
        .UpdateAsync(task);

    // -----------------------------------------------------
    // 12. Return
    // -----------------------------------------------------

    return (
        true,
        "Task priority updated successfully.",
        MapToDto(task)
    );
}

      // =========================================================
// TASK-006
// SET TASK DEADLINE
// TEAM LEADER
// =========================================================

    public async Task<(bool Success, string Message, TaskDto? Task)>
    SetTaskDeadlineAsync(
        Guid teamLeaderId,
        Guid taskId,
        SetTaskDeadlineDto dto)
{
    // -----------------------------------------------------
    // 1. Validate Team Leader
    // -----------------------------------------------------

    if (teamLeaderId == Guid.Empty)
    {
        return (
            false,
            "You are not authorised to update this task deadline.",
            null
        );
    }

    // -----------------------------------------------------
    // 2. Validate DTO
    // -----------------------------------------------------

    if (dto == null)
    {
        return (
            false,
            "Invalid deadline date.",
            null
        );
    }

    // -----------------------------------------------------
    // 3. Get Task
    // -----------------------------------------------------

    var task =
        await _taskRepository
            .GetByIdAsync(taskId);

    if (task == null ||
        task.IsDeleted)
    {
        return (
            false,
            "Task not found.",
            null
        );
    }

    // -----------------------------------------------------
    // 4. Get Sprint
    // -----------------------------------------------------

    var sprint =
        await _sprintRepository
            .GetByIdAsync(task.SprintId);

    if (sprint == null ||
        sprint.IsDeleted)
    {
        return (
            false,
            "Task not found.",
            null
        );
    }

    // -----------------------------------------------------
    // 5. Task must belong to a team
    // -----------------------------------------------------

    if (!sprint.TeamId.HasValue)
    {
        return (
            false,
            "You are not authorised to update this task deadline.",
            null
        );
    }

    var teamId =
        sprint.TeamId.Value;

    // -----------------------------------------------------
    // 6. Verify Team Leader Membership
    // -----------------------------------------------------

    var membership =
        await _teamRepository
            .GetTeamLeaderMembershipAsync(
                teamId,
                teamLeaderId);

    if (membership == null)
    {
        return (
            false,
            "You are not authorised to update this task deadline.",
            null
        );
    }

    // -----------------------------------------------------
    // 7. Deadline cannot be before task creation
    // -----------------------------------------------------

    if (dto.DueDate < task.CreatedAt)
    {
        return (
            false,
            "Invalid deadline date.",
            null
        );
    }

    // -----------------------------------------------------
    // 8. Deadline must be inside sprint
    // -----------------------------------------------------

    if (dto.DueDate < sprint.StartDate ||
        dto.DueDate > sprint.EndDate)
    {
        return (
            false,
            "Task deadline conflicts with sprint schedule.",
            null
        );
    }

    // -----------------------------------------------------
    // 9. Check if deadline is unchanged
    // -----------------------------------------------------

    if (task.DueDate == dto.DueDate)
    {
        return (
            false,
            "The task already has this deadline.",
            MapToDto(task)
        );
    }

    // -----------------------------------------------------
    // 10. Update Deadline
    // -----------------------------------------------------

    task.DueDate =
        dto.DueDate;

    // -----------------------------------------------------
    // 11. Update Timestamp
    // -----------------------------------------------------

    task.UpdatedAt =
        DateTime.UtcNow;

    // -----------------------------------------------------
    // 12. Save
    // -----------------------------------------------------

    await _taskRepository
        .UpdateAsync(task);

    // -----------------------------------------------------
    // 13. Return
    // -----------------------------------------------------

    return (
        true,
        "Task deadline updated successfully.",
        MapToDto(task)
    );
}

// =========================================================
// TASK-007
// VIEW TASKS
// TEAM LEADER
// =========================================================

public async Task<(bool Success, string Message, List<TaskDto> Tasks)>
    GetTeamLeaderTasksAsync(
        Guid teamLeaderId,
        Guid sprintId)
{
    // ---------------------------------------------------------
    // 1. Validate Team Leader ID
    // ---------------------------------------------------------

    if (teamLeaderId == Guid.Empty)
    {
        return (
            false,
            "Access denied.",
            new List<TaskDto>()
        );
    }

    // ---------------------------------------------------------
    // 2. Validate Sprint ID
    // ---------------------------------------------------------

    if (sprintId == Guid.Empty)
    {
        return (
            false,
            "Access denied.",
            new List<TaskDto>()
        );
    }

    // ---------------------------------------------------------
    // 3. Get Sprint
    // ---------------------------------------------------------

    var sprint =
        await _sprintRepository
            .GetByIdAsync(sprintId);

    if (sprint == null ||
        sprint.IsDeleted)
    {
        return (
            false,
            "No tasks found.",
            new List<TaskDto>()
        );
    }

    // ---------------------------------------------------------
    // 4. Sprint must belong to a team
    // ---------------------------------------------------------

    if (!sprint.TeamId.HasValue)
    {
        return (
            false,
            "Access denied.",
            new List<TaskDto>()
        );
    }

    var teamId =
        sprint.TeamId.Value;

    // ---------------------------------------------------------
    // 5. Verify Team Leader membership
    // ---------------------------------------------------------

    var membership =
        await _teamRepository
            .GetTeamLeaderMembershipAsync(
                teamId,
                teamLeaderId);

    if (membership == null)
    {
        return (
            false,
            "Access denied.",
            new List<TaskDto>()
        );
    }

    // ---------------------------------------------------------
    // 6. Get Sprint Tasks
    // ---------------------------------------------------------

    var tasks =
        await _taskRepository
            .GetSprintTasksAsync(sprintId);

    // ---------------------------------------------------------
    // 7. Remove deleted tasks
    // ---------------------------------------------------------

    tasks = tasks
        .Where(t => !t.IsDeleted)
        .ToList();

    // ---------------------------------------------------------
    // 8. No tasks
    // ---------------------------------------------------------

    if (tasks.Count == 0)
    {
        return (
            true,
            "No tasks found.",
            new List<TaskDto>()
        );
    }

    // ---------------------------------------------------------
    // 9. Map tasks to DTOs
    // ---------------------------------------------------------

    var taskDtos =
        tasks
            .Select(MapToDto)
            .ToList();

    // ---------------------------------------------------------
    // 10. Return
    // ---------------------------------------------------------

    return (
        true,
        "Tasks retrieved successfully.",
        taskDtos
    );
}
// =========================================================
// TASK-008
// UPDATE TASK STATUS
// TEAM LEADER
// =========================================================

    public async Task<(bool Success, string Message, TaskDto? Task)>
    UpdateTaskStatusAsync(
        Guid teamLeaderId,
        Guid taskId,
        UpdateTaskStatusDto dto)
{
    // ---------------------------------------------------------
    // 1. Validate Team Leader ID
    // ---------------------------------------------------------

    if (teamLeaderId == Guid.Empty)
    {
        return (
            false,
            "You are not authorised to update this task status.",
            null
        );
    }

    // ---------------------------------------------------------
    // 2. Validate DTO
    // ---------------------------------------------------------

    if (dto == null)
    {
        return (
            false,
            "This status change is not allowed.",
            null
        );
    }

    // ---------------------------------------------------------
    // 3. Validate Status
    // ---------------------------------------------------------

    if (!Enum.IsDefined(
            typeof(ProjectTaskStatus),
            dto.Status))
    {
        return (
            false,
            "This status change is not allowed.",
            null
        );
    }

    // ---------------------------------------------------------
    // 4. Get Task
    // ---------------------------------------------------------

    var task =
        await _taskRepository
            .GetByIdAsync(taskId);

    if (task == null ||
        task.IsDeleted)
    {
        return (
            false,
            "Task not found.",
            null
        );
    }

    // ---------------------------------------------------------
    // 5. Get Sprint
    // ---------------------------------------------------------

    var sprint =
        await _sprintRepository
            .GetByIdAsync(task.SprintId);

    if (sprint == null ||
        sprint.IsDeleted)
    {
        return (
            false,
            "Task not found.",
            null
        );
    }

    // ---------------------------------------------------------
    // 6. Task must belong to a team
    // ---------------------------------------------------------

    if (!sprint.TeamId.HasValue)
    {
        return (
            false,
            "You are not authorised to update this task status.",
            null
        );
    }

    var teamId =
        sprint.TeamId.Value;

    // ---------------------------------------------------------
    // 7. Verify Team Leader membership
    // ---------------------------------------------------------

    var membership =
        await _teamRepository
            .GetTeamLeaderMembershipAsync(
                teamId,
                teamLeaderId);

    if (membership == null)
    {
        return (
            false,
            "You are not authorised to update this task status.",
            null
        );
    }

    // ---------------------------------------------------------
    // 8. Validate status transition
    // ---------------------------------------------------------

    if (!IsValidTaskStatusTransition(
            task.Status,
            dto.Status))
    {
        return (
            false,
            "This status change is not allowed.",
            null
        );
    }

    // ---------------------------------------------------------
    // 9. Check if status is already the same
    // ---------------------------------------------------------

    if (task.Status == dto.Status)
    {
        return (
            false,
            "The task already has this status.",
            MapToDto(task)
        );
    }

    // ---------------------------------------------------------
    // 10. Update status
    // ---------------------------------------------------------

    task.Status =
        dto.Status;

    // ---------------------------------------------------------
    // 11. Update timestamp
    // ---------------------------------------------------------

    task.UpdatedAt =
        DateTime.UtcNow;

    // ---------------------------------------------------------
    // 12. Save
    // ---------------------------------------------------------

    await _taskRepository
        .UpdateAsync(task);

    // ---------------------------------------------------------
    // 13. Return updated task
    // ---------------------------------------------------------

    return (
        true,
        "Task status updated successfully.",
        MapToDto(task)
    );
}
// =========================================================
// TASK-008
// UPDATE TASK STATUS
// TEAM LEADER
// =========================================================

private bool IsValidTaskStatusTransition(
    ProjectTaskStatus currentStatus,
    ProjectTaskStatus newStatus)
{
    // Same status is handled separately
    if (currentStatus == newStatus)
    {
        return true;
    }

    return currentStatus switch
    {
        ProjectTaskStatus.Todo =>
            newStatus == ProjectTaskStatus.InProgress ||
            newStatus == ProjectTaskStatus.Blocked,

        ProjectTaskStatus.InProgress =>
            newStatus == ProjectTaskStatus.InReview ||
            newStatus == ProjectTaskStatus.Blocked ||
            newStatus == ProjectTaskStatus.Todo,

        ProjectTaskStatus.InReview =>
            newStatus == ProjectTaskStatus.Completed ||
            newStatus == ProjectTaskStatus.InProgress,

        ProjectTaskStatus.Blocked =>
            newStatus == ProjectTaskStatus.InProgress ||
            newStatus == ProjectTaskStatus.Todo,

        ProjectTaskStatus.Completed =>
            false,

        _ => false
    };
}

public async Task<(bool Success, string Message)>
    DeleteTaskAsync(
        Guid teamLeaderId,
        Guid taskId)
{
    // ---------------------------------------------------------
    // 1. Validate Team Leader ID
    // ---------------------------------------------------------

    if (teamLeaderId == Guid.Empty)
    {
        return (
            false,
            "You are not authorised to delete this task."
        );
    }

    // ---------------------------------------------------------
    // 2. Get Task
    // ---------------------------------------------------------

    var task =
        await _taskRepository
            .GetByIdAsync(taskId);

    if (task == null ||
        task.IsDeleted)
    {
        return (
            false,
            "Task not found."
        );
    }

    // ---------------------------------------------------------
    // 3. Get Sprint
    // ---------------------------------------------------------

    var sprint =
        await _sprintRepository
            .GetByIdAsync(task.SprintId);

    if (sprint == null ||
        sprint.IsDeleted)
    {
        return (
            false,
            "Task not found."
        );
    }

    // ---------------------------------------------------------
    // 4. Verify Task Belongs To A Team
    // ---------------------------------------------------------

    if (!sprint.TeamId.HasValue)
    {
        return (
            false,
            "You are not authorised to delete this task."
        );
    }

    var teamId =
        sprint.TeamId.Value;

    // ---------------------------------------------------------
    // 5. Verify Team Leader Membership
    // ---------------------------------------------------------

    var membership =
        await _teamRepository
            .GetTeamLeaderMembershipAsync(
                teamId,
                teamLeaderId);

    if (membership == null)
    {
        return (
            false,
            "You are not authorised to delete this task."
        );
    }

    // ---------------------------------------------------------
    // 6. Completed Tasks Cannot Be Deleted
    // ---------------------------------------------------------

    if (task.Status ==
        ProjectTaskStatus.Completed)
    {
        return (
            false,
            "Completed tasks cannot be deleted. Archive the task instead."
        );
    }

    // ---------------------------------------------------------
    // 7. Check Dependent Tasks
    // ---------------------------------------------------------
    //
    // At the moment ITaskRepository does not expose a method
    // for retrieving dependent tasks.
    //
    // Therefore we do NOT invent dependency logic here.
    // We will add it properly when the dependency repository/
    // entity is confirmed.
    //
    // ---------------------------------------------------------

    // ---------------------------------------------------------
    // 8. Soft Delete Task
    // ---------------------------------------------------------

    task.IsDeleted = true;

    // ---------------------------------------------------------
    // 9. Update Timestamp
    // ---------------------------------------------------------

    task.UpdatedAt =
        DateTime.UtcNow;

    // ---------------------------------------------------------
    // 10. Save
    // ---------------------------------------------------------

    await _taskRepository
        .UpdateAsync(task);

    // ---------------------------------------------------------
    // 11. Return
    // ---------------------------------------------------------

    return (
        true,
        "Task deleted successfully."
    );
}
                     

        // =========================================================
        // TASK-002
        // UPDATE TASK
        // TEAM LEADER
        // =========================================================

        public async Task<(bool Success, string Message, TaskDto? Task)>
            UpdateTaskAsync(
                Guid teamLeaderId,
                Guid taskId,
                UpdateTeamLeaderTaskDto dto)
        {
            // -----------------------------------------------------
            // 1. Get Task
            // -----------------------------------------------------

            var task =
                await _taskRepository
                    .GetByIdAsync(taskId);

            if (task == null ||
                task.IsDeleted)
            {
                return (
                    false,
                    "Task not found.",
                    null
                );
            }

            // -----------------------------------------------------
            // 2. Get Sprint
            // -----------------------------------------------------

            var sprint =
                await _sprintRepository
                    .GetByIdAsync(
                        task.SprintId);

            if (sprint == null ||
                sprint.IsDeleted)
            {
                return (
                    false,
                    "Sprint not found.",
                    null
                );
            }

            // -----------------------------------------------------
            // 3. Get Team
            // -----------------------------------------------------

            if (!sprint.TeamId.HasValue)
            {
                return (
                    false,
                    "This task is not assigned to a team.",
                    null
                );
            }

            var teamId = sprint.TeamId.Value;

            // -----------------------------------------------------
            // 4. Verify Team Leader
            // -----------------------------------------------------

            var membership =
                await _teamRepository
                    .GetTeamLeaderMembershipAsync(
                        teamId,
                        teamLeaderId);

            if (membership == null)
            {
                return (
                    false,
                    "You are not authorised to update this task.",
                    null
                );
            }

            // -----------------------------------------------------
            // 5. Verify Task Belongs To Team
            // -----------------------------------------------------

            if (sprint.TeamId != teamId)
            {
                return (
                    false,
                    "You are not authorised to update this task.",
                    null
                );
            }

            // -----------------------------------------------------
            // 6. Validate Title
            // -----------------------------------------------------

            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return (
                    false,
                    "Please complete all required fields.",
                    null
                );
            }

            var newTitle =
                dto.Title.Trim();

            var newDescription =
                dto.Description?.Trim() ?? string.Empty;

            // -----------------------------------------------------
            // 7. Validate Hours
            // -----------------------------------------------------

            if (dto.EstimatedHours < 0)
            {
                return (
                    false,
                    "Estimated hours cannot be negative.",
                    null
                );
            }

            // -----------------------------------------------------
            // 8. Validate Due Date
            // -----------------------------------------------------

            if (dto.DueDate < sprint.StartDate)
            {
                return (
                    false,
                    "Task deadline cannot be earlier than the sprint start date.",
                    null
                );
            }

            if (dto.DueDate > sprint.EndDate)
            {
                return (
                    false,
                    "Task deadline cannot be later than the sprint end date.",
                    null
                );
            }

            // -----------------------------------------------------
            // 9. Validate Assigned Member
            // -----------------------------------------------------

            var assignedUser =
                await _userRepository
                    .GetByIdAsync(
                        dto.AssignedContributorSDId);

            if (assignedUser == null)
            {
                return (
                    false,
                    "Team member not found.",
                    null
                );
            }

            if (!assignedUser.IsActive)
            {
                return (
                    false,
                    "The selected team member is inactive.",
                    null
                );
            }

            if (assignedUser.Role != Role.Contributor)
            {
                return (
                    false,
                    "The selected user must be a contributor.",
                    null
                );
            }

            // -----------------------------------------------------
            // 10. Verify Member Belongs To Team
            // -----------------------------------------------------

            var teamMember =
                await _teamRepository
                    .GetTeamMemberAsync(
                        teamId,
                        dto.AssignedContributorSDId);

            if (teamMember == null ||
                !teamMember.IsActive)
            {
                return (
                    false,
                    "This team member is not assigned to your team.",
                    null
                );
            }

            // -----------------------------------------------------
            // 11. Duplicate Title Check
            // -----------------------------------------------------

            var existingTask =
                await _taskRepository
                    .GetByTitleAsync(
                        task.SprintId,
                        newTitle);

            if (existingTask != null &&
                existingTask.Id != taskId &&
                !existingTask.IsDeleted)
            {
                return (
                    false,
                    "A task with this title already exists in this sprint.",
                    null
                );
            }

            // -----------------------------------------------------
            // 12. Check Changes
            // -----------------------------------------------------

            bool titleChanged =
                !string.Equals(
                    task.Title?.Trim(),
                    newTitle,
                    StringComparison.OrdinalIgnoreCase);

            bool descriptionChanged =
                !string.Equals(
                    task.Description?.Trim() ?? string.Empty,
                    newDescription,
                    StringComparison.Ordinal);

            bool priorityChanged =
                task.Priority != dto.Priority;

            bool assigneeChanged =
                task.AssignedContributorSDId !=
                dto.AssignedContributorSDId;

            bool estimatedHoursChanged =
                task.EstimatedHours !=
                dto.EstimatedHours;

            bool dueDateChanged =
                task.DueDate !=
                dto.DueDate;

            bool anythingChanged =
                titleChanged ||
                descriptionChanged ||
                priorityChanged ||
                assigneeChanged ||
                estimatedHoursChanged ||
                dueDateChanged;

            // -----------------------------------------------------
            // 13. Nothing Changed
            // -----------------------------------------------------

            if (!anythingChanged)
            {
                return (
                    false,
                    "No changes were made. The task already contains these values.",
                    MapToDto(task)
                );
            }

            // -----------------------------------------------------
            // 14. Apply Changes
            // -----------------------------------------------------

            task.Title =
                newTitle;

            task.Description =
                newDescription;

            task.Priority =
                dto.Priority;

            task.AssignedContributorSDId =
                dto.AssignedContributorSDId;

            task.EstimatedHours =
                dto.EstimatedHours;

            task.DueDate =
                dto.DueDate;

            task.UpdatedAt =
                DateTime.UtcNow;

            await _taskRepository
                .UpdateAsync(task);

            // -----------------------------------------------------
            // 15. Return
            // -----------------------------------------------------

            return (
                true,
                "Task updated successfully.",
                MapToDto(task)
            );
        }

        // =========================================================
        // ENTITY -> DTO
        // =========================================================

        private static TaskDto MapToDto(
            TaskItem task)
        {
            return new TaskDto
            {
                Id = task.Id,

                SprintId =
                    task.SprintId,

                Title =
                    task.Title,

                Description =
                    task.Description,

                CreatedBy =
                    task.CreatedBy,

                AssignedContributorSDId =
                    task.AssignedContributorSDId,

                Priority =
                    task.Priority,

                Status =
                    task.Status,

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
            };
        }
    }
}





