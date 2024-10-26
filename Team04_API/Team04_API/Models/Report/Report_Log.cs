using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models.Users;
using Team04_API.Models;

namespace Team04_API.Models.Report
{
    public class EmployeeReport
    {
        [Key]
        public int Report_ID { get; set; }
        public string Report_Title { get; set; } = string.Empty;
        public string Report_Description { get; set; } = string.Empty;
        public DateTime Report_Date_Created { get; set; }
      
        [ForeignKey(nameof(Employee))]
        public Guid Employee_ID { get; set; }
        [ForeignKey(nameof(Report_Type.Report_Type_ID))]
        public int Report_Type_ID { get; set; }
        [ForeignKey(nameof(Report_Interval.Report_Interval_ID))]
        public int Report_Interval_ID { get; set; }
        public DateTime NextDueDate { get; set; }


        //Virtual
        public virtual User? Employee { get; set; }
        public virtual Report_Type? Report_Type { get; set; }
        public virtual Report_Interval? Report_Interval { get; set; }
        //public virtual List<EmployeeReport>? EmployeeReports { get; set; }
    }
}
