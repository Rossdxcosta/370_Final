using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Report
{
    public class Report_Interval
    {
        [Key]
        public int Report_Interval_ID { get; set; }
        [Required]
        [MinLength(1), MaxLength(50)]
        public string Report_Interval_Name { get; set; } = string.Empty;
        [Required]
        public int Report_Interval_Value { get; set; }
        [Required]
        public string Report_Interval_Description { get; set; } = string.Empty;

        //virtual
        public virtual List<EmployeeReport>? EmployeeReports { get; set; }
    }
}
