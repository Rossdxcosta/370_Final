using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Report
{
    public class Report_Type
    {
        [Key]
        public int Report_Type_ID { get; set; }
        public string Report_Type_Name { get; set; } = string.Empty;
        public string Report_Type_Description { get; set; } = string.Empty;

        //virtual
        public virtual List<EmployeeReport>? EmployeeReports { get; set; }
    }
}
