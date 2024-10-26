using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.VDI
{
    public class VDI_Type
    {
        [Key]
        public int VDI_Type_ID { get; set; }
        [Required]
        [MinLength(5), MaxLength(50)]
        public string? VDI_Type_Name { get; set; }
        [Required]
        [MinLength(5), MaxLength(255)]
        public string? VDI_Type_Description { get; set; }

        //Virtual
        public virtual List<VDI>? VDIs {  get; set; }
    }
}
