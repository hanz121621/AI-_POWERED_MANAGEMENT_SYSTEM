using System.Globalization;
using System.Text;
using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Reports;
using AI_PMS.Application.Settings;
using Microsoft.Extensions.Options;

namespace AI_PMS.Application.Services.Reports
{
    public class ReportExportService : IReportExportService
    {
        private readonly IProjectDashboardService _dashboardService;
        private readonly IProjectTimelineService _timelineService;
        private readonly ISprintProgressService _sprintProgressService;
        private readonly IActivityLogService _activityLogService;
        private readonly ReportExportSettings _settings;

        public ReportExportService(
            IProjectDashboardService dashboardService,
            IProjectTimelineService timelineService,
            ISprintProgressService sprintProgressService,
            IActivityLogService activityLogService,
            IOptions<ReportExportSettings> settings)
        {
            _dashboardService = dashboardService;
            _timelineService = timelineService;
            _sprintProgressService = sprintProgressService;
            _activityLogService = activityLogService;
            _settings = settings.Value;
        }

        // =========================================================
        // AVAILABLE FORMATS
        // =========================================================

        public Task<ReportExportFormatsDto> GetAvailableFormatsAsync()
        {
            var formats = _settings.AvailableFormats
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => x.Trim().ToUpperInvariant())
                .Distinct()
                .ToList();

            return Task.FromResult(
                new ReportExportFormatsDto
                {
                    AvailableFormats = formats
                });
        }

        // =========================================================
        // PROJECT DASHBOARD
        // =========================================================

        public async Task<ReportExportFileDto?> ExportProjectDashboardAsync(
            Guid managerId,
            Guid projectId,
            string format,
            CancellationToken cancellationToken = default)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var normalizedFormat = NormalizeFormat(format);

            EnsureFormatConfigured(normalizedFormat);

            var result =
                await _dashboardService.GetProjectDashboardAsync(
                    managerId,
                    projectId);

            if (!result.Success || result.Data == null)
            {
                return null;
            }

            var report = result.Data;

            var file = normalizedFormat switch
            {
                "CSV" => GenerateDashboardCsv(report),
                "HTML" => GenerateDashboardHtml(report),
                _ => throw new NotSupportedException(
                    $"Export format '{normalizedFormat}' is not supported by the current file generator.")
            };

            await LogExportAsync(
                managerId,
                projectId,
                "Project Dashboard",
                normalizedFormat);

