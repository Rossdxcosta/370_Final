using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.DTOs
{
    public class ToDoListDTO
    {
        [Required]
        public int Ticket_ID { get; set; }

        [Required]
        [MaxLength(100)]
        public string? Note_Description { get; set; }
    }
}

