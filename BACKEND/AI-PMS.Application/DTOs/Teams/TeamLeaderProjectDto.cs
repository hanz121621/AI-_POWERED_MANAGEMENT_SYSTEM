namespace AI_PMS.Application.DTOs.Teams
{
    public class TeamLeaderProjectDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }
            = string.Empty;

        public string Description { get; set; }
            = string.Empty;

        public Guid StatusId { get; set; }

        public string StatusName { get; set; }
            = string.Empty;

        public decimal ProgressPercentage { get; set; }

        public Guid? TeamId { get; set; }

        public string TeamName { get; set; }
            = string.Empty;

        public Guid? ManagerId { get; set; }

        public string ManagerName { get; set; }
            = string.Empty;

        public int PriorityId { get; set; }

        public string PriorityName { get; set; }
            = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime Deadline { get; set; }

        public Guid? CurrentSprintId { get; set; }

        public string? CurrentSprintName { get; set; }
    }
}