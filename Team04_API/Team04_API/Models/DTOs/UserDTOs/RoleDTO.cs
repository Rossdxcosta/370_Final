using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.DTOs.UserDTOs
{
    public class RoleDTO
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Role_Description { get; set; }
    }
}
