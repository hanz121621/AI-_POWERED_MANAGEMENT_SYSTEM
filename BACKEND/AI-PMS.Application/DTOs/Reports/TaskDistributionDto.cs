namespace AI_PMS.Application.DTOs.Reports
{
    public class TaskDistributionDto
    {
        public string Status { get; set; } = string.Empty;

        public int TaskCount { get; set; }

        public decimal Percentage { get; set; }
    }
}