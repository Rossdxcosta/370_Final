using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.DTOs.UserDTOs
{
    public class LoginDTO
    {
        //This is just used to format the api responses
        //[Required]
        [EmailAddress]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = string.Empty;
        //[Required]
        //[DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
    }
}
