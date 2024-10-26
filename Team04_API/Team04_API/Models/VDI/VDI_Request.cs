using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models.Ticket.To_do_List;
using Team04_API.Models.Users;

namespace Team04_API.Models.VDI
{
    public class VDI_Request
    {
        [Key]
        public int VDI_Request_ID { get; set; }
        [Required]
        [ForeignKey(nameof(Client))]
        public Guid Client_ID { get; set; }

        [Required]
        public DateTime Request_Date { get; set; }

        [Required]
        [ForeignKey(nameof(VDI))]
        public int VDI_ID { get; set; } 

        public virtual User? Client { get; set; }
        public virtual VDI? VDI { get; set; }
    }


}
