using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Teams
{
    public class TeamLeaderProjectDetailsDto
    {
        // =========================================================
        // PROJECT
        // =========================================================

        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public Guid StatusId { get; set; }

        public string StatusName { get; set; } = string.Empty;

        public decimal ProgressPercentage { get; set; }

        public int PriorityId { get; set; }

        public string PriorityName { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime Deadline { get; set; }


        // =========================================================
        // MANAGER
        // =========================================================

        public Guid? ManagerId { get; set; }

        public string? ManagerName { get; set; }


        // =========================================================
        // TEAM
        // =========================================================

        public Guid? TeamId { get; set; }

        public string? TeamName { get; set; }

        public Guid? TeamLeaderId { get; set; }

        public string? TeamLeaderName { get; set; }


        // =========================================================
        // PROJECT SPECIFICATION
        // =========================================================

        public string? Objectives { get; set; }

        public string? Scope { get; set; }

        public string? FunctionalRequirements { get; set; }

        public string? NonFunctionalRequirements { get; set; }

        public string? Deliverables { get; set; }

        public string? TechnologyStack { get; set; }


        // =========================================================
        // CURRENT SPRINT
        // =========================================================

        public Guid? CurrentSprintId { get; set; }

        public string? CurrentSprintName { get; set; }

        public string? CurrentSprintGoal { get; set; }

        public SprintStatus? CurrentSprintStatus { get; set; }

        public DateTime? CurrentSprintStartDate { get; set; }

        public DateTime? CurrentSprintEndDate { get; set; }


        // =========================================================
        // TEAM MEMBERS
        // =========================================================

        public List<TeamLeaderProjectMemberDto> TeamMembers { get; set; }
            = new();


        // =========================================================
        // TEAM TASKS
        // =========================================================

        public List<TeamLeaderProjectTaskDto> Tasks { get; set; }
            = new();


        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }


    // =============================================================
    // TEAM MEMBER DTO
    // =============================================================

    public class TeamLeaderProjectMemberDto
    {
        public Guid UserId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public bool IsTeamLeader { get; set; }

        public bool IsActive { get; set; }

        public DateTime JoinedAt { get; set; }
    }


    // =============================================================
    // TEAM TASK DTO
    // =============================================================

    public class TeamLeaderProjectTaskDto
    {
        public Guid Id { get; set; }

        public Guid SprintId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public ProjectTaskStatus Status { get; set; }

        public TaskPriority Priority { get; set; }

        public int EstimatedHours { get; set; }

        public int ActualHours { get; set; }

        public DateTime DueDate { get; set; }

        public Guid? AssignedContributorSDId { get; set; }

        public string? AssignedDeveloperName { get; set; }

        public string? AssignedContributorSDName { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}