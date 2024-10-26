using System.ComponentModel.DataAnnotations;
using Team04_API.Models.Users;

namespace Team04_API.Models.Software
{
    public class Software
    {
        [Key]
        public int Software_ID { get; set; }
        public string? Software_Name { get; set; }
        [Required, MinLength(5), MaxLength(255)]
        public string? Software_Description { get; set;  }
        //virtual
        public List<Software_Request>? Software_Requests { get; set;}
        public List<User>? Users { get; set; }

    }
}
