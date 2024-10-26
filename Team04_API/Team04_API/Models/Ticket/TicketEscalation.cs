using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Team04_API.Models.Users;
using Team04_API.Models.Users.Role;

namespace Team04_API.Models.Ticket
{
    public class TicketEscalation
    {
        [Key]
        public int Escalation_ID { get; set; }

        [ForeignKey(nameof(Ticket))]
        public int Ticket_ID { get; set; }

        [ForeignKey(nameof(PreviousEmployee))]
        public Guid? Previous_Employee_ID { get; set; }

        [ForeignKey(nameof(NewEmployee))]
        public Guid? New_Employee_ID { get; set; }

        [Required]
        public string ReasonForEscalation { get; set; }

        public Boolean HasBeenEscalated { get; set; }

       [Required]
        public DateTime Date_of_Escalation { get; set; }

        // Navigation properties
        public virtual User? PreviousEmployee { get; set; }
        public virtual User? NewEmployee { get; set; }
        public virtual Ticket? Ticket { get; set; }
       
    }
}
