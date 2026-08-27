namespace AI_PMS.Application.DTOs.Reports
{
    public class ReportExportRequestDto
    {
        public string ReportType { get; set; } = string.Empty;

        public string Format { get; set; } = string.Empty;
    }

    public class ReportExportFileDto
    {
        public byte[] Content { get; set; } = Array.Empty<byte>();

        public string ContentType { get; set; } = "application/octet-stream";

        public string FileName { get; set; } = string.Empty;

        public string Format { get; set; } = string.Empty;

        public string ReportType { get; set; } = string.Empty;
    }

    public class ReportExportFormatsDto
    {
        public List<string> AvailableFormats { get; set; } = new();
    }
}