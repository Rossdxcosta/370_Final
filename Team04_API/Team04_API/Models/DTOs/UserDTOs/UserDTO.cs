using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.DTOs.UserDTOs
{
    public class UserDTO
    {
        public string? Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Surname { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = string.Empty;
        public string? image { get; set; } = string.Empty;
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime DOB {  get; set; }
        [Required]
        public int TitleID { get; set; }
        [Required]
        public int LanguageID { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
        [Required]
        [DataType(DataType.Password)]
        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; } = string.Empty;

        //public int Security_Question_ID { get; set; }
        //public string Security_Answer { get; set; } = string.Empty;

    }
}
