using System;

namespace Team04_API.Models.DTOs
{
    public class EscalationRequestDto
    {
        public int EscalationId { get; set; }
        public int TicketId { get; set; }
        public string? PreviousEmployeeName { get; set; }
        public string? PreviousEmployeeSurname { get; set; }
        public string? ReasonForEscalation { get; set; }
        public DateTime DateOfEscalation { get; set; }
        public string? PriorityName { get; set; }
        public string? TagName { get; set; }
        public string? TicketDescription { get; set; }
        public int? DepartmentId { get; set; } 
    }
}
