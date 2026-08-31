namespace AI_PMS.Application.DTOs.Projects
{
    // =========================================================
    // PROJECT PARTICIPATION LIST DTO
    // DEV-PROJECT-001
    // STAFF-PROJECT-001
    // =========================================================

    public class ProjectParticipationDto
    {
        public Guid ProjectId { get; set; }

        public string ProjectName { get; set; } = string.Empty;

        public string? Description { get; set; }

        // -----------------------------------------------------
        // STATUS
        // -----------------------------------------------------

        public Guid StatusId { get; set; }

        public string StatusName { get; set; } = string.Empty;

        // -----------------------------------------------------
        // PROGRESS
        // -----------------------------------------------------

        public decimal ProgressPercentage { get; set; }

        // -----------------------------------------------------
        // PARTICIPANT
        // -----------------------------------------------------

        public Guid ParticipantId { get; set; }

        public string ParticipantName { get; set; } = string.Empty;

        public string AssignedRole { get; set; } = string.Empty;

        public string? AssignedRoleSubType { get; set; }

        // -----------------------------------------------------
        // PROJECT MANAGEMENT
        // -----------------------------------------------------

        public Guid? ManagerId { get; set; }

        public string? ManagerName { get; set; }

        public Guid? TeamId { get; set; }

        public string? TeamName { get; set; }

        public Guid? TeamLeaderId { get; set; }

        public string? TeamLeaderName { get; set; }

        // -----------------------------------------------------
        // CURRENT SPRINT
        // -----------------------------------------------------

        public Guid? CurrentSprintId { get; set; }

        public string? CurrentSprintName { get; set; }

        public string? CurrentSprintGoal { get; set; }

        // -----------------------------------------------------
        // TIMELINE
        // -----------------------------------------------------

        public DateTime StartDate { get; set; }

        public DateTime Deadline { get; set; }

        // -----------------------------------------------------
        // COUNTS
        // -----------------------------------------------------

        public int TaskCount { get; set; }

        public int SprintCount { get; set; }
    }


    // =========================================================
    // PROJECT PARTICIPATION DETAILS DTO
    // DEV-PROJECT-002
    // STAFF-PROJECT-002
    // =========================================================

    public class ProjectParticipationDetailsDto
    {
        public Guid ProjectId { get; set; }

        public string ProjectName { get; set; } = string.Empty;

        public string? Description { get; set; }

        // -----------------------------------------------------
        // PROJECT STATUS
        // -----------------------------------------------------

        public Guid StatusId { get; set; }

        public string StatusName { get; set; } = string.Empty;

        public bool IsStatusActive { get; set; }

        public bool IsCompletedStatus { get; set; }

        public bool IsArchivedStatus { get; set; }

        public bool IsCancelledStatus { get; set; }

        // -----------------------------------------------------
        // PROGRESS
        // -----------------------------------------------------

        public decimal ProgressPercentage { get; set; }

        // -----------------------------------------------------
        // TIMELINE
        // -----------------------------------------------------

        public DateTime StartDate { get; set; }

        public DateTime Deadline { get; set; }

        // -----------------------------------------------------
        // PARTICIPANT
        // -----------------------------------------------------

        public Guid ParticipantId { get; set; }

        public string ParticipantName { get; set; } = string.Empty;

        public string AssignedRole { get; set; } = string.Empty;

        public string? AssignedRoleSubType { get; set; }

        // -----------------------------------------------------
        // MANAGER
        // -----------------------------------------------------

        public Guid? ManagerId { get; set; }

        public string? ManagerName { get; set; }

        // -----------------------------------------------------
        // TEAM
        // -----------------------------------------------------

        public Guid? TeamId { get; set; }

        public string? TeamName { get; set; }

        public Guid? TeamLeaderId { get; set; }

        public string? TeamLeaderName { get; set; }

        // -----------------------------------------------------
        // TEAM MEMBERS
        // -----------------------------------------------------

        public List<ProjectParticipantMemberDto> TeamMembers { get; set; }
            = new();

        // -----------------------------------------------------
        // PROJECT SPECIFICATION
        // -----------------------------------------------------

        public ProjectParticipationSpecificationDto? Specification { get; set; }

        // -----------------------------------------------------
        // CURRENT SPRINT
        // -----------------------------------------------------

        public ProjectParticipationSprintDto? CurrentSprint { get; set; }

        // -----------------------------------------------------
        // PROJECT COUNTS
        // -----------------------------------------------------

        public int TaskCount { get; set; }

        public int SprintCount { get; set; }

        // -----------------------------------------------------
        // AUTHORIZED ACTIVITIES
        // -----------------------------------------------------

        public bool CanViewTasks { get; set; } = true;

        public bool CanViewSprints { get; set; } = true;

        public bool CanViewTeamMembers { get; set; } = true;

        public bool CanParticipateInDiscussions { get; set; } = true;

        public bool CanViewResources { get; set; } = true;

        public bool CanViewReports { get; set; } = false;

        // -----------------------------------------------------
        // RECENT ACTIVITIES
        // -----------------------------------------------------

        public List<ProjectParticipationActivityDto> RecentActivities { get; set; }
            = new();
    }


    // =========================================================
    // TEAM MEMBER
    // =========================================================

    public class ProjectParticipantMemberDto
    {
        public Guid UserId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string AssignedRole { get; set; } = string.Empty;

        public string? AssignedRoleSubType { get; set; }

        public bool IsTeamLeader { get; set; }

        public bool IsActive { get; set; }
    }


    // =========================================================
    // SPECIFICATION
    // =========================================================

    public class ProjectParticipationSpecificationDto
    {
        public Guid Id { get; set; }

        public string Objectives { get; set; } = string.Empty;

        public string Scope { get; set; } = string.Empty;

        public string FunctionalRequirements { get; set; } = string.Empty;

        public string NonFunctionalRequirements { get; set; } = string.Empty;

        public string Deliverables { get; set; } = string.Empty;

        public string TechnologyStack { get; set; } = string.Empty;

        public string? Assumptions { get; set; }

        public string? Constraints { get; set; }
    }


    // =========================================================
    // SPRINT
    // =========================================================

    public class ProjectParticipationSprintDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Goal { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Status { get; set; } = string.Empty;

        public string Priority { get; set; } = string.Empty;
    }


    // =========================================================
    // ACTIVITY
    // =========================================================

    public class ProjectParticipationActivityDto
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string UserName { get; set; } = string.Empty;

        public string Action { get; set; } = string.Empty;

        public string? ActivityType { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}