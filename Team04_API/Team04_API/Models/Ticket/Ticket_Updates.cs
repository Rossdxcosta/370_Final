using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Team04_API.Models.FAQ;
using Team04_API.Models.Users;

namespace Team04_API.Models.Ticket
{
    public class Ticket_Updates
    {
        [Key]
        public int Ticket_Update_ID { get; set; }

        //[ForeignKey(nameof(ticket))]
        public int Ticket_ID { get; set; }

        //[ForeignKey(nameof(ticket_status))]
        public int? Ticket_Status_Old_ID { get; set; }

        //[ForeignKey(nameof(ticket_status))]
        public int? Ticket_Status_New_ID { get; set; }

        public DateTime DateOfChange { get; set; }

        public bool hasBeenDismissed { get; set; }


        // Virtual 
        public virtual Ticket? ticket { get; set; }

        public virtual Ticket_Status? ticket_status { get; set; }
        //public virtual Ticket_Status ticket_status_new { get; set; }
    }
}
