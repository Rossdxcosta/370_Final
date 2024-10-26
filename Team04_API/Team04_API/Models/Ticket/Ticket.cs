using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models.Chatbot;
using Team04_API.Models.Users;
using Team04_API.Models.Ticket.To_do_List;
using Team04_API.Models.Feedback;

namespace Team04_API.Models.Ticket
{
    public class Ticket
    {
        [Key]
        [Required]
        public int Ticket_ID { get; set; }

        [Required]
        [ForeignKey(nameof(Client))]
        public Guid Client_ID { get; set; }

        [ForeignKey(nameof(Employee))]
        public Guid? Assigned_Employee_ID { get; set; }

        [ForeignKey(nameof(Chatbot_Log.Chatbot_Log_ID))]
        public int? Chatbot_Log_ID { get; set; }

        [Required]
        [ForeignKey(nameof(Tag.Tag_ID))]
        public int Tag_ID { get; set; }

        [Required]
        [ForeignKey(nameof(Priority.Priority_ID))]
        public int Priority_ID { get; set; }

        [ForeignKey(nameof(Anomaly.Anomaly_ID))]
        public int? Anomaly_ID { get; set; }

        [Required]
        [ForeignKey(nameof(Ticket_Status.Ticket_Status_ID))]
        public int Ticket_Status_ID { get; set; }

        [Required]
        [MinLength(5)]
        public string? Ticket_Description { get; set; }

        [Required]
        public DateTime Ticket_Date_Created { get; set; }

        public DateTime? Ticket_Date_Resolved { get; set; }

        [Required]
        public bool? Ticket_Subscription { get; set; }
        public bool isOpen { get; set; }

        public int? Client_Feedback_ID { get; set; }

        
        // Navigation properties
        public virtual Priority? Priority { get; set; }
        public virtual Ticket_Status? Ticket_Status { get; set; }
        public virtual TicketEscalation? Ticket_Escalation { get; set; }
        public virtual List<Ticket_Updates>? Ticket_Updates { get; set; }
        public virtual Tag? Tag { get; set; }
        public virtual User? Employee { get; set; }
        public virtual User? Client { get; set; }
        public virtual Chatbot_Log? Chatbot_Log { get; set; }
        public virtual ICollection<TicketGroup>? TicketGroups { get; set; } = new List<TicketGroup>();
        public virtual Anomaly? Anomaly { get; set; }
        public virtual Client_Feedback? ClientFeedback { get; set; }

        // Navigation properties for to-do list and items
        public virtual ICollection<To_do_List.To_do_List>? ToDoLists { get; set; }
        public virtual ICollection<To_do_List.To_do_List_Items>? ToDoListItems { get; set; }
    }
}
