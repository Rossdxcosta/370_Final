import { AfterViewChecked, AfterViewInit, Component, ComponentFactoryResolver, HostBinding, Input, OnInit, signal, ViewChild, ViewContainerRef } from "@angular/core";
import { CalendarOptions, EventInput } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { TicketService } from "../../../Services/Ticket/ticket.service";
import { UserServiceService } from "../../../Services/Users/user-service.service";
import { Ticket, TicketDTO } from "../../../Classes/ticket.classes";
import { FullCalendarModule } from "@fullcalendar/angular";
import { EditTicketAdminComponent } from "../../Admin/edit-ticket-admin/edit-ticket-admin.component";
import { MatDialog } from "@angular/material/dialog";
import { firstValueFrom } from 'rxjs';
import { TicketStatus } from "../../../Classes/ticket-status.classes";
import { Priority } from "../../../Classes/priority.classes";
import { User } from "../../../Classes/users-classes";
import { Tag } from "../../../Classes/tags-classes";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  standalone: true,
  imports: [FullCalendarModule]
})
export class CalendarComponent implements OnInit {
  tickets: Ticket[] = [];
  current_ticket: Ticket = new Ticket;
  ticketStatuses: TicketStatus[] = [];
  priorities: Priority[] = [];
  employees: User[] = [];

  constructor(private ticketService: TicketService, private userService: UserServiceService, private dialog: MatDialog, ) {}

  //CALENDAR
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    eventColor: '#ef0604',
    eventTextColor: '#ffffff',
    eventBackgroundColor: '#ef0604',
    eventBorderColor: '#000000',
    
    dayCellContent: (args) => {
      return { html: `<div class="custom-day-cell">${args.dayNumberText}</div>` }
    },
    
    eventContent: (args) => {
      return { html: `<div class="custom-event bg-red-500 rounded-lg w-full pl-4 text-white font-bold">${args.event.title}</div>` }
    },
    
    eventClick: async (info) => {
      try {
        this.current_ticket = await firstValueFrom(this.ticketService.getTicketByIdNonDTO(info.event.extendedProps["ticket_id"]));
        this.openEditModal(this.current_ticket);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };
  //CALENDAR END

  ngOnInit(): void {
    this.loadTickets();
    this.loadTicketStatuses();
    this.loadPriorities();
    this.loadEmployees();
  }

  loadTicketStatuses(): void {
    this.ticketService
      .getTicketStatuses()
      .subscribe((statuses: TicketStatus[]) => {
        this.ticketStatuses = statuses;
      });
  }

  loadPriorities(): void {
    this.ticketService.getPriorities().subscribe((priorities: Priority[]) => {
      this.priorities = priorities;
    });
  }

  loadEmployees(): void {
    this.ticketService.GetAllUsers().subscribe((employees: User[]) => {
      this.employees = employees.filter((emp) =>
        [3, 4, 5].includes(emp.role_ID)
      );
    });
  }

  secondsSinceDate(dateString: any): number {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - givenDate.getTime();
    return differenceInMilliseconds / 1000;
  }

  updateCalendarEvents(): void {
    const events: EventInput[] = [];
    const breach_dates: Date[] = [];
  
    for (let i = 0; i < this.tickets.length; i++) {
      const days = Number(this.tickets[i].priority.breachTime.slice(0, 3));
      const hours = Number(this.tickets[i].priority.breachTime.slice(4, 6));
      const minutes = Number(this.tickets[i].priority.breachTime.slice(7, 9));
      const seconds = Number(this.tickets[i].priority.breachTime.slice(10, 12));
  
      const totalBreachMilliseconds =
        (days * 24 * 60 * 60 * 1000) + 
        (hours * 60 * 60 * 1000) +     
        (minutes * 60 * 1000) +        
        (seconds * 1000);              
  
      const creationDate = new Date(this.tickets[i].ticket_Date_Created);

      const breachDate = new Date(creationDate.getTime() + totalBreachMilliseconds);
    
      breach_dates.push(breachDate);
  
      events.push({
        title: this.tickets[i].client.user_Name + "'s ticket BREACH",
        date: breachDate,
        ticket_id: this.tickets[i].ticket_ID
      });
    }

    this.calendarOptions = {
      ...this.calendarOptions,
      events: events
    };
  }

  openEditModal(ticket: Ticket): void {
    // console.log(ticket);
    const dialogRef = this.dialog.open(EditTicketAdminComponent, {
      width: '1000px',
      data: { ticket }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTickets();
      }
    });
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe((ticketDTOs: TicketDTO[]) => {
      if (this.userService.getUserRoleFromToken() === "Employee") {
        this.tickets = ticketDTOs.filter(dto => dto.assigned_Employee_ID === this.userService.getUserIDFromToken())
          .map(dto => this.mapToTicket(dto));
        this.tickets = this.tickets.filter(dto => dto.ticket_Status.status_Name.toLowerCase() !== "closed");
      }
      else{
        this.tickets = ticketDTOs.filter(dto => dto.ticket_Status.status_Name.toLowerCase() !== "closed");
      }
      
      this.updateCalendarEvents();
    });
  }

  private mapToTicket(dto: TicketDTO): Ticket {
    return {
      ticket_ID: dto.ticket_ID || 0,
      client_ID: dto.client_ID,
      client: dto.client || new User(),
      employee: dto.employee || new User(),
      tag_ID: dto.tag_ID,
      tag: dto.tag || new Tag(),
      priority_ID: dto.priority_ID,
      priority: dto.priority || new Priority(),
      ticket_Status_ID: dto.ticket_Status_ID,
      ticket_Status: dto.ticket_Status || new TicketStatus(),
      ticket_Description: dto.ticket_Description,
      ticket_Date_Created: new Date(dto.ticket_Date_Created),
      ticket_Subscription: dto.ticket_Subscription,
      assigned_Employee_ID: dto.assigned_Employee_ID,
      ticketGroup: []
    };
  }
}
