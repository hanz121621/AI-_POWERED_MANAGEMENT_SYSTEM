namespace AI_PMS.Application.DTOs.Reports
{
    public class TeamPerformanceMemberDto
    {
        public Guid UserId { get; set; }

        public string UserName { get; set; } = string.Empty;

        // =====================================================
        // CONFIGURED CONTRIBUTOR CLASSIFICATION
        // =====================================================

        public Guid ContributorTypeId { get; set; }

        public string ContributorType { get; set; } = string.Empty;

        public Guid? ContributorSubTypeId { get; set; }

        public string? ContributorSubType { get; set; }

        // =====================================================
        // TEAM LEADER
        // =====================================================

        public bool IsTeamLeader { get; set; }

        // =====================================================
        // PERFORMANCE
        // =====================================================

        public int AssignedTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int DelayedTasks { get; set; }

        public int BlockedTasks { get; set; }

        public int EstimatedHours { get; set; }

        public int ActualHours { get; set; }

        public decimal CompletionRate { get; set; }

        public decimal WorkloadPercentage { get; set; }
    }
}
