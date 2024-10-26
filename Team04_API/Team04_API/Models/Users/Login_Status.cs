using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Users
{
    public class Login_Status
    {
        [Key]
        public int Login_Status_ID {  get; set; }
        public string Login_Description { get; set; } = string.Empty;

        //Virtual
        public virtual List<User>? Users { get; set; }
    }
}
