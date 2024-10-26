namespace Team04_API.Models.Ticket
{
    public class TicketTicketGroup
    {
        public int Ticket_ID { get; set; }
        public Ticket Ticket { get; set; }

        public int TicketGroup_ID { get; set; }
        public TicketGroup TicketGroup { get; set; }
    }
}
