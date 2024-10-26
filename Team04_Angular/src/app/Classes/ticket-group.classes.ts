import { Ticket } from "./ticket.classes";
import { TicketDTO } from "./ticket.classes";

export class TicketGroup {
  ticketGroup_ID: number = 0;
  name: string = "";
  description: string = "";
  dateCreated: Date = new Date();
  tickets?: Ticket[] = [];
}

export class TicketGroupDTO {
  ticketGroup_ID: number = 0;
  name: string = "";
  description: string = "";
  dateCreated: Date = new Date();
  tickets?: TicketDTO[] = [];
}
