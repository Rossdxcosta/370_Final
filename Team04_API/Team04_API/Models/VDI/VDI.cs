using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models.Ticket.To_do_List;

namespace Team04_API.Models.VDI
{
    public class VDI
    {
        [Key]
        public int VDI_ID { get; set; }
        [Required]
        [ForeignKey(nameof(VDI.VDI_Type_ID))]
        public int VDI_Type_ID {  get; set; }
        [Required]
        [MinLength(1), MaxLength(50)]
        public string? VDI_Name { get; set; }

        //VIRTUAL ITEMS
        public virtual VDI_Type? VDI_Type { get; set; }
    }
}
