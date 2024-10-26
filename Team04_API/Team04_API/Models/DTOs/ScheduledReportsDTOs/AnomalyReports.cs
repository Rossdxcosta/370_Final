using Microsoft.ML.Data;
using System.ComponentModel.DataAnnotations.Schema;

namespace Team04_API.Models.DTOs.ScheduledReportsDTOs
{
    public class AnomalyReports
    {
        [LoadColumn(0)]
        public DateTime? interval_start { get; set; }
        [LoadColumn(1)]
        public DateTime? interval_end { get; set; }
        [LoadColumn(2)]
        public Single? total_tickets { get; set; }
        [LoadColumn(3)]
        public string? tag_counts { get; set; }
        [NotMapped]
        public List<Tag_Counts> tag_counts_list { get; set; } = new List<Tag_Counts>();

    }

    public class Tag_Counts
    {
        [LoadColumn(0)]
        public int id { get; set; }
        [LoadColumn(1)]
        public Single count { get; set; }
    }

    public class FitAnomalyReport
    {
        [LoadColumn(0)]
        public int id { get; set; }
        [LoadColumn(1)]
        public DateTime interval_start { get; set; }
        [LoadColumn(2)]
        public DateTime interval_end { get; set; }
        [LoadColumn(3)]
        public Single count { get; set; }
    }
}
