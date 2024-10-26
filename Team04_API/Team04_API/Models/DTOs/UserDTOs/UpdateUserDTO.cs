using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.DTOs.UserDTOs
{
    public class UpdateUserDTO
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Surname { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = string.Empty;
        //public string? image { get; set; } = string.Empty;
        public string Phone {  get; set; } = string.Empty;
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime DOB { get; set; }
        [Required]
        public int Title_ID { get; set; }
        [Required]
        public int Language_ID { get; set; }
        public int Company_ID { get; set; }
    }
}
