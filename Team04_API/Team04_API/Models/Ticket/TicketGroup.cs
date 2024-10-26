using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Team04_API.Models.Ticket
{
    public class TicketGroup
    {
        [Key]
        public int TicketGroup_ID { get; set; }

        [Required]
        [MinLength(3)]
        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime DateCreated { get; set; }

        public virtual ICollection<Ticket>? Tickets { get; set; } = new List<Ticket>();
    }
}
