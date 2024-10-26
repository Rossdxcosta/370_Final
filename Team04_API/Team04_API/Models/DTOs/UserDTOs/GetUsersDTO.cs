using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.DTOs.UserDTOs
{
    public class GetUsersDTO
    {
        //This is just used to format the api responses
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Id { get; set; } =string.Empty;
        public string Email { get; set; } = string.Empty ;
    }
}
