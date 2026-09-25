using AI_PMS.Application.DTOs.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Projects; // 🌟 ADDED
using AI_PMS.Application.Interfaces.Repositories.Sprints;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Sprints;
using AI_PMS.Application.Interfaces.Tasks;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Tasks
{
    public class TeamLeaderTaskService : ITeamLeaderTaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly ISprintRepository _sprintRepository;
        private readonly IUserRepository _userRepository;
        private readonly IProjectRepository _projectRepository; // 🌟 ADDED

        public TeamLeaderTaskService(
            ITaskRepository taskRepository,
            ITeamRepository teamRepository,
            ISprintRepository sprintRepository,
            IUserRepository userRepository,
            IProjectRepository projectRepository) // 🌟 ADDED
        {
            _taskRepository = taskRepository;
            _teamRepository = teamRepository;
            _sprintRepository = sprintRepository;
            _userRepository = userRepository;
            _projectRepository = projectRepository; // 🌟 ADDED
        }

        // =========================================================
        // TASK-001: CREATE TASK (TEAM LEADER)
        // =========================================================
        public async Task<(bool Success, string Message, TaskDto? Task)> CreateTaskAsync(Guid teamLeaderId, CreateTeamLeaderTaskDto dto)
        {
            if (teamLeaderId == Guid.Empty) return (false, "You are not authorised to create tasks for this project.", null);

            var sprint = await _sprintRepository.GetByIdAsync(dto.SprintId);
            if (sprint == null || sprint.IsDeleted) return (false, "Sprint not found.", null);

            // 🌟 FIX: Verify the user is the Team Leader of the PROJECT
            var project = await _projectRepository.GetByIdAsync(sprint.ProjectId);
            if (project == null || project.IsDeleted || project.TeamLeaderId != teamLeaderId)
            {
                return (false, "Access denied. You are not the Team Leader of this project.", null);
            }

            if (sprint.TeamId != dto.TeamId) return (false, "The selected sprint does not belong to your team.", null);
            if (string.IsNullOrWhiteSpace(dto.Title)) return (false, "Please complete all required fields.", null);
            if (dto.EstimatedHours < 0) return (false, "Estimated hours cannot be negative.", null);
            if (dto.DueDate < sprint.StartDate || dto.DueDate > sprint.EndDate) return (false, "Task deadline conflicts with sprint schedule.", null);

            var assignedUser = await _userRepository.GetByIdAsync(dto.AssignedContributorSDId);
            if (assignedUser == null || !assignedUser.IsActive || assignedUser.Role != Role.Contributor)
                return (false, "The selected team member is invalid or inactive.", null);

            var teamMember = await _teamRepository.GetTeamMemberAsync(dto.TeamId, dto.AssignedContributorSDId);
            if (teamMember == null || !teamMember.IsActive) return (false, "This team member is not assigned to your team.", null);

            var existingTask = await _taskRepository.GetByTitleAsync(dto.SprintId, dto.Title.Trim());
            if (existingTask != null && !existingTask.IsDeleted) return (false, "A task with this title already exists in this sprint.", null);

            var task = new TaskItem
            {
                Id = Guid.NewGuid(),
                SprintId = dto.SprintId,
                CreatedBy = teamLeaderId,
                Title = dto.Title.Trim(),
                Description = dto.Description?.Trim() ?? string.Empty,
                AssignedContributorSDId = dto.AssignedContributorSDId,
                Priority = dto.Priority,
                Status = ProjectTaskStatus.Todo,
                EstimatedHours = dto.EstimatedHours,
                ActualHours = 0,
                DueDate = dto.DueDate,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            await _taskRepository.AddAsync(task);
            return (true, "Task created successfully.", MapToDto(task));
        }

        // =========================================================
        // TASK-004: ASSIGN TASK TO CONTRIBUTOR
        // =========================================================
        public async Task<(bool Success, string Message, TaskDto? Task)> AssignTaskAsync(Guid teamLeaderId, Guid taskId, Guid contributorId)
        {
            if (teamLeaderId == Guid.Empty || contributorId == Guid.Empty) return (false, "Invalid parameters.", null);

            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null || task.IsDeleted) return (false, "Task not found.", null);

            var sprint = await _sprintRepository.GetByIdAsync(task.SprintId);
            if (sprint == null || sprint.IsDeleted || !sprint.TeamId.HasValue) return (false, "Sprint not found.", null);

            // 🌟 FIX: Verify Project Team Leader
            var project = await _projectRepository.GetByIdAsync(sprint.ProjectId);
            if (project == null || project.IsDeleted || project.TeamLeaderId != teamLeaderId)
            {
                return (false, "Access denied.", null);
            }

            var contributor = await _userRepository.GetByIdAsync(contributorId);
            if (contributor == null || !contributor.IsActive || contributor.Role != Role.Contributor)
                return (false, "The selected team member is invalid or inactive.", null);

            var teamMember = await _teamRepository.GetTeamMemberAsync(sprint.TeamId.Value, contributorId);
            if (teamMember == null || !teamMember.IsActive) return (false, "Contributor is not assigned to your team.", null);

            if (task.AssignedContributorSDId == contributorId) return (false, "This task is already assigned to this contributor.", MapToDto(task));

            task.AssignedContributorSDId = contributorId;
            task.UpdatedAt = DateTime.UtcNow;
            await _taskRepository.UpdateAsync(task);

            return (true, "Task assigned successfully.", MapToDto(task));
        }

        // =========================================================
        // TASK-005: SET TASK PRIORITY
        // =========================================================
        public async Task<(bool Success, string Message, TaskDto? Task)> SetTaskPriorityAsync(Guid teamLeaderId, Guid taskId, SetTaskPriorityDto dto)
        {
            if (teamLeaderId == Guid.Empty || dto == null || !Enum.IsDefined(typeof(TaskPriority), dto.Priority))
                return (false, "Invalid priority value.", null);

            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null || task.IsDeleted) return (false, "Task not found.", null);

            var sprint = await _sprintRepository.GetByIdAsync(task.SprintId);
            if (sprint == null || sprint.IsDeleted || !sprint.TeamId.HasValue) return (false, "Sprint not found.", null);

            // 🌟 FIX: Verify Project Team Leader
            var project = await _projectRepository.GetByIdAsync(sprint.ProjectId);
            if (project == null || project.IsDeleted || project.TeamLeaderId != teamLeaderId)
            {
                return (false, "Access denied.", null);
            }

            if (task.Priority == dto.Priority) return (false, "The task already has this priority.", MapToDto(task));

            task.Priority = dto.Priority;
            task.UpdatedAt = DateTime.UtcNow;
            await _taskRepository.UpdateAsync(task);

            return (true, "Task priority updated successfully.", MapToDto(task));
        }

        // =========================================================
        // TASK-006: SET TASK DEADLINE
        // =========================================================
        public async Task<(bool Success, string Message, TaskDto? Task)> SetTaskDeadlineAsync(Guid teamLeaderId, Guid taskId, SetTaskDeadlineDto dto)
        {
            if (teamLeaderId == Guid.Empty || dto == null) return (false, "Invalid deadline date.", null);

            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null || task.IsDeleted) return (false, "Task not found.", null);

            var sprint = await _sprintRepository.GetByIdAsync(task.SprintId);
            if (sprint == null || sprint.IsDeleted || !sprint.TeamId.HasValue) return (false, "Sprint not found.", null);

            // 🌟 FIX: Verify Project Team Leader
            var project = await _projectRepository.GetByIdAsync(sprint.ProjectId);
            if (project == null || project.IsDeleted || project.TeamLeaderId != teamLeaderId)
            {
                return (false, "Access denied.", null);
            }

            if (dto.DueDate < task.CreatedAt) return (false, "Invalid deadline date.", null);
            if (dto.DueDate < sprint.StartDate || dto.DueDate > sprint.EndDate) return (false, "Task deadline conflicts with sprint schedule.", null);
            if (task.DueDate == dto.DueDate) return (false, "The task already has this deadline.", MapToDto(task));

            task.DueDate = dto.DueDate;
            task.UpdatedAt = DateTime.UtcNow;
            await _taskRepository.UpdateAsync(task);

            return (true, "Task deadline updated successfully.", MapToDto(task));
        }

        // =========================================================
        // TASK-007: VIEW TASKS (TEAM LEADER)
        // =========================================================
      public async Task<(bool Success, string Message, List<TaskDto> Tasks)>
    GetTeamLeaderTasksAsync(Guid teamLeaderId, Guid sprintId)
{
    if (teamLeaderId == Guid.Empty || sprintId == Guid.Empty)
    {
        return (false, "Access denied.", new List<TaskDto>());
    }

    var sprint = await _sprintRepository.GetByIdAsync(sprintId);
    if (sprint == null || sprint.IsDeleted)
    {
        return (false, "Sprint not found.", new List<TaskDto>());
    }

    // 🌟 FIX: Check Project.TeamLeaderId instead of TeamMembers table
    var project = await _projectRepository.GetByIdAsync(sprint.ProjectId);
    if (project == null || project.IsDeleted || project.TeamLeaderId != teamLeaderId)
    {
        return (false, "Access denied. You are not the Team Leader of this project.", new List<TaskDto>());
    }

    var tasks = await _taskRepository.GetSprintTasksAsync(sprintId);
    tasks = tasks.Where(t => !t.IsDeleted).ToList();

    if (tasks.Count == 0)
    {
        return (true, "No tasks found.", new List<TaskDto>());
    }

    var taskDtos = tasks.Select(MapToDto).ToList();
    return (true, "Tasks retrieved successfully.", taskDtos);
}

        // =========================================================
        // TASK-008: UPDATE TASK STATUS
        // =========================================================
        public async Task<(bool Success, string Message, TaskDto? Task)> UpdateTaskStatusAsync(Guid teamLeaderId, Guid taskId, UpdateTaskStatusDto dto)
        {
            if (teamLeaderId == Guid.Empty || dto == null || !Enum.IsDefined(typeof(ProjectTaskStatus), dto.Status))
                return (false, "This status change is not allowed.", null);

            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null || task.IsDeleted) return (false, "Task not found.", null);

            var sprint = await _sprintRepository.GetByIdAsync(task.SprintId);
            if (sprint == null || sprint.IsDeleted || !sprint.TeamId.HasValue) return (false, "Sprint not found.", null);

            // 🌟 FIX: Verify Project Team Leader
            var project = await _projectRepository.GetByIdAsync(sprint.ProjectId);
            if (project == null || project.IsDeleted || project.TeamLeaderId != teamLeaderId)
            {
                return (false, "Access denied.", null);
            }

            if (!IsValidTaskStatusTransition(task.Status, dto.Status)) return (false, "This status change is not allowed.", null);
            if (task.Status == dto.Status) return (false, "The task already has this status.", MapToDto(task));

            task.Status = dto.Status;
            task.UpdatedAt = DateTime.UtcNow;
            await _taskRepository.UpdateAsync(task);

            return (true, "Task status updated successfully.", MapToDto(task));
        }

        private bool IsValidTaskStatusTransition(ProjectTaskStatus currentStatus, ProjectTaskStatus newStatus)
        {
            if (currentStatus == newStatus) return true;
            return currentStatus switch
            {
                ProjectTaskStatus.Todo => newStatus == ProjectTaskStatus.InProgress || newStatus == ProjectTaskStatus.Blocked,
                ProjectTaskStatus.InProgress => newStatus == ProjectTaskStatus.InReview || newStatus == ProjectTaskStatus.Blocked || newStatus == ProjectTaskStatus.Todo,
                ProjectTaskStatus.InReview => newStatus == ProjectTaskStatus.Completed || newStatus == ProjectTaskStatus.InProgress,
                ProjectTaskStatus.Blocked => newStatus == ProjectTaskStatus.InProgress || newStatus == ProjectTaskStatus.Todo,
                ProjectTaskStatus.Completed => false,
                _ => false
            };
        }

        // =========================================================
        // TASK-009: DELETE TASK
        // =========================================================
        public async Task<(bool Success, string Message)> DeleteTaskAsync(Guid teamLeaderId, Guid taskId)
        {
            if (teamLeaderId == Guid.Empty) return (false, "You are not authorised to delete this task.");

            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null || task.IsDeleted) return (false, "Task not found.");

            var sprint = await _sprintRepository.GetByIdAsync(task.SprintId);
            if (sprint == null || sprint.IsDeleted || !sprint.TeamId.HasValue) return (false, "Sprint not found.");

            // 🌟 FIX: Verify Project Team Leader
            var project = await _projectRepository.GetByIdAsync(sprint.ProjectId);
            if (project == null || project.IsDeleted || project.TeamLeaderId != teamLeaderId)
            {
                return (false, "Access denied.");
            }

            if (task.Status == ProjectTaskStatus.Completed) return (false, "Completed tasks cannot be deleted. Archive the task instead.");

            task.IsDeleted = true;
            task.UpdatedAt = DateTime.UtcNow;
            await _taskRepository.UpdateAsync(task);

            return (true, "Task deleted successfully.");
        }

        // =========================================================
        // TASK-002: UPDATE TASK
        // =========================================================
        public async Task<(bool Success, string Message, TaskDto? Task)> UpdateTaskAsync(Guid teamLeaderId, Guid taskId, UpdateTeamLeaderTaskDto dto)
        {
            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null || task.IsDeleted) return (false, "Task not found.", null);

            var sprint = await _sprintRepository.GetByIdAsync(task.SprintId);
            if (sprint == null || sprint.IsDeleted || !sprint.TeamId.HasValue) return (false, "Sprint not found.", null);

            // 🌟 FIX: Verify Project Team Leader
            var project = await _projectRepository.GetByIdAsync(sprint.ProjectId);
            if (project == null || project.IsDeleted || project.TeamLeaderId != teamLeaderId)
            {
                return (false, "Access denied.", null);
            }

            if (string.IsNullOrWhiteSpace(dto.Title)) return (false, "Please complete all required fields.", null);
            if (dto.EstimatedHours < 0) return (false, "Estimated hours cannot be negative.", null);
            if (dto.DueDate < sprint.StartDate || dto.DueDate > sprint.EndDate) return (false, "Task deadline conflicts with sprint schedule.", null);

            var assignedUser = await _userRepository.GetByIdAsync(dto.AssignedContributorSDId);
            if (assignedUser == null || !assignedUser.IsActive || assignedUser.Role != Role.Contributor)
                return (false, "The selected team member is invalid or inactive.", null);

            var teamMember = await _teamRepository.GetTeamMemberAsync(sprint.TeamId.Value, dto.AssignedContributorSDId);
            if (teamMember == null || !teamMember.IsActive) return (false, "This team member is not assigned to your team.", null);

            var existingTask = await _taskRepository.GetByTitleAsync(task.SprintId, dto.Title.Trim());
            if (existingTask != null && existingTask.Id != taskId && !existingTask.IsDeleted)
                return (false, "A task with this title already exists in this sprint.", null);

            bool anythingChanged = task.Title?.Trim() != dto.Title.Trim() ||
                                   task.Description?.Trim() != (dto.Description?.Trim() ?? string.Empty) ||
                                   task.Priority != dto.Priority ||
                                   task.AssignedContributorSDId != dto.AssignedContributorSDId ||
                                   task.EstimatedHours != dto.EstimatedHours ||
                                   task.DueDate != dto.DueDate;

            if (!anythingChanged) return (false, "No changes were made. The task already contains these values.", MapToDto(task));

            task.Title = dto.Title.Trim();
            task.Description = dto.Description?.Trim() ?? string.Empty;
            task.Priority = dto.Priority;
            task.AssignedContributorSDId = dto.AssignedContributorSDId;
            task.EstimatedHours = dto.EstimatedHours;
            task.DueDate = dto.DueDate;
            task.UpdatedAt = DateTime.UtcNow;

            await _taskRepository.UpdateAsync(task);
            return (true, "Task updated successfully.", MapToDto(task));
        }

        // =========================================================
        // ENTITY -> DTO
        // =========================================================
        private static TaskDto MapToDto(TaskItem task)
        {
            return new TaskDto
            {
                Id = task.Id,
                SprintId = task.SprintId,
                Title = task.Title,
                Description = task.Description,
                CreatedBy = task.CreatedBy,
                AssignedContributorSDId = task.AssignedContributorSDId,
                Priority = task.Priority,
                Status = task.Status,
                EstimatedHours = task.EstimatedHours,
                ActualHours = task.ActualHours,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt
            };
        }
    }
}