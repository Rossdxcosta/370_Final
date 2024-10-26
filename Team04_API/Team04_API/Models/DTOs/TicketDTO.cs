using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Team04_API.Models.Chatbot;
using Team04_API.Models.Ticket.To_do_List;
using Team04_API.Models.Ticket;
using Team04_API.Models.Users;
using System.Text.Json.Serialization;

namespace Team04_API.Models.DTOs
{
    public class TicketDTO
    {
        [Key]
        [Required]
        public int Ticket_ID { get; set; }

        [Required]
        public Guid Client_ID { get; set; }

        [Required]
        public int Tag_ID { get; set; }

        [Required]
        public int Priority_ID { get; set; }

        [Required]
        public int Ticket_Status_ID { get; set; }

        public string? Ticket_Status_Name { get; set; }

        [Required]
        [MinLength(5)]
        public string Ticket_Description { get; set; }

        [Required]
        public DateTime Ticket_Date_Created { get; set; }

        [Required]
        public bool? Ticket_Subscription { get; set; }
    }
}

