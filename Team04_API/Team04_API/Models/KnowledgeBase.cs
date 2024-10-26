using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models.Ticket;

namespace Team04_API.Models
{
    public class KnowledgeBase
    {
        [Key]
        public int KBID { get; set; }
        public string Topic { get; set; }

        [ForeignKey(nameof(TicketGroup.TicketGroup_ID))]
        public int? Ticket_Group_ID { get; set; }

        public virtual TicketGroup? TicketGroup { get; set; }
        public virtual List<ChatRoom>? ChatRooms { get; set; }

    }

    public class ChatRoom
    {
        public int Id { get; set; }
        public List<ChatMessage> ChatMessages { get; set; } = new List<ChatMessage>();
    }

    public class ChatMessage
    {
        public int Id { get; set; }
        public Guid SenderID { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public int upvotes { get; set; }
        
    }

    public class ImageUploads
    {
        public int Id { get; set; }
        public string Images { get; set; } = string.Empty;
    }
}
