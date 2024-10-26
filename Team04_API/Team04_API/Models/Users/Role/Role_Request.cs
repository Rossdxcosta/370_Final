using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Team04_API.Models.Users.Role
{
    public class Role_Request
    {
        [Key]
        public int Role_Request_ID { get; set; }
        public DateTime Application_Date { get; set; }

        [ForeignKey(nameof(Role.Id))]
        public Guid Role_ID { get; set; }
        [ForeignKey(nameof(User.User_ID))]
        public Guid User_ID { get; set; }
        [ForeignKey(nameof(_Request.Request_Status_ID))]
        public int Status_ID { get; set; }

        //virtual

        public virtual Role? Role {  get; set; }
        public virtual User? User { get; set; }
        public virtual Request_Status? _Request { get; set; }
    }
}
