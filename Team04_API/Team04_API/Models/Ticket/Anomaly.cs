using Microsoft.ML.Data;
using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Ticket
{
    public class Anomaly
    {
        [Key]
        [Required]
        public int Anomaly_ID { get; set; }

        public string? Anomaly_Description { get; set; }

        public required IntervalRecord IntervalRecord { get; set; }

        public required List<AnomalyReport> anomalyReports { get; set; }
       
        public string? Anomaly_Status { get; set; }
        //TODO:Virtual
        public virtual List<Ticket>? Ticket { get; set; }
        //TODO:
        public DateTime? Anomaly_DateTime_Started { get; set; }
    }

    public class IntervalRecord
    {
        [LoadColumn(0)]
        public DateTime interval_start { get; set; }
        [LoadColumn(1)]
        public DateTime interval_end { get; set; }
        [LoadColumn(2)]
        public Single record_count { get; set; }
    }

    public class AnomalyReport
    {

        public int TagID { get; set; }
        public int submission_count { get; set; }
        public DateTime last_submission_time { get; set; }

        //public virtual List<Ticket>? Tickets { get; set; }
    }

    public class TagStatistics
    {
        public int TagID { get; set; }
        public int submission_count { get; set; }
        public DateTime last_submission_time { get; set; }
    }
}
