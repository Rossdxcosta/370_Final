using System.ComponentModel.DataAnnotations;
using Team04_API.Models.Chatbot;

namespace Team04_API.Models.DTOs.MessageDTO
{
    public class MessagesDTO
    {
        [Required]
        public Guid ChatbotLogID { get; set; }
        [Required]
        public required Message Message { get; set; }
        [Required]
        public required string username { get; set; }
        [Required]
        public required int role { get; set; }
    }
}
