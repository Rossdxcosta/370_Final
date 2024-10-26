using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Team04_API.Models.Ticket;

namespace Team04_API.Models.Department
{
    public class Department
    {
        [Key]
        public int Department_ID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(1000)]
        public string? Department_Name { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string? Department_Description { get; set; }
        
        public virtual List<Tag>? Tag { get; set; }

        [NotMapped]
        public List<int>? TagIds { get; set; }

    }

    public class DepartmentDTO
    {
        public int Department_ID { get; set; }
        public string Department_Name { get; set; } = string.Empty;
        public string Department_Description { get; set; } = string.Empty;
        public List<int>? TagIds { get; set; }
    }
}
