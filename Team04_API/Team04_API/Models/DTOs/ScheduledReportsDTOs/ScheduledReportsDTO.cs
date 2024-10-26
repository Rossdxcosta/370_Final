namespace Team04_API.Models.DTOs.ScheduledReportsDTOs
{
    public class ScheduledReportsDTO
    {
    }

    public class UserReportPreferenceDto
    {
        public int ReportId { get; set; }
        public int ReportTypeId { get; set; }
        public string ReportTypeName { get; set; } = string.Empty;
        public int IntervalId { get; set; }
        public string IntervalName { get; set; } = string.Empty;
    }

    public class SetReportPreferenceDto
    {
        public int ReportTypeId { get; set; }
        public int IntervalId { get; set; }
    }
}
