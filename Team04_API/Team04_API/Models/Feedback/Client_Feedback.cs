using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models.Chatbot;
using Team04_API.Models.Ticket;
using Team04_API.Models.Users;

namespace Team04_API.Models.Feedback
{
    public class Client_Feedback
    {
        [Key]
        public int Client_Feedback_ID { get; set; }

        [Required]
        public Guid Client_ID { get; set; }

        [Required, MinLength(25), MaxLength(255)]
        public string? Client_Feedback_Detail { get; set; }

        [ForeignKey(nameof(Chatbot_Log.Chatbot_Log_ID))]
        public int? Chatbot_Log_ID { get; set; } 

        [Required]
        public DateTime Feedback_Date_Created { get; set; }

        public int? Ticket_ID { get; set; }

        // VIRTUAL ITEMS
        public virtual Chatbot_Log? Chatbot_Log { get; set; }
        public virtual Ticket.Ticket? Ticket { get; set; }
        public virtual User User { get; set; }
    }
}
