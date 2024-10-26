namespace Team04_API.Models.Report
{
    public class TicketStatistics
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
    }

    public class TicketStatusCount
    {
        public string Status { get; set; }
        public int Count { get; set; }
    }

    public class TicketsCreatedResolvedOverTime
    {
        public DateTime Date { get; set; }
        public int Created_Count { get; set; }
        public int Resolved_Count { get; set; }
    }

    public class AverageResolutionTime
    {
        public DateTime Date { get; set; }
        public double Avg_Resolution_Time { get; set; }
    }

    public class TicketsByPriority
    {
        public string Priority_Name { get; set; }
        public int Count { get; set; }
    }

    public class TicketsByTag
    {
        public string Tag_Name { get; set; }
        public int Count { get; set; }
    }
    public class TicketsAssignedToEmployees
    {
        public string employee_Name { get; set; }
        public int Count { get; set; }
    }

    public class TicketsByClient
    {
        public string client_Name { get; set; }
        public int Count { get; set; }
    }
    public class TicketsCreatedOverTime
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
    }

    public class AvgResolutionTimeLastWeek
    {
        public DateTime resolved_date { get; set; }
        public double avg_resolution_time_hours { get; set; }
    }

    public class EscalatedTicketsLastWeek
    {
        public int Count { get; set; }
    }


}
