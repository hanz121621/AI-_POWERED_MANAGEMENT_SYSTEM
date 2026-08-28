namespace AI_PMS.Application.DTOs;

public class TeamPerformanceRequest
{
    public string ProjectName { get; set; } = string.Empty;

    public List<TeamMemberPerformanceDto> TeamMembers { get; set; }
        = new();
}

public class TeamMemberPerformanceDto
{
    public string MemberName { get; set; } = string.Empty;

    public int TotalTasks { get; set; }

    public int CompletedTasks { get; set; }

    public int InProgressTasks { get; set; }

    public int BlockedTasks { get; set; }

    public int OverdueTasks { get; set; }

    public int EstimatedHours { get; set; }

    public int ActualHours { get; set; }

    public double CompletionRate { get; set; }
}

public class TeamPerformanceResponse
{
    public string ProjectName { get; set; } = string.Empty;

    public List<TeamMemberPerformanceDto> TeamMembers { get; set; }
        = new();

    public string OverallAnalysis { get; set; } = string.Empty;

    public List<string> KeyFindings { get; set; } = new();

    public List<string> Recommendations { get; set; } = new();
}