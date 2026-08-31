namespace AI_PMS.Application.DTOs.Reports
{
    public class TeamPerformanceReportDto
    {
        public Guid TeamId { get; set; }

        public string TeamName { get; set; } = string.Empty;

        // =====================================================
        // TEAM PERFORMANCE
        // =====================================================

        public decimal CompletionRate { get; set; }

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int DelayedTasks { get; set; }

        public int BlockedTasks { get; set; }

        // =====================================================
        // WORKLOAD
        // =====================================================

        public int TotalEstimatedHours { get; set; }

        public int TotalActualHours { get; set; }

        public decimal WorkloadPercentage { get; set; }

        // =====================================================
        // TASK DISTRIBUTION
        // =====================================================

        public List<TaskDistributionDto> TaskDistribution { get; set; }
            = new();

        // =====================================================
        // TEAM LEADER
        // =====================================================

        public List<TeamPerformanceMemberDto> TeamLeaders { get; set; }
            = new();

        // =====================================================
        // CONTRIBUTORS
        // =====================================================

        public List<TeamPerformanceMemberDto> Contributors { get; set; }
            = new();

        // =====================================================
        // REPORT INFORMATION
        // =====================================================

        public DateTime GeneratedAt { get; set; }

        public bool Success { get; set; }

        public string Message { get; set; } = string.Empty;
    }
}
