using Team04_API.Models.Report;

namespace Team04_API.Repositries
{
    public interface IReportingMethod
    {
        Task<IResult> GernerateReport();
        Task<bool> GenerateGroupedReport(List<EmployeeReport> employeeReports);
    }
}
