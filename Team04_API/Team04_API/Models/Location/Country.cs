using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Location
{
    public class Country
    {
        [Key]
        public int Country_ID { get; set; }
        [Required]
        [MinLength(5)]
        [MaxLength(255)]
        public string? Country_Name { get; set; }
        [Required]
        [MinLength(3)]
        [MaxLength(15)]
        public string? Region { get; set; }

        public string? SubRegion { get; set; }

        public string? iso3Code { get; set; }
        public string? phone_code { get; set; }
        public string? native {  get; set; }

        public List<State>? states { get; set; }

        //Virtual
        //public virtual List<Location>? Locations { get; set; }
    }
}
