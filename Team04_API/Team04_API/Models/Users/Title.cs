using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Users
{
    public class Title
    {
        [Key]
        public int Title_ID { get; set; }
        public required string Title_Description { get; set; }


        //Virtual
        public virtual List<User>? Users { get; set; }
    }
}
