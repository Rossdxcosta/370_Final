using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Ticket
{
    public class Priority
    {
        [Key]
        [Required]
        public int Priority_ID { get; set; }

        [Required]
        [MaxLength(50)]
        public string? Priority_Name { get; set; }

        [Required]
        [MaxLength(255)]
        public string? Priority_Description { get; set; }

        [Required]
        public TimeSpan BreachTime { get; set; } = TimeSpan.FromDays(365); // Default value
    }
}
