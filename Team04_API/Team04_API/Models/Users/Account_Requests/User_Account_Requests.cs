using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Team04_API.Models.Users.Role;

namespace Team04_API.Models.Users.Account_Requests
{
    public class User_Account_Requests
    {
        [Key]
        public int Request_ID { get; set; }
        [ForeignKey(nameof(Role))]
        public int Role_ID { get; set; }
        [ForeignKey(nameof(user))]
        public Guid User_ID { get; set; }
        [ForeignKey(nameof(request_type))]
        public int Request_Type_ID {  get; set; }
        public DateTime Request_Date { get; set; }
        public string Reason {  get; set; } = string.Empty;

        //VIRTUAL ITEMS
        public virtual Role.Role? Role { get; set; }
        public virtual User? user { get; set; }
        public virtual Request_Type? request_type { get; set; }
    }
}
