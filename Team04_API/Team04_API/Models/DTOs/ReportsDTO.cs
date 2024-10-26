using System.ComponentModel.DataAnnotations;
using Team04_API.Models.Users;

namespace Team04_API.Models.DTOs
{
    public class ReportsDTO
    {
    }
    public class OpenTicketDTO
    {
        [Display(Name = "Ticket ID")]
        public int TicketID { get; set; }

        [Display(Name = "Title            ")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Creation Date")]
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;

        [Display(Name = "Assigned agent")]
        public string AssignedAgent { get; set; } = string.Empty;

        [Display(Name = "Priority")]
        public string Priority { get; set; } = string.Empty;

        [Display(Name = "Client ")]
        public string Client { get; set; } = string.Empty;

    }

    public class InProgressTicketDTO
    {
        [Display(Name = "Ticket ID")]
        public int TicketID { get; set; }

        [Display(Name = "Title            ")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Creation Date")]
        public DateTime CreationDate { get; set; }

        [Display(Name = "Assigned agent")]
        public string AssignedEmployee { get; set; } = string.Empty;

        [Display(Name = "Priority")]
        public string Priority { get; set; } = string.Empty;

        [Display(Name = "Client ")]
        public string Client { get; set; } = string.Empty; 
    }

    public class ClosedTicketDTO
    {
        [Display(Name = "Ticket ID")]
        public int TicketID { get; set; }

        [Display(Name = "Title            ")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Closure Date")]
        public DateTime ClosureDate { get; set; } = DateTime.MinValue;

        [Display(Name = "Resolution Time")]
        public double? ResolutionTime { get; set; }

        [Display(Name = "Assigned agent")]
        public string AssignedAgent { get; set; } = string.Empty;
    }


    public class ReopenedTicketDTO
    {
        public int TicketID { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime DateReopened { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string AssignedEmployee { get; set; } = string.Empty;
    }

    public class BreachedTicketDTO
    {
        public int TicketID { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime BreachedDate { get; set; }
        public TimeSpan TimeBreachedFor { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string AssignedEmployee { get; set; } = string.Empty;
    }

    public class TicketByClientDTO
    {
        public int TicketID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string AssignedAgent { get; set; } = string.Empty;
        public string ClientName { get; set; } = string.Empty;
    }

    public class AgentPerformanceDTO
    {
        public string AgentName { get; set; } = string.Empty;
        public List<TicketDetailsDTO>? Tickets { get; set; }
        public int TicketsResolved { get; set; }
        public double AverageResolutionTime { get; set; }
    }

    public class TicketDetailsDTO
    {
        [Display(Name = "Ticket ID")]
        public int TicketID { get; set; }

        [Display(Name = "Title          ")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Priority")]
        public string Priority { get; set; } = string.Empty;

        [Display(Name = "Date Created")]
        public DateTime DateCreated { get; set; }

        [Display(Name = "Assigned Employee")]
        public string AssignedEmployee { get; set; } = string.Empty;

        [Display(Name = "Client   ")]
        public string Client { get; set; } = string.Empty;

        [Display(Name = "Date Resolved")]
        public DateTime? DateResolved { get; set; }

        [Display(Name = "Resolution Time")]
        public TimeSpan? ResolutionTime { get; set; }

        [Display(Name = "Date Reopened")]
        public DateTime? DateReopened { get; set; }

        [Display(Name = "Breached Date")]
        public DateTime? BreachedDate { get; set; }

        [Display(Name = "Time Breached For")]
        public TimeSpan? TimeBreachedFor { get; set; }
    }

    public class TicketEscalationDTO
    {
        [Display(Name = "Escalation ID")]
        public int EscalationID { get; set; }

        [Display(Name = "Ticket ID")]
        public int TicketID { get; set; }

        [Display(Name = "Previous Employee")]
        public string PreviousEmployee { get; set; } = string.Empty;

        [Display(Name = "New Employee")]
        public string NewEmployee { get; set; } = string.Empty;

        [Display(Name = "Reason For Escalation")]
        public string ReasonForEscalation { get; set; } = string.Empty;

        [Display(Name = "Date of Escalation")]
        public DateTime DateOfEscalation { get; set; } = DateTime.UtcNow;
    }


    public class TicketStatusSummaryDTO
    {

        public string Status { get; set; } = string.Empty;
        public List<TicketDetailsDTO>? Tickets { get; set; }
    }

    public class TicketByDateRangeDTO
    {
        public int TicketID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }
        public string AssignedAgent { get; set; } = string.Empty;
    }

    public class MonthlyTicketTrendDTO
    {
        public string Month { get; set; } = string.Empty;
        public int Created { get; set; }
        public int Resolved { get; set; }
        public int Pending { get; set; }
    }

    public class ClientSatisfactionDTO
    {
        [Display(Name = "Ticket ID")]
        public int TicketID { get; set; }

        [Display(Name = "Client Name")]
        public string ClientName { get; set; } = string.Empty;

        [Display(Name = "Resolved by")]
        public string ResolvedBy { get; set; } = string.Empty;

        [Display(Name = "Resolution date")]
        public DateTime? ResolutionDate { get; set; } = DateTime.MinValue;

        [Display(Name = "Client Comments")]
        public string ClientComments { get; set; } = string.Empty;
    }


    public class TicketAgingDTO
    {
        [Display(Name = "Ticket ID")]
        public int TicketID { get; set; }

        [Display(Name = "Title         ")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Creation Date")]
        public DateTime CreationDate { get; set; }

        [Display(Name = "Assigned Employee")]
        public string AssignedEmployee { get; set; } = string.Empty;

        [Display(Name = "Priority")]
        public string Priority { get; set; } = string.Empty;

        [Display(Name = "Status  ")]
        public string CurrentStatus { get; set; } = string.Empty;
        [Display(Name = "Days Open")]
        public int DaysOpen { get; set; }
    }
    public class TicketSummaryDTO
    {
        public List<PrioritySummaryDTO>? PrioritySummary { get; set; }
        public List<TagSummaryDTO>? TagSummary { get; set; }
        public List<StatusSummaryDTO>? StatusSummary { get; set; }
    }


    public class PrioritySummaryDTO
    {
        public string Month { get; set; } = string.Empty;
        public int Low { get; set; }
        public int Medium { get; set; }
        public int High { get; set; }
        public int Total => Low + Medium + High;
    }

    public class TagSummaryDTO
    {
        public string Month { get; set; } = string.Empty;
        public int Infrastructure { get; set; }
        public int Connectivity { get; set; }
        public int GeneralSupport { get; set; }
        public int Total => Infrastructure + Connectivity + GeneralSupport;
    }

    public class StatusSummaryDTO
    {
        public string Month { get; set; } = string.Empty;
        public int Open { get; set; }
        public int Closed { get; set; }
        public int InProgress { get; set; }
        public int Reopened { get; set; }
        public int Breached { get; set; }
        public int Total => Open + Closed + InProgress + Reopened + Breached;
    }

}
