namespace AI_PMS.Application.Settings
{
    public class ReportExportSettings
    {
        public List<string> AvailableFormats { get; set; } = new();

        public bool EnableActivityLogging { get; set; } = true;
    }
}