using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Team04_API.Models.Location
{
    public class Location
    {
        [Key]
        public int Location_ID { get; set; }
        [Required]
        [ForeignKey(nameof(City.Id))]
        public int City_ID { get; set; }
        [Required]
        [MinLength(25)]
        public string? Street_Address { get; set; }
        [Required]
        public int? PostalCode { get; set; }

        [ForeignKey(nameof(Company.Company_ID))]
        public int Company_ID { get; set; }


        //VIRTUAL ITEMS
        public virtual Company.Company Company { get; set; }

        public virtual City? City { get; set; }
    }
}
