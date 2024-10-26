using System;
using System.Collections.Generic;

namespace Team04_API.Models.DTOs
{
    public class TicketGroupDTO
    {
        public int TicketGroup_ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public List<TicketDTO> Tickets { get; set; }
    }
}
