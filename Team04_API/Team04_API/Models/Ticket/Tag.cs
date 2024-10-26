using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Ticket
{
    public class Tag
    {
        [Key]
        public int Tag_ID { get; set; }
        //[Required]
        public int? Department_ID { get; set; }
        //[Required]
        [MaxLength(50)]    
        public string Tag_Name { get; set; } = string.Empty;
        //[Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string? Tag_Description { get; set; }

        //VIRTUAL ITEMS
        public virtual List<Department.Department>? Department { get; set; }  
        //public virtual List<Ticket>? Tickets { get; set; }
    }
}
