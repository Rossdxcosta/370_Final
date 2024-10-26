using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models.Feedback;
using Team04_API.Models.Users;

namespace Team04_API.Models.Chatbot
{
    public class Chatbot_Log
    {
        [Key]
        public int Chatbot_Log_ID { get; set; }
        [Required]
        [ForeignKey(nameof(Client))]
        public Guid Client_ID { get; set;}
        //[MinLength(1), MaxLength(100)]
        public string? Conversation_Title { get; set; }
        
        public bool isBotConcluded { get; set; } = false;
        public bool isBotHandedOver { get; set; } = false;
        public bool isDismissed { get; set; } = false;

        [Required]
        public DateTime? Conversation_Date { get; set; }
        //Added this for the schaffolding of the database
        [ForeignKey(nameof(Ticket.Ticket_ID))]
        public int? Ticket_ID { get; set; }

        public Chat? chat { get; set; }

        public Guid? Agent_ID { get; set; }

        public Guid? ChatUUID { get; set; }

        //VIRTUAL ITEMS
        public virtual User? Client { get; set; }
        public virtual Client_Feedback? Client_Feedback { get; set; }
        public virtual Ticket.Ticket? Ticket { get; set; }
    }

    public class Chat
    {
        public int Chat_ID { get; set; }
        public List<Message>? Messages { get; set; }
    }

    public class Message
    {
        public int messageType { get; set; }
        public Guid? senderID { get; set; }
        public string messageText { get; set; } = string.Empty;
        public string name {  get; set; } = string.Empty ;
        public int role { get; set; }
        public DateTime? time { get; set; } = DateTime.UtcNow;
    }
}
