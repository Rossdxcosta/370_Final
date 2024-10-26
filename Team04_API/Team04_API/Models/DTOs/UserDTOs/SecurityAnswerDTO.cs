using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.DTOs.UserDTOs
{
    public class SecurityAnswerDTO
    {
        [Required]
        [EmailAddress]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = string.Empty;
        public string Security_Answer { get; set; } = string.Empty;
        public int Security_Question_ID { get; set; } 
    }
}
