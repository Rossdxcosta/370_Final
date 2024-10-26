using System.ComponentModel.DataAnnotations;
using Team04_API.Models.Users.Role;

namespace Team04_API.Models.Users.Account_Requests
{
    public class Request_Type
    {
        [Key]
        public int Request_Type_ID { get; set; }
        [Required]
        public string? Description {  get; set; }
    }
}
