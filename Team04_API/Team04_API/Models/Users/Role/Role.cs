using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Team04_API.Models.Users.Account_Requests;

namespace Team04_API.Models.Users.Role
{
    public class Role
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }
        public string Role_Description { get; set; } = string.Empty;

        //virtual
        /*public virtual List<Role_Request>? _Requests { get; set; }*/
    }
}