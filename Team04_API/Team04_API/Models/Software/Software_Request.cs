using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models.Ticket.To_do_List;
using Team04_API.Models.Users;

namespace Team04_API.Models.Software
{
    public class Software_Request
    {
        [Key]
        public int Software_Request_ID { get; set; }
        [Required]
        [ForeignKey(nameof(Client))]
        public Guid Client_ID { get; set; }
        [Required]
        [ForeignKey(nameof(Software.Software_ID))]
        public int Software_ID { get; set; }
        [Required]
        public DateTime Request_Date { get; set; }

        //VIRTUAL ITEMS
        public virtual User? Client { get; set; }
        public virtual Software? Software { get; set; }
    }
}
