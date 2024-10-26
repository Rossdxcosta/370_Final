import { Ticket } from "./ticket.classes";
import { TicketGroup } from "./ticket-group.classes";


export class TicketTicketGroup {
  ticket_ID: number = 0;
  ticket: Ticket = new Ticket();
  ticketGroup_ID: number = 0;
  ticketGroup: TicketGroup = new TicketGroup();
}
