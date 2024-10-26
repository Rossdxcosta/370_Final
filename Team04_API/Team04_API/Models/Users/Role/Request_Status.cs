using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Users.Role
{
    public class Request_Status
    {
        [Key]
        public int Request_Status_ID { get; set; }
        public string Request_Status_Description { get; set; } = string.Empty;

        //virtual
        /*public virtual List<Role_Request>? Role_Requests { get; set; }*/
    }
}
