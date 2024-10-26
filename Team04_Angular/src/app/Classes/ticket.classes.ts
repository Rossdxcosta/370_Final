import { User } from "./users-classes";
import { Priority } from "./priority.classes";
import { Tag } from "./tags-classes";
import { TicketStatus } from "./ticket-status.classes";
import { TicketGroup } from "./ticket-group.classes";

export class Ticket {
  ticket_ID?: number;
  client_ID: string;
  client: User;
  employee: User;
  tag_ID: number;
  tag: Tag;
  priority_ID: number;
  priority: Priority;
  ticket_Status_ID: number;
  ticket_Status: TicketStatus;
  ticket_Description: string;
  ticket_Date_Created: Date;
  ticket_Subscription: boolean;
  assigned_Employee_ID: string;
  ticketGroup?: TicketGroup[];


  constructor(
    client_ID: string = '',
    client: User = new User(),
    employee: User = new User(),
    tag_ID: number = 0,
    tag: Tag = new Tag(),
    priority_ID: number = 0,
    priority: Priority = new Priority(),
    ticket_Status_ID: number = 0,
    ticket_Status: TicketStatus = new TicketStatus(),
    ticket_Description: string = '',
    ticket_Date_Created: Date = new Date(),
    ticket_Subscription: boolean = false,
    assigned_Employee_ID: string = '',
    ticketGroup?: TicketGroup[],

  ) {
    this.client_ID = client_ID;
    this.client = client;
    this.employee = employee;
    this.tag_ID = tag_ID;
    this.tag = tag;
    this.priority_ID = priority_ID;
    this.priority = priority;
    this.ticket_Status_ID = ticket_Status_ID;
    this.ticket_Status = ticket_Status;
    this.ticket_Description = ticket_Description;
    this.ticket_Date_Created = ticket_Date_Created;
    this.ticket_Subscription = ticket_Subscription;
    this.assigned_Employee_ID = assigned_Employee_ID;
    this.ticketGroup = ticketGroup;
  }
}

export class TicketDTO {
  ticket_ID?: number;
  client_ID: string;
  tag_ID: number;
  priority_ID: number;
  ticket_Status_ID: number;
  ticket_Status_Name: string;
  ticket_Description: string;
  ticket_Date_Created: Date;
  ticket_Subscription: boolean;
  client: User;
  employee: User;
  tag: Tag;
  priority: Priority;
  ticket_Status: TicketStatus;
  assigned_Employee_ID: string;
  ticketGroup?: TicketGroup[];

  constructor(
    ticket_ID: number = 0,
    client_ID: string = '',
    tag_ID: number = 0,
    priority_ID: number = 0,
    ticket_Status_ID: number = 0,
    ticket_Description: string = '',
    ticket_Date_Created: Date = new Date(),
    ticket_Subscription: boolean = false,
    ticket_Status_Name: string = '',
    client: User = new User(),
    employee: User = new User(),
    tag: Tag = new Tag(),
    priority: Priority = new Priority(),
    ticket_Status: TicketStatus = new TicketStatus(),
    assigned_Employee_ID: string = '',
    ticketGroup?: TicketGroup[]
  ) {
    this.ticket_ID = ticket_ID;
    this.client_ID = client_ID;
    this.tag_ID = tag_ID;
    this.priority_ID = priority_ID;
    this.ticket_Status_ID = ticket_Status_ID;
    this.ticket_Description = ticket_Description;
    this.ticket_Date_Created = ticket_Date_Created;
    this.ticket_Subscription = ticket_Subscription;
    this.ticket_Status_Name = ticket_Status_Name;
    this.client = client;
    this.employee = employee;
    this.tag = tag;
    this.priority = priority;
    this.ticket_Status = ticket_Status;
    this.assigned_Employee_ID = assigned_Employee_ID;
    this.ticketGroup = ticketGroup;
  }
}