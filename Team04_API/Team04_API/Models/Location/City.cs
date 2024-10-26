using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Location
{
    public class City
    {
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }
        public int State_ID { get; set; }

        //Virtual
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual State State { get; set; }
    }
}