            return file;
        }

        // =========================================================
        // PROJECT TIMELINE
        // =========================================================

        public async Task<ReportExportFileDto?> ExportProjectTimelineAsync(
            Guid managerId,
            Guid projectId,
            string format,
            CancellationToken cancellationToken = default)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var normalizedFormat = NormalizeFormat(format);

            EnsureFormatConfigured(normalizedFormat);

            var result =
                await _timelineService.GetProjectTimelineAsync(
                    managerId,
                    projectId);

            if (!result.Success || result.Data == null)
            {
                return null;
            }

            var report = result.Data;

            var file = normalizedFormat switch
            {
                "CSV" => GenerateTimelineCsv(report),
                "HTML" => GenerateTimelineHtml(report),
                _ => throw new NotSupportedException(
                    $"Export format '{normalizedFormat}' is not supported by the current file generator.")
            };

            await LogExportAsync(
                managerId,
                projectId,
                "Project Timeline",
                normalizedFormat);

            return file;
        }

        // =========================================================
        // SPRINT PROGRESS
        // =========================================================

        public async Task<ReportExportFileDto?> ExportSprintProgressAsync(
            Guid managerId,
            Guid projectId,
            Guid sprintId,
            string format,
            CancellationToken cancellationToken = default)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var normalizedFormat = NormalizeFormat(format);

            EnsureFormatConfigured(normalizedFormat);

            var report =
                await _sprintProgressService.GetSprintProgressAsync(
                    projectId,
                    sprintId,
                    managerId,
                    cancellationToken);

            if (report == null)
            {
                return null;
            }

            var file = normalizedFormat switch
            {
                "CSV" => GenerateSprintProgressCsv(report),
                "HTML" => GenerateSprintProgressHtml(report),
                _ => throw new NotSupportedException(
                    $"Export format '{normalizedFormat}' is not supported by the current file generator.")
            };

            await LogExportAsync(
                managerId,
                projectId,
                "Sprint Progress",
                normalizedFormat);

            return file;
        }

        // =========================================================
        // FORMAT VALIDATION
        // =========================================================

        private void EnsureFormatConfigured(string format)
        {
            var configuredFormats = _settings.AvailableFormats
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => x.Trim().ToUpperInvariant())
                .ToHashSet();

            if (!configuredFormats.Contains(format))
            {
                throw new InvalidOperationException(
                    $"Export format '{format}' is not configured.");
            }
        }

        private static string NormalizeFormat(string format)
        {
            if (string.IsNullOrWhiteSpace(format))
            {
                throw new ArgumentException(
                    "Export format is required.",
                    nameof(format));
            }

            return format
                .Trim()
                .ToUpperInvariant();
        }

        // =========================================================
        // DASHBOARD CSV
        // =========================================================

        private static ReportExportFileDto GenerateDashboardCsv(
            ProjectDashboardDto report)
        {
            var sb = new StringBuilder();

            sb.AppendLine("PROJECT DASHBOARD");
            sb.AppendLine();

            sb.AppendLine("Project ID,Project Name,Project Progress,Progress State,Project Deadline");

            sb.AppendLine(
                $"{Csv(report.ProjectId)},\"{Csv(report.ProjectName)}\"," +
                $"{Csv(report.OverallProjectProgress?.ToString(CultureInfo.InvariantCulture))}," +
                $"\"{Csv(report.ProgressState)}\"," +
                $"{Csv(report.ProjectDeadline?.ToString("yyyy-MM-dd HH:mm:ss"))}");

            sb.AppendLine();

            sb.AppendLine("TASK STATISTICS");
            sb.AppendLine("Metric,Value");

            sb.AppendLine($"Total Tasks,{report.TotalTasks}");
            sb.AppendLine($"Completed Tasks,{report.CompletedTasks}");
            sb.AppendLine($"In Progress Tasks,{report.InProgressTasks}");
            sb.AppendLine($"In Review Tasks,{report.InReviewTasks}");
            sb.AppendLine($"Todo Tasks,{report.TodoTasks}");
            sb.AppendLine($"Blocked Tasks,{report.BlockedTasks}");
            sb.AppendLine($"Overdue Tasks,{report.OverdueTasks}");
            sb.AppendLine($"Remaining Tasks,{report.RemainingTasks}");

            sb.AppendLine();

            sb.AppendLine("TEAM");
            sb.AppendLine("Metric,Value");

            sb.AppendLine($"Team ID,{Csv(report.TeamId)}");
            sb.AppendLine($"Team Name,\"{Csv(report.TeamName)}\"");
            sb.AppendLine(
                $"Team Progress,{report.TeamProgressPercentage?.ToString(CultureInfo.InvariantCulture)}");
            sb.AppendLine(
                $"Assigned Work Items,{report.TeamAssignedWorkItems}");
            sb.AppendLine(
                $"Team Member Count,{report.TeamMemberCount}");
            sb.AppendLine(
                $"Team Developer Count,{report.TeamDeveloperCount}");
            sb.AppendLine(
                $"Team Staff Count,{report.TeamStaffCount}");

            sb.AppendLine();

            sb.AppendLine("TEAM LEADER");
            sb.AppendLine("Metric,Value");

            sb.AppendLine($"Team Leader ID,{Csv(report.TeamLeaderId)}");
            sb.AppendLine($"Team Leader Name,\"{Csv(report.TeamLeaderName)}\"");
            sb.AppendLine(
                $"Tasks Created,{report.TeamLeaderTasksCreated}");
            sb.AppendLine(
                $"Tasks Assigned,{report.TeamLeaderTasksAssigned}");
            sb.AppendLine(
                $"Progress Percentage,{report.TeamLeaderProgressPercentage?.ToString(CultureInfo.InvariantCulture)}");

            sb.AppendLine();

            sb.AppendLine("WORKLOAD");
            sb.AppendLine("Metric,Value");

            sb.AppendLine(
                $"Estimated Work Hours,{report.EstimatedWorkHours}");
            sb.AppendLine(
                $"Actual Work Hours,{report.ActualWorkHours}");

            sb.AppendLine();

            sb.AppendLine("UPCOMING DEADLINES");
            sb.AppendLine(
                "ID,Type,Name,Deadline");

            foreach (var deadline in report.UpcomingDeadlines)
            {
                sb.AppendLine(
                    $"{deadline.Id}," +
                    $"\"{Csv(deadline.Type)}\"," +
                    $"\"{Csv(deadline.Name)}\"," +
                    $"{deadline.Deadline:yyyy-MM-dd HH:mm:ss}");
            }

            sb.AppendLine();

            sb.AppendLine("RECENT ACTIVITIES");
            sb.AppendLine(
                "ID,User ID,Action,Activity Type,Entity Type,Entity ID,Description,Created At");

            foreach (var activity in report.RecentActivities)
            {
                sb.AppendLine(
                    $"{activity.Id}," +
                    $"{activity.UserId}," +
                    $"\"{Csv(activity.Action)}\"," +
                    $"\"{Csv(activity.ActivityType)}\"," +
                    $"\"{Csv(activity.EntityType)}\"," +
                    $"{Csv(activity.EntityId)}," +
                    $"\"{Csv(activity.Description)}\"," +
                    $"{activity.CreatedAt:yyyy-MM-dd HH:mm:ss}");
            }

            return CreateCsvFile(
                sb.ToString(),
                $"project-dashboard-{report.ProjectId}");
        }

        // =========================================================
        // TIMELINE CSV
        // =========================================================

        private static ReportExportFileDto GenerateTimelineCsv(
            ProjectTimelineDto report)
        {
            var sb = new StringBuilder();

            sb.AppendLine("PROJECT TIMELINE");
            sb.AppendLine();

            sb.AppendLine(
                "Project ID,Project Name,Start Date,Deadline,Current Progress");

            sb.AppendLine(
                $"{report.ProjectId}," +
                $"\"{Csv(report.ProjectName)}\"," +
                $"{report.ProjectStartDate:yyyy-MM-dd HH:mm:ss}," +
                $"{report.ProjectDeadline:yyyy-MM-dd HH:mm:ss}," +
                $"{report.CurrentProgressPercentage.ToString(CultureInfo.InvariantCulture)}");

            sb.AppendLine();

            sb.AppendLine("MILESTONES");
            sb.AppendLine("ID,Name,Due Date,Status");

            foreach (var milestone in report.Milestones)
            {
                sb.AppendLine(
                    $"{milestone.Id}," +
                    $"\"{Csv(milestone.Name)}\"," +
                    $"{Csv(milestone.DueDate?.ToString("yyyy-MM-dd HH:mm:ss"))}," +
                    $"\"{Csv(milestone.Status)}\"");
            }

            sb.AppendLine();

            sb.AppendLine("SPRINTS");
            sb.AppendLine(
                "Sprint ID,Name,Goal,Start Date,End Date,Status,Total Tasks,Completed Tasks,Remaining Tasks,Progress,Current");

            foreach (var sprint in report.Sprints)
            {
                sb.AppendLine(
                    $"{sprint.SprintId}," +
                    $"\"{Csv(sprint.Name)}\"," +
                    $"\"{Csv(sprint.Goal)}\"," +
                    $"{sprint.StartDate:yyyy-MM-dd HH:mm:ss}," +
                    $"{sprint.EndDate:yyyy-MM-dd HH:mm:ss}," +
                    $"\"{Csv(sprint.Status)}\"," +
                    $"{sprint.TotalTasks}," +
                    $"{sprint.CompletedTasks}," +
                    $"{sprint.RemainingTasks}," +
                    $"{sprint.ProgressPercentage.ToString(CultureInfo.InvariantCulture)}," +
                    $"{sprint.IsCurrent}");
            }

            sb.AppendLine();

            sb.AppendLine("OVERDUE ITEMS");
            sb.AppendLine("ID,Item Type,Name,Deadline,Status");

            foreach (var item in report.OverdueItems)
            {
                sb.AppendLine(
                    $"{item.Id}," +
                    $"\"{Csv(item.ItemType)}\"," +
                    $"\"{Csv(item.Name)}\"," +
                    $"{item.Deadline:yyyy-MM-dd HH:mm:ss}," +
                    $"\"{Csv(item.Status)}\"");
            }

            sb.AppendLine();

            sb.AppendLine($"Overdue Item Count,{report.OverdueItemCount}");

            return CreateCsvFile(
                sb.ToString(),
                $"project-timeline-{report.ProjectId}");
        }

        // =========================================================
        // SPRINT PROGRESS CSV
        // =========================================================

        private static ReportExportFileDto GenerateSprintProgressCsv(
            SprintProgressDto report)
        {
            var sb = new StringBuilder();

            sb.AppendLine("SPRINT PROGRESS");
            sb.AppendLine();

            sb.AppendLine("Field,Value");

            sb.AppendLine($"Sprint ID,{report.SprintId}");
            sb.AppendLine($"Project ID,{report.ProjectId}");
            sb.AppendLine($"Sprint Name,\"{Csv(report.SprintName)}\"");
            sb.AppendLine($"Goal,\"{Csv(report.Goal)}\"");
            sb.AppendLine(
                $"Start Date,{report.StartDate:yyyy-MM-dd HH:mm:ss}");
            sb.AppendLine(
                $"End Date,{report.EndDate:yyyy-MM-dd HH:mm:ss}");
            sb.AppendLine(
                $"Sprint Status,\"{Csv(report.SprintStatusName)}\"");

            sb.AppendLine();

            sb.AppendLine("TASK STATISTICS");

            sb.AppendLine($"Total Tasks,{report.TotalTasks}");
            sb.AppendLine(
                $"Completed Tasks,{report.CompletedTasks}");
            sb.AppendLine(
                $"In Progress Tasks,{report.InProgressTasks}");
            sb.AppendLine(
                $"Pending Tasks,{report.PendingTasks}");
            sb.AppendLine(
                $"Blocked Tasks,{report.BlockedTasks}");
            sb.AppendLine(
                $"Overdue Tasks,{report.OverdueTasks}");

            sb.AppendLine();

            sb.AppendLine(
                $"Completion Percentage,{report.CompletionPercentage.ToString(CultureInfo.InvariantCulture)}");

            sb.AppendLine(
                $"Generated At,{report.GeneratedAt:yyyy-MM-dd HH:mm:ss}");

            return CreateCsvFile(
                sb.ToString(),
                $"sprint-progress-{report.SprintId}");
        }

        // =========================================================
        // DASHBOARD HTML
        // =========================================================

        private static ReportExportFileDto GenerateDashboardHtml(
            ProjectDashboardDto report)
        {
            var html = new StringBuilder();

            html.AppendLine("<!DOCTYPE html>");
            html.AppendLine("<html>");
            html.AppendLine("<head>");
            html.AppendLine("<meta charset=\"UTF-8\">");
            html.AppendLine(
                "<title>Project Dashboard</title>");
            html.AppendLine("<style>");
            html.AppendLine(
                "body{font-family:Arial,sans-serif;margin:40px;color:#222;}");
            html.AppendLine(
                "h1,h2{margin-bottom:10px;}");
            html.AppendLine(
                "table{width:100%;border-collapse:collapse;margin-bottom:25px;}");
            html.AppendLine(
                "th,td{border:1px solid #ccc;padding:8px;text-align:left;}");
            html.AppendLine(
                "th{font-weight:bold;}");
            html.AppendLine(
                "</style>");
            html.AppendLine("</head>");
            html.AppendLine("<body>");

            html.AppendLine(
                $"<h1>Project Dashboard</h1>");

            html.AppendLine(
                $"<h2>{Html(report.ProjectName)}</h2>");

            html.AppendLine("<table>");

            AddHtmlRow(
                html,
                "Project ID",
                report.ProjectId.ToString());

            AddHtmlRow(
                html,
                "Project Progress",
                report.OverallProjectProgress?.ToString(
                    CultureInfo.InvariantCulture) ?? "N/A");

            AddHtmlRow(
                html,
                "Progress State",
                report.ProgressState);

            AddHtmlRow(
                html,
                "Project Deadline",
                report.ProjectDeadline?.ToString(
                    "yyyy-MM-dd HH:mm:ss") ?? "N/A");

            AddHtmlRow(
                html,
                "Total Tasks",
                report.TotalTasks.ToString());

            AddHtmlRow(
                html,
                "Completed Tasks",
                report.CompletedTasks.ToString());

            AddHtmlRow(
                html,
                "In Progress Tasks",
                report.InProgressTasks.ToString());

            AddHtmlRow(
                html,
                "In Review Tasks",
                report.InReviewTasks.ToString());

            AddHtmlRow(
                html,
                "Todo Tasks",
                report.TodoTasks.ToString());

            AddHtmlRow(
                html,
                "Blocked Tasks",
                report.BlockedTasks.ToString());

            AddHtmlRow(
                html,
                "Overdue Tasks",
                report.OverdueTasks.ToString());

            AddHtmlRow(
                html,
                "Remaining Tasks",
                report.RemainingTasks.ToString());

            AddHtmlRow(
                html,
                "Estimated Work Hours",
                report.EstimatedWorkHours.ToString());

            AddHtmlRow(
                html,
                "Actual Work Hours",
                report.ActualWorkHours.ToString());

            html.AppendLine("</table>");

            html.AppendLine("<h2>Upcoming Deadlines</h2>");
            html.AppendLine(
                "<table><tr><th>Type</th><th>Name</th><th>Deadline</th></tr>");

            foreach (var deadline in report.UpcomingDeadlines)
            {
                html.AppendLine(
                    $"<tr>" +
                    $"<td>{Html(deadline.Type)}</td>" +
                    $"<td>{Html(deadline.Name)}</td>" +
                    $"<td>{deadline.Deadline:yyyy-MM-dd HH:mm:ss}</td>" +
                    $"</tr>");
            }

            html.AppendLine("</table>");

            html.AppendLine(
                "<p>Generated from the current project report data.</p>");

            html.AppendLine("</body>");
            html.AppendLine("</html>");

            return CreateHtmlFile(
                html.ToString(),
                $"project-dashboard-{report.ProjectId}");
        }

        // =========================================================
        // TIMELINE HTML
        // =========================================================

        private static ReportExportFileDto GenerateTimelineHtml(
            ProjectTimelineDto report)
        {
            var html = new StringBuilder();

            html.AppendLine("<!DOCTYPE html>");
            html.AppendLine("<html>");
            html.AppendLine("<head>");
            html.AppendLine("<meta charset=\"UTF-8\">");
            html.AppendLine("<title>Project Timeline</title>");
            html.AppendLine("<style>");
            html.AppendLine(
                "body{font-family:Arial,sans-serif;margin:40px;color:#222;}");
            html.AppendLine(
                "table{width:100%;border-collapse:collapse;margin-bottom:25px;}");
            html.AppendLine(
                "th,td{border:1px solid #ccc;padding:8px;text-align:left;}");
            html.AppendLine("</style>");
            html.AppendLine("</head>");
            html.AppendLine("<body>");

            html.AppendLine("<h1>Project Timeline</h1>");

            html.AppendLine(
                $"<h2>{Html(report.ProjectName)}</h2>");

            html.AppendLine("<table>");

            AddHtmlRow(
                html,
                "Project ID",
                report.ProjectId.ToString());

            AddHtmlRow(
                html,
                "Project Start Date",
                report.ProjectStartDate.ToString(
                    "yyyy-MM-dd HH:mm:ss"));

            AddHtmlRow(
                html,
                "Project Deadline",
                report.ProjectDeadline.ToString(
                    "yyyy-MM-dd HH:mm:ss"));

            AddHtmlRow(
                html,
                "Current Progress",
                report.CurrentProgressPercentage
                    .ToString(CultureInfo.InvariantCulture));

            AddHtmlRow(
                html,
                "Overdue Items",
                report.OverdueItemCount.ToString());

            html.AppendLine("</table>");

            html.AppendLine("<h2>Sprints</h2>");

            html.AppendLine(
                "<table>" +
                "<tr>" +
                "<th>Name</th>" +
                "<th>Goal</th>" +
                "<th>Start</th>" +
                "<th>End</th>" +
                "<th>Status</th>" +
                "<th>Total</th>" +
                "<th>Completed</th>" +
                "<th>Remaining</th>" +
                "<th>Progress</th>" +
                "</tr>");

            foreach (var sprint in report.Sprints)
            {
                html.AppendLine(
                    "<tr>" +
                    $"<td>{Html(sprint.Name)}</td>" +
                    $"<td>{Html(sprint.Goal)}</td>" +
                    $"<td>{sprint.StartDate:yyyy-MM-dd}</td>" +
                    $"<td>{sprint.EndDate:yyyy-MM-dd}</td>" +
                    $"<td>{Html(sprint.Status)}</td>" +
                    $"<td>{sprint.TotalTasks}</td>" +
                    $"<td>{sprint.CompletedTasks}</td>" +
                    $"<td>{sprint.RemainingTasks}</td>" +
                    $"<td>{sprint.ProgressPercentage.ToString(CultureInfo.InvariantCulture)}%</td>" +
                    "</tr>");
            }

            html.AppendLine("</table>");

            html.AppendLine("<h2>Overdue Items</h2>");

            html.AppendLine(
                "<table>" +
                "<tr>" +
                "<th>Type</th>" +
                "<th>Name</th>" +
                "<th>Deadline</th>" +
                "<th>Status</th>" +
                "</tr>");

            foreach (var item in report.OverdueItems)
            {
                html.AppendLine(
                    "<tr>" +
                    $"<td>{Html(item.ItemType)}</td>" +
                    $"<td>{Html(item.Name)}</td>" +
                    $"<td>{item.Deadline:yyyy-MM-dd HH:mm:ss}</td>" +
                    $"<td>{Html(item.Status)}</td>" +
                    "</tr>");
            }

            html.AppendLine("</table>");

            html.AppendLine("</body>");
            html.AppendLine("</html>");

            return CreateHtmlFile(
                html.ToString(),
                $"project-timeline-{report.ProjectId}");
        }

        // =========================================================
        // SPRINT PROGRESS HTML
        // =========================================================

        private static ReportExportFileDto GenerateSprintProgressHtml(
            SprintProgressDto report)
        {
            var html = new StringBuilder();

            html.AppendLine("<!DOCTYPE html>");
            html.AppendLine("<html>");
            html.AppendLine("<head>");
            html.AppendLine("<meta charset=\"UTF-8\">");
            html.AppendLine("<title>Sprint Progress</title>");
            html.AppendLine("<style>");
            html.AppendLine(
                "body{font-family:Arial,sans-serif;margin:40px;color:#222;}");
            html.AppendLine(
                "table{width:100%;border-collapse:collapse;}");
            html.AppendLine(
                "th,td{border:1px solid #ccc;padding:8px;text-align:left;}");
            html.AppendLine("</style>");
            html.AppendLine("</head>");
            html.AppendLine("<body>");

            html.AppendLine("<h1>Sprint Progress</h1>");

            html.AppendLine(
                $"<h2>{Html(report.SprintName)}</h2>");

            html.AppendLine("<table>");

            AddHtmlRow(
                html,
                "Sprint ID",
                report.SprintId.ToString());

            AddHtmlRow(
                html,
                "Project ID",
                report.ProjectId.ToString());

            AddHtmlRow(
                html,
                "Goal",
                report.Goal);

            AddHtmlRow(
                html,
                "Start Date",
                report.StartDate.ToString(
                    "yyyy-MM-dd HH:mm:ss"));

            AddHtmlRow(
                html,
                "End Date",
                report.EndDate.ToString(
                    "yyyy-MM-dd HH:mm:ss"));

            AddHtmlRow(
                html,
                "Status",
                report.SprintStatusName);

            AddHtmlRow(
                html,
                "Total Tasks",
                report.TotalTasks.ToString());

            AddHtmlRow(
                html,
                "Completed Tasks",
                report.CompletedTasks.ToString());

            AddHtmlRow(
                html,
                "In Progress Tasks",
                report.InProgressTasks.ToString());

            AddHtmlRow(
                html,
                "Pending Tasks",
                report.PendingTasks.ToString());

            AddHtmlRow(
                html,
                "Blocked Tasks",
                report.BlockedTasks.ToString());

            AddHtmlRow(
                html,
                "Overdue Tasks",
                report.OverdueTasks.ToString());

            AddHtmlRow(
                html,
                "Completion Percentage",
                report.CompletionPercentage
                    .ToString(CultureInfo.InvariantCulture) + "%");

            AddHtmlRow(
                html,
                "Generated At",
                report.GeneratedAt.ToString(
                    "yyyy-MM-dd HH:mm:ss"));

            html.AppendLine("</table>");

            html.AppendLine("</body>");
            html.AppendLine("</html>");

            return CreateHtmlFile(
                html.ToString(),
                $"sprint-progress-{report.SprintId}");
        }

        // =========================================================
        // ACTIVITY LOG
        // =========================================================

        private async Task LogExportAsync(
            Guid managerId,
            Guid projectId,
            string reportType,
            string format)
        {
            if (!_settings.EnableActivityLogging)
            {
                return;
            }

            try
            {
                await _activityLogService.CreateAsync(
                    managerId,
                    "Report Exported",
                    "Report",
                    projectId,
                    "Project",
                    $"{reportType} exported in {format} format.");
            }
            catch
            {
                // Export should not fail only because activity
                // logging failed.
            }
        }

        // =========================================================
        // FILE HELPERS
        // =========================================================

        private static ReportExportFileDto CreateCsvFile(
            string content,
            string baseFileName)
        {
            return new ReportExportFileDto
            {
                Content = new UTF8Encoding(
                    encoderShouldEmitUTF8Identifier: true)
                    .GetBytes(content),

                ContentType = "text/csv",

                FileName =
                    $"{baseFileName}-{DateTime.UtcNow:yyyyMMddHHmmss}.csv",

                Format = "CSV"
            };
        }

        private static ReportExportFileDto CreateHtmlFile(
            string content,
            string baseFileName)
        {
            return new ReportExportFileDto
            {
                Content = Encoding.UTF8.GetBytes(content),

                ContentType = "text/html",

                FileName =
                    $"{baseFileName}-{DateTime.UtcNow:yyyyMMddHHmmss}.html",

                Format = "HTML"
            };
        }

        private static string Csv(object? value)
        {
            if (value == null)
            {
                return string.Empty;
            }

            return value
                .ToString()!
                .Replace("\"", "\"\"");
        }

        private static string Html(string? value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }

            return value
                .Replace("&", "&amp;")
                .Replace("<", "&lt;")
                .Replace(">", "&gt;")
                .Replace("\"", "&quot;")
                .Replace("'", "&#39;");
        }

        private static void AddHtmlRow(
            StringBuilder html,
            string label,
            string? value)
        {
            html.AppendLine(
                "<tr>" +
                $"<th>{Html(label)}</th>" +
                $"<td>{Html(value)}</td>" +
                "</tr>");
        }
    }
}