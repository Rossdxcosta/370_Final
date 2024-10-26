using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Team04_API.Data;
using System.Linq;
using Team04_API.Models.DTOs;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Security.Claims;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportingController : ControllerBase
    {
        private readonly dataDbContext _context;

        public ReportingController(dataDbContext context)
        {
            _context = context;
        }

        public class ClosedTickets
        {
            public DateTime Date { get; set; }
            public int Count { get; set; }
        }

        public class TicketStatusCount
        {
            public string Status { get; set; }
            public int Count { get; set; }
        }


        //================================================= Statistics ===================================================
        [HttpGet("open-tickets")]
        public async Task<IActionResult> GetOpenTickets(DateTime? startDate, DateTime? endDate)
        {
            var start = startDate?.ToUniversalTime() ?? DateTime.MinValue.ToUniversalTime();
            var end = endDate?.ToUniversalTime() ?? DateTime.MaxValue.ToUniversalTime();
            var openTickets = await _context.getopentickets(startDate, endDate);
            return Ok(openTickets.FirstOrDefault()?.Count ?? 0);
        }


        [HttpGet("closed-tickets")]
        public async Task<IActionResult> GetClosedTickets(DateTime? startDate, DateTime? endDate)
        {
            var start = startDate?.ToUniversalTime() ?? DateTime.MinValue.ToUniversalTime();
            var end = endDate?.ToUniversalTime() ?? DateTime.MaxValue.ToUniversalTime();
            var closedTickets = await _context.getclosedtickets(startDate, endDate);
            return Ok(closedTickets.FirstOrDefault()?.Count ?? 0);
        }

        [HttpGet("breached-tickets")]
        public async Task<IActionResult> GetBreachedTickets(DateTime? startDate, DateTime? endDate)
        {
            var start = startDate?.ToUniversalTime() ?? DateTime.MinValue.ToUniversalTime();
            var end = endDate?.ToUniversalTime() ?? DateTime.MaxValue.ToUniversalTime();
            var breachedTickets = await _context.getbreachedtickets(startDate, endDate);
            return Ok(breachedTickets.FirstOrDefault()?.Count ?? 0);
        }

        [HttpGet("low-priority-tickets")]
        public async Task<IActionResult> GetLowPriorityTickets(DateTime? startDate, DateTime? endDate)
        {
            var start = startDate?.ToUniversalTime() ?? DateTime.MinValue.ToUniversalTime();
            var end = endDate?.ToUniversalTime() ?? DateTime.MaxValue.ToUniversalTime();
            var lowPriorityTickets = await _context.getlowprioritytickets(startDate, endDate);
            return Ok(lowPriorityTickets.FirstOrDefault()?.Count ?? 0);
        }

        [HttpGet("tickets-reopened")]
        public async Task<IActionResult> GetTicketsReopened(DateTime? startDate, DateTime? endDate)
        {
            var start = startDate?.ToUniversalTime() ?? DateTime.MinValue.ToUniversalTime();
            var end = endDate?.ToUniversalTime() ?? DateTime.MaxValue.ToUniversalTime();
            Console.WriteLine($"Received startDate: {start}, endDate: {end}");
            var ticketsReopened = await _context.get_tickets_reopened(startDate, endDate);
            return Ok(ticketsReopened.FirstOrDefault()?.Count ?? 0);
        }

        [HttpGet("escalated-tickets-last-week")]
        public async Task<IActionResult> getEsclatedTicketsLastWeek()
        {
            var avgresolutionTimeLastWeek = await _context.getEscalatedTicketsLastWeek();
            return Ok(avgresolutionTimeLastWeek);
        }

        [HttpGet("total-tickets-created")]
        public async Task<IActionResult> GetTotalTicketsCreated(DateTime? startDate, DateTime? endDate)
        {
            var start = startDate?.ToUniversalTime() ?? DateTime.MinValue.ToUniversalTime();
            var end = endDate?.ToUniversalTime() ?? DateTime.MaxValue.ToUniversalTime();
            var totalTicketsCreated = await _context.get_total_tickets_created(startDate, endDate);
            return Ok(totalTicketsCreated.FirstOrDefault()?.Count ?? 0);
        }

        [HttpGet("average-resolution-time-last-week")]
        public async Task<IActionResult> Get_Avg_Resolution_Time_Last_Week()
        {
            var avgresolutionTimeLastWeek = await _context.getAvgResolutionTimeLastWeek();
            return Ok(avgresolutionTimeLastWeek);
        }
        //================================================= Statistics ===================================================


        //================================================= Reporting ====================================================
        // Simple List Reports

        [HttpGet("OpenTickets")]
        public async Task<ActionResult<IEnumerable<OpenTicketDTO>>> GetOpenTicketsReport()
        {
            var openTickets = await _context.Ticket
                .Where(t => t.Ticket_Status_ID == 1) // Assuming 1 represents "Open" status
                .Select(t => new OpenTicketDTO
                {
                    TicketID = t.Ticket_ID,
                    Title = t.Ticket_Description,
                    CreationDate = t.Ticket_Date_Created,
                    AssignedAgent = _context.User.Where(u => u.User_ID == t.Assigned_Employee_ID).Select(u => u.User_Name).FirstOrDefault(),
                    Priority = _context.Priority.Where(p => p.Priority_ID == t.Priority_ID).Select(p => p.Priority_Name).FirstOrDefault()
                }).ToListAsync();

            return Ok(openTickets);
        }

        [HttpGet("ClosedTickets")]
        public async Task<ActionResult<IEnumerable<ClosedTicketDTO>>> GetClosedTicketsReport()
        {
            try
            {
                var closedTickets = await _context.Ticket
                    .Where(t => t.Ticket_Status_ID == 3) // Assuming 3 represents "Closed" status
                    .Select(t => new ClosedTicketDTO
                    {
                        TicketID = t.Ticket_ID,
                        Title = t.Ticket_Description,
                        ClosureDate = t.Ticket_Date_Resolved.HasValue ? t.Ticket_Date_Resolved.Value : DateTime.MinValue, // Provide a default value if null
                        ResolutionTime = t.Ticket_Date_Resolved.HasValue ?
                                         (t.Ticket_Date_Resolved.Value - t.Ticket_Date_Created).TotalMinutes : (double?)null, // Handle nullable TimeSpan
                        AssignedAgent = _context.User
                                        .Where(u => u.User_ID == t.Assigned_Employee_ID)
                                        .Select(u => u.User_Name)
                                        .FirstOrDefault() ?? "N/A" // Handle null reference
                    }).ToListAsync();

                return Ok(closedTickets);
            }
            catch (Exception ex)
            {
                // Log the exception details for further analysis
                return StatusCode(500, ex.Message);
            }
        }



        [HttpGet("TicketsByClient")]
        public async Task<ActionResult<IEnumerable<TicketByClientDTO>>> GetTicketsByClientReport()
        {
            var ticketsByClient = await _context.Ticket
                .Select(t => new TicketByClientDTO
                {
                    TicketID = t.Ticket_ID,
                    Title = t.Ticket_Description,
                    Status = _context.Ticket_Status.Where(ts => ts.Ticket_Status_ID == t.Ticket_Status_ID).Select(ts => ts.Status_Name).FirstOrDefault(),
                    AssignedAgent = _context.User.Where(u => u.User_ID == t.Assigned_Employee_ID).Select(u => u.User_Name).FirstOrDefault(),
                    ClientName = _context.User.Where(u => u.User_ID == t.Client_ID).Select(u => u.User_Name).FirstOrDefault()
                })
                .OrderBy(t => t.ClientName) // Sorting by client name
                .ToListAsync();

            return Ok(ticketsByClient);
        }

        [HttpGet("TicketEscalation")]
        public async Task<ActionResult<IEnumerable<TicketEscalationDTO>>> GetTicketEscalationReport()
        {
            var ticketEscalations = await _context.TicketEscalation
                .Select(te => new TicketEscalationDTO
                {
                    EscalationID = te.Escalation_ID,
                    TicketID = te.Ticket_ID,
                    PreviousEmployee = _context.User.Where(u => u.User_ID == te.Previous_Employee_ID).Select(u => u.User_Name).FirstOrDefault(),
                    NewEmployee = _context.User.Where(u => u.User_ID == te.New_Employee_ID).Select(u => u.User_Name).FirstOrDefault(),
                    ReasonForEscalation = te.ReasonForEscalation,
                    DateOfEscalation = te.Date_of_Escalation
                })
                .ToListAsync();

            return Ok(ticketEscalations);
        }


        // Transactional Reports

        [HttpGet("AgentPerformance")]
        public async Task<ActionResult<IEnumerable<AgentPerformanceDTO>>> GetAgentPerformanceReport()
        {
            var agentPerformance = await _context.Ticket
                .Where(t => t.Ticket_Date_Resolved.HasValue) // Ensuring we only get resolved tickets
                .GroupBy(t => t.Assigned_Employee_ID)
                .Select(g => new AgentPerformanceDTO
                {
                    AgentName = _context.User.Where(u => u.User_ID == g.Key).Select(u => u.User_Name).FirstOrDefault(),
                    Tickets = g.Select(t => new TicketDetailsDTO
                    {
                        TicketID = t.Ticket_ID,
                        Title = t.Ticket_Description,
                        ResolutionTime = t.Ticket_Date_Resolved.Value - t.Ticket_Date_Created
                    }).ToList(),
                    TicketsResolved = g.Count(t => t.Ticket_Status_ID == 3), // Assuming 3 represents "Closed" status
                    AverageResolutionTime = g.Average(t => (t.Ticket_Date_Resolved.Value - t.Ticket_Date_Created).TotalMinutes)
                }).ToListAsync();

            return Ok(agentPerformance);
        }


        [HttpGet("TicketStatusSummary")]
        public async Task<ActionResult<IEnumerable<TicketStatusSummaryDTO>>> GetTicketStatusSummaryReport()
        {
            var ticketStatusSummary = await _context.Ticket
                .GroupBy(t => t.Ticket_Status_ID)
                .Select(g => new TicketStatusSummaryDTO
                {
                    Status = _context.Ticket_Status.Where(ts => ts.Ticket_Status_ID == g.Key).Select(ts => ts.Status_Name).FirstOrDefault(),
                    Tickets = g.Select(t => new TicketDetailsDTO
                    {
                        TicketID = t.Ticket_ID,
                        Title = t.Ticket_Description,
                        Priority = _context.Priority.Where(p => p.Priority_ID == t.Priority_ID).Select(p => p.Priority_Name).FirstOrDefault(),
                        DateCreated = t.Ticket_Date_Created,
                        AssignedEmployee = _context.User.Where(u => u.User_ID == t.Assigned_Employee_ID).Select(u => u.User_Name).FirstOrDefault(),
                        Client = _context.User.Where(u => u.User_ID == t.Client_ID).Select(u => u.User_Name).FirstOrDefault(),
                        DateResolved = t.Ticket_Date_Resolved,
                        ResolutionTime = t.Ticket_Date_Resolved.HasValue ? (TimeSpan?)(t.Ticket_Date_Resolved.Value - t.Ticket_Date_Created) : null,
                        DateReopened = _context.Ticket_Updates
                            .Where(tu => tu.Ticket_ID == t.Ticket_ID && tu.Ticket_Status_New_ID == 4)
                            .OrderByDescending(tu => tu.DateOfChange)
                            .Select(tu => tu.DateOfChange)
                            .FirstOrDefault(),
                        BreachedDate = _context.Ticket_Updates
                            .Where(tu => tu.Ticket_ID == t.Ticket_ID && tu.Ticket_Status_New_ID == 5)
                            .OrderByDescending(tu => tu.DateOfChange)
                            .Select(tu => tu.DateOfChange)
                            .FirstOrDefault(),
                        TimeBreachedFor = _context.Ticket_Updates
                            .Where(tu => tu.Ticket_ID == t.Ticket_ID && tu.Ticket_Status_New_ID == 5)
                            .OrderByDescending(tu => tu.DateOfChange)
                            .Select(tu => (TimeSpan?)(tu.DateOfChange - t.Ticket_Date_Created))
                            .FirstOrDefault()
                    }).ToList()
                }).ToListAsync();

            return Ok(ticketStatusSummary);
        }




        // Report with Adjustable Criteria

        [HttpGet("TicketsByDateRange")]
        public async Task<ActionResult<IEnumerable<TicketByDateRangeDTO>>> GetTicketsByDateRangeReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var ticketsByDateRange = await _context.Ticket
                .Where(t => t.Ticket_Date_Created >= startDate && t.Ticket_Date_Created <= endDate)
                .Select(t => new TicketByDateRangeDTO
                {
                    TicketID = t.Ticket_ID,
                    Title = t.Ticket_Description,
                    Status = _context.Ticket_Status.Where(ts => ts.Ticket_Status_ID == t.Ticket_Status_ID).Select(ts => ts.Status_Name).FirstOrDefault(),
                    CreationDate = t.Ticket_Date_Created,
                    AssignedAgent = _context.User.Where(u => u.User_ID == t.Assigned_Employee_ID).Select(u => u.User_Name).FirstOrDefault()
                }).ToListAsync();

            return Ok(ticketsByDateRange);
        }

        // Management Report Using a Graph

        [HttpGet("MonthlyTicketTrend")]
        public async Task<ActionResult<IEnumerable<MonthlyTicketTrendDTO>>> GetMonthlyTicketTrendReport()
        {
            var monthlyTicketTrend = await _context.Ticket
                .GroupBy(t => new { t.Ticket_Date_Created.Year, t.Ticket_Date_Created.Month })
                .Select(g => new MonthlyTicketTrendDTO
                {
                    Month = g.Key.Year + "-" + g.Key.Month,
                    Created = g.Count(t => t.Ticket_Status_ID == 1), // Assuming 1 represents "Open" status
                    Resolved = g.Count(t => t.Ticket_Status_ID == 3), // Assuming 3 represents "Closed" status
                    Pending = g.Count(t => t.Ticket_Status_ID == 2 || t.Ticket_Status_ID == 4 || t.Ticket_Status_ID == 5) // Assuming 2 is "In Progress", 4 is "Reopened", 5 is "Breached"
                }).ToListAsync();

            return Ok(monthlyTicketTrend);
        }

        [HttpGet("ClientSatisfaction")]
        public async Task<ActionResult<IEnumerable<ClientSatisfactionDTO>>> GetClientSatisfactionReport()
        {
            var clientSatisfaction = await _context.Client_Feedback
                .Include(cf => cf.User)
                .Include(cf => cf.Ticket)
                    .ThenInclude(t => t.Employee)
                .Select(cf => new ClientSatisfactionDTO
                {
                    TicketID = cf.Ticket_ID ?? 0,
                    ClientName = cf.User != null ? $"{cf.User.User_Name} {cf.User.User_Surname}" : "Unknown",
                    ResolvedBy = cf.Ticket != null && cf.Ticket.Employee != null
                        ? $"{cf.Ticket.Employee.User_Name} {cf.Ticket.Employee.User_Surname}"
                        : "N/A",
                    ResolutionDate = cf.Ticket != null ? cf.Ticket.Ticket_Date_Resolved : null,
                    ClientComments = cf.Client_Feedback_Detail ?? string.Empty
                })
                .ToListAsync();

            return Ok(clientSatisfaction);
        }


        [HttpGet("TicketAging")]
        public async Task<ActionResult<IEnumerable<TicketAgingDTO>>> GetTicketAgingReport()
        {
            var tickets = await _context.Ticket
                .Where(t => t.Ticket_Status_ID == 1 || t.Ticket_Status_ID == 2) // Assuming 1 represents "Open" status
                .Select(t => new
                {
                    t.Ticket_ID,
                    t.Ticket_Description,
                    t.Ticket_Date_Created,
                    AssignedEmployee = _context.User.Where(u => u.User_ID == t.Assigned_Employee_ID).Select(u => u.User_Name).FirstOrDefault(),
                    Priority = _context.Priority.Where(p => p.Priority_ID == t.Priority_ID).Select(p => p.Priority_Name).FirstOrDefault(),
                    CurrentStatus = _context.Ticket_Status.Where(ts => ts.Ticket_Status_ID == t.Ticket_Status_ID).Select(ts => ts.Status_Name).FirstOrDefault()
                }).ToListAsync();

            var ticketAging = tickets.Select(t => new TicketAgingDTO
            {
                TicketID = t.Ticket_ID,
                Title = t.Ticket_Description,
                CreationDate = t.Ticket_Date_Created,
                AssignedEmployee = t.AssignedEmployee,
                Priority = t.Priority,
                CurrentStatus = t.CurrentStatus,
                DaysOpen = (DateTime.UtcNow - t.Ticket_Date_Created).Days
            }).ToList();

            return Ok(ticketAging);
        }

        [HttpGet("TicketsSummary")]
        public async Task<ActionResult<TicketSummaryDTO>> GetTicketsSummaryReport()
        {
            var oneYearAgo = DateTime.UtcNow.AddYears(-1); // Use UTC time

            // Priorities Summary
            var priorityData = await _context.Ticket
                .Where(t => t.Ticket_Date_Created >= oneYearAgo)
                .GroupBy(t => new {
                    Month = new DateTime(t.Ticket_Date_Created.Year, t.Ticket_Date_Created.Month, 1, 0, 0, 0, DateTimeKind.Utc),
                    PriorityName = t.Priority.Priority_Name
                })
                .Select(g => new {
                    g.Key.Month,
                    g.Key.PriorityName,
                    Count = g.Count()
                })
                .ToListAsync();

            var prioritySummary = priorityData
                .GroupBy(p => p.Month)
                .Select(group => new PrioritySummaryDTO
                {
                    Month = group.Key.ToString("yyyy-MM"),
                    Low = group.Where(x => x.PriorityName == "Low").Sum(x => x.Count),
                    Medium = group.Where(x => x.PriorityName == "Medium").Sum(x => x.Count),
                    High = group.Where(x => x.PriorityName == "High").Sum(x => x.Count)
                })
                .ToList();

            // Tags Summary
            var tagData = await _context.Ticket
                .Where(t => t.Ticket_Date_Created >= oneYearAgo)
                .GroupBy(t => new {
                    Month = new DateTime(t.Ticket_Date_Created.Year, t.Ticket_Date_Created.Month, 1, 0, 0, 0, DateTimeKind.Utc),
                    TagName = t.Tag.Tag_Name
                })
                .Select(g => new {
                    g.Key.Month,
                    g.Key.TagName,
                    Count = g.Count()
                })
                .ToListAsync();

            var tagSummary = tagData
                .GroupBy(t => t.Month)
                .Select(group => new TagSummaryDTO
                {
                    Month = group.Key.ToString("yyyy-MM"),
                    Infrastructure = group.Where(x => x.TagName == "Infrastructure").Sum(x => x.Count),
                    Connectivity = group.Where(x => x.TagName == "Connectivity").Sum(x => x.Count),
                    GeneralSupport = group.Where(x => x.TagName == "General Support").Sum(x => x.Count)
                })
                .ToList();

            // Statuses Summary
            var statusData = await _context.Ticket
                .Where(t => t.Ticket_Date_Created >= oneYearAgo)
                .GroupBy(t => new {
                    Month = new DateTime(t.Ticket_Date_Created.Year, t.Ticket_Date_Created.Month, 1, 0, 0, 0, DateTimeKind.Utc),
                    StatusName = t.Ticket_Status.Status_Name
                })
                .Select(g => new {
                    g.Key.Month,
                    g.Key.StatusName,
                    Count = g.Count()
                })
                .ToListAsync();

            var statusSummary = statusData
                .GroupBy(s => s.Month)
                .Select(group => new StatusSummaryDTO
                {
                    Month = group.Key.ToString("yyyy-MM"),
                    Open = group.Where(x => x.StatusName == "Open").Sum(x => x.Count),
                    Closed = group.Where(x => x.StatusName == "Closed").Sum(x => x.Count),
                    InProgress = group.Where(x => x.StatusName == "In Progress").Sum(x => x.Count),
                    Reopened = group.Where(x => x.StatusName == "Reopened").Sum(x => x.Count),
                    Breached = group.Where(x => x.StatusName == "Breached").Sum(x => x.Count)
                })
                .ToList();

            return Ok(new TicketSummaryDTO
            {
                PrioritySummary = prioritySummary,
                TagSummary = tagSummary,
                StatusSummary = statusSummary
            });
        }


        //================================================= Reporting ====================================================


        //================================================= Charts =======================================================
        [HttpGet("closed-tickets-past-week")]
        public async Task<IActionResult> GetClosedTicketsPastWeek()
        {
            var closedTickets = await _context.GetClosedTicketsPastWeek();
            return Ok(closedTickets);
        }

        [HttpGet("ticket-status-counts")]
        public async Task<IActionResult> GetTicketStatusCounts()
        {
            var ticketStatusCounts = await _context.GetTicketStatusCounts();
            return Ok(ticketStatusCounts);
        }

        [HttpGet("tickets-created-resolved-over-time")]
        public async Task<IActionResult> GetTicketsCreatedResolvedOverTime()
        {
            var data = await _context.getTicketsCreatedResolvedOverTime();
            return Ok(data);
        }

        [HttpGet("average-resolution-time")]
        public async Task<IActionResult> GetAverageResolutionTime()
        {
            var data = await _context.getAverageResolutionTime();
            return Ok(data);
        }

        [HttpGet("tickets-by-priority")]
        public async Task<IActionResult> GetTicketsByPriority()
        {
            var data = await _context.getTicketsByPriority();
            return Ok(data);
        }

        [HttpGet("tickets-by-tag")]
        public async Task<IActionResult> GetTicketsByTag()
        {
            var data = await _context.getTicketsByTag();
            return Ok(data);
        }

        [HttpGet("tickets-assigned-to-employees")]
        public async Task<IActionResult> GetTicketsAssignedToEmployees()
        {
            var data = await _context.getticketsassignedtoemployees();
            return Ok(data);
        }

        [HttpGet("tickets-by-client")]
        public async Task<IActionResult> GetTicketsByClient()
        {
            var data = await _context.getTicketsByClient();
            return Ok(data);
        }

        [HttpGet("tickets-created-over-time")]
        public async Task<IActionResult> GetTicketsCreatedOverTime()
        {
            var data = await _context.getTicketsCreatedOverTime();
            return Ok(data);
        }

        [HttpGet("TestReport")]
        public async Task<IActionResult> TestReport()
        {
            var data = await _context.getAverageResolutionTime();
            return Ok(data);
        }
        //================================================= Charts =======================================================

        //================================================= Employee =====================================================//
        //============= Statistics ===========//
        [HttpGet("employee/open-tickets")]
        public async Task<IActionResult> GetEmployeeOpenTickets()
        {
            var employeeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return Unauthorized("Employee ID not found in token.");
            }

            var openTickets = await _context.Ticket
                .Where(t => t.Assigned_Employee_ID == Guid.Parse(employeeId) && t.Ticket_Status_ID == 1)
                .CountAsync();

            return Ok(openTickets);
        }

        [HttpGet("employee/breached-tickets")]
        public async Task<IActionResult> GetEmployeeBreachedTickets()
        {
            var employeeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return Unauthorized("Employee ID not found in token.");
            }

            var breachedTickets = await _context.Ticket
                .Where(t => t.Assigned_Employee_ID == Guid.Parse(employeeId) && t.Ticket_Status_ID == 5)
                .CountAsync();

            return Ok(breachedTickets);
        }

        [HttpGet("employee/average-resolution-time")]
        public async Task<IActionResult> GetEmployeeAverageResolutionTime()
        {
            var employeeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return Unauthorized("Employee ID not found in token.");
            }

            var averageResolutionTime = await _context.Ticket
                .Where(t => t.Assigned_Employee_ID == Guid.Parse(employeeId) && t.Ticket_Status_ID == 3 && t.Ticket_Date_Resolved.HasValue)
                .Select(t => (t.Ticket_Date_Resolved.Value - t.Ticket_Date_Created).TotalHours)
                .AverageAsync();

            return Ok(averageResolutionTime);
        }

        [HttpGet("employee/priority-tickets")]
        public async Task<IActionResult> GetEmployeePriorityTickets()
        {
            var employeeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return Unauthorized("Employee ID not found in token.");
            }

            var priorityTickets = await _context.Ticket
                .Where(t => t.Assigned_Employee_ID == Guid.Parse(employeeId) &&
                            (t.Ticket_Status_ID == 1 || t.Ticket_Status_ID == 2 || t.Ticket_Status_ID == 4 || t.Ticket_Status_ID == 5))
                .GroupBy(t => t.Priority_ID)
                .Select(g => new { Priority = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(priorityTickets);
        }

        [HttpGet("employee/current-assigned-tickets")]
        public async Task<IActionResult> GetEmployeeCurrentAssignedTickets()
        {
            var employeeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return Unauthorized("Employee ID not found in token.");
            }

            var currentAssignedTickets = await _context.Ticket
                .Where(t => t.Assigned_Employee_ID == Guid.Parse(employeeId) && t.Ticket_Status_ID != 3)
                .CountAsync();

            return Ok(currentAssignedTickets);
        }

        [HttpGet("employee/tickets-assigned-vs-closed")]
        public async Task<IActionResult> GetEmployeeTicketsAssignedVsClosed()
        {
            var employeeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return Unauthorized("Employee ID not found in token.");
            }

            var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);

            var ticketsAssigned = await _context.Ticket
                .Where(t => t.Assigned_Employee_ID == Guid.Parse(employeeId) && t.Ticket_Date_Created >= oneMonthAgo)
                .GroupBy(t => t.Ticket_Date_Created.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToListAsync();

            var ticketsClosed = await _context.Ticket
                .Where(t => t.Assigned_Employee_ID == Guid.Parse(employeeId) && t.Ticket_Status_ID == 3 && t.Ticket_Date_Resolved >= oneMonthAgo)
                .GroupBy(t => t.Ticket_Date_Resolved.Value.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToListAsync();

            var result = new
            {
                Assigned = ticketsAssigned,
                Closed = ticketsClosed
            };

            return Ok(result);
        }

        [HttpGet("employee/ticket-status-distribution")]
        public async Task<IActionResult> GetEmployeeTicketStatusDistribution()
        {
            var employeeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return Unauthorized("Employee ID not found in token.");
            }

            var statusDistribution = await _context.Ticket
                .Where(t => t.Assigned_Employee_ID == Guid.Parse(employeeId))
                .GroupBy(t => t.Ticket_Status_ID)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(statusDistribution);
        }

        [HttpGet("employee/average-resolution-time-trend")]
        public async Task<IActionResult> GetEmployeeAverageResolutionTimeTrend()
        {
            var employeeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return Unauthorized("Employee ID not found in token.");
            }

            // Set the current date to September 28, 2024 for testing
            var currentDate = new DateTime(2024, 9, 28);
            var oneMonthAgo = currentDate.AddMonths(-1).Date;

            var resolutionTimeTrend = await _context.Ticket
                .Where(t => t.Assigned_Employee_ID == Guid.Parse(employeeId)
                            && t.Ticket_Status_ID == 3
                            && t.Ticket_Date_Resolved >= oneMonthAgo
                            && t.Ticket_Date_Resolved <= currentDate)
                .GroupBy(t => t.Ticket_Date_Resolved.Value.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    AverageResolutionTime = g.Average(t => (t.Ticket_Date_Resolved.Value - t.Ticket_Date_Created).TotalHours)
                })
                .OrderBy(r => r.Date)
                .ToListAsync();

            if (!resolutionTimeTrend.Any())
            {
                return Ok(new { Message = "No resolution time data available for the past month, but there are closed tickets outside this timeframe." });
            }

            return Ok(resolutionTimeTrend);
        }


        [HttpGet("employee/closed-tickets-past-week")]
        public async Task<IActionResult> GetEmployeeClosedTicketsPastWeek()
        {
            var employeeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return Unauthorized("Employee ID not found in token.");
            }

            // Set the current date to September 28, 2024 for testing
            var currentDate = new DateTime(2024, 9, 28);
            var oneWeekAgo = currentDate.AddDays(-7).Date;

            var closedTickets = await _context.Ticket
                .Where(t => t.Assigned_Employee_ID == Guid.Parse(employeeId)
                            && t.Ticket_Status_ID == 3
                            && t.Ticket_Date_Resolved >= oneWeekAgo
                            && t.Ticket_Date_Resolved <= currentDate)
                .GroupBy(t => t.Ticket_Date_Resolved.Value.DayOfWeek)
                .Select(g => new { DayOfWeek = (int)g.Key, Count = g.Count() })
                .OrderBy(r => r.DayOfWeek)
                .ToListAsync();

            if (!closedTickets.Any())
            {
                return Ok(new { Message = "No closed tickets in the past week, but there are closed tickets outside this timeframe." });
            }

            return Ok(closedTickets);
        }

        [HttpGet("employee/tickets-by-priority")]
        public async Task<IActionResult> GetEmployeeTicketsByPriority()
        {
            var employeeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(employeeId))
            {
                return Unauthorized("Employee ID not found in token.");
            }

            var ticketsByPriority = await _context.Ticket
                .Where(t => t.Assigned_Employee_ID == Guid.Parse(employeeId))
                .GroupBy(t => t.Priority_ID)
                .Select(g => new { Priority = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(ticketsByPriority);
        }
        //============ Graphs ===========//
        //===================================================== Employee ===================================================//
    }
}
