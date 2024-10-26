using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models.Ticket.To_do_List;
using Team04_API.Models.Users;

namespace Team04_API.Models.VDI
{
    [PrimaryKey(nameof(Client), nameof(VDI))]
    public class Client_VDI
    {
        [Key]
        [ForeignKey(nameof(Client))]
        public Guid Client_ID { get; set; }
        [ForeignKey(nameof(VDI.VDI_ID))]
        public int VDI_ID { get; set; }

        //VIRTUAL ITEMS
        public virtual User? Client { get; set; }
        public virtual VDI? VDI { get; set; }
    }
}
