using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Team04_API.Models.Ticket.To_do_List
{
    public class To_do_List
    {
        [Key]
        public int To_do_List_ID { get; set; }

        [Required]
        [ForeignKey(nameof(Ticket))]
        public int Ticket_ID { get; set; }

        [MaxLength(100)]
        public string? Item_Description { get; set; }

        public bool Is_Completed { get; set; }
        
        //Virtual

        public virtual Ticket? Ticket { get; set; }
    }
}
