using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models.Location;
using Team04_API.Models.Software;
using Team04_API.Models.Users;

namespace Team04_API.Models.Company
{
    public class Company
    {
        [Key]
        public int Company_ID { get; set; }
        [Required]
        [MinLength(2)]
        [MaxLength(100)]
        public string? Company_Name { get; set; }

        [ForeignKey(nameof(Location.Location_ID))]
        public int Location_ID { get; set; }

        //virtual
        public virtual List<User>? Clients { get; set; }
        public virtual Location.Location? Location { get; set; }
        //public List<Company_Request>? Company_Requests { get; set; }
    }
}
