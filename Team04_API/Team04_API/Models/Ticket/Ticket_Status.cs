using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Ticket
{
    public class Ticket_Status
    {
        [Key]
        [Required]
        public int Ticket_Status_ID { get; set; }
        [Required]
        [MaxLength(50)]
        public string? Status_Name { get; set; }
        [Required]
        [MaxLength(255)]
        public string? Status_Description { get; set; }

        //public virtual List<Ticket>? Ticket { get; set; }
    }
}
