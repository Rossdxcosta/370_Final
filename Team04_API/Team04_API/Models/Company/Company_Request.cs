using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Team04_API.Models.Users;

namespace Team04_API.Models.Company
{
    public class Company_Request
    {
        [Key]
        public int Company_Request_ID { get; set; }
        [Required]
        [ForeignKey(nameof(Client))]
        public Guid Client_ID { get; set; }
        public string ?Company_Name { get; set; }
        public string? Location { get; set; }

        [Required]
        public DateTime Request_Date { get; set; }
        public bool isActive { get; set; }
        //VIRTUAL ITEMS
        public virtual User? Client { get; set; }
        public virtual Company? Company  { get; set; }
    }
}
