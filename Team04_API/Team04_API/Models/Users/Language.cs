using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Users
{
    public class Language
    {
        [Key]
        public int Language_ID { get; set; }
        public string Description { get; set; } = string.Empty;

        //Virtual
        public virtual List<User>? Users { get; set; } 
    }
}
