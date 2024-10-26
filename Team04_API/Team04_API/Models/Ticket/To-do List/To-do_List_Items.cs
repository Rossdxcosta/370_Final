using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Team04_API.Models.Ticket.To_do_List
{
    public class To_do_List_Items
    {
        [Key]
        public int To_Do_Note_ID { get; set; }

        [Required]
        [ForeignKey(nameof(Ticket.Ticket_ID))]
        public int Ticket_ID { get; set; }

        [Required]
        [MaxLength(100)]
        public string? Note_Description { get; set; }
        [Required]

        //Virtual
        public virtual Ticket? Ticket { get; set; }
    }
}
