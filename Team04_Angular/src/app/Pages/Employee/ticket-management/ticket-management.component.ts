import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Ticket, TicketDTO } from '../../../Classes/ticket.classes';
import { TicketService } from '../../../Services/Ticket/ticket.service';
import { TicketStatus } from '../../../Classes/ticket-status.classes';
import { User } from '../../../Classes/users-classes';
import { AddToTicketGroupComponent } from '../../TicketGroup/add-to-ticket-group/add-to-ticket-group.component';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { Priority } from '../../../Classes/priority.classes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tag } from '../../../Classes/tags-classes';
import { EditTicketAdminComponent } from '../../Admin/edit-ticket-admin/edit-ticket-admin.component';

@Component({
  selector: 'app-ticket-management',
  templateUrl: './ticket-management.component.html',
  styleUrls: ['./ticket-management.component.scss']
})
export class TicketManagementComponent implements OnInit, OnDestroy {
  tickets: Ticket[] = [];
  dataSource = new MatTableDataSource<Ticket>([]);
  searchQuery: string = '';
  isLoading: boolean = true;
  isData: boolean = false;
  isTableData: boolean = false;

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private ticketService: TicketService, 
    private dialog: MatDialog, 
    private userService: UserServiceService, 
    private cdr: ChangeDetectorRef, 
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTickets();
    this.loadTicketStatuses();
    this.loadPriorities();
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.ticketService.getTickets().subscribe((ticketDTOs: TicketDTO[]) => {
      this.tickets = ticketDTOs
        .filter(dto => dto.assigned_Employee_ID === this.userService.getUserIDFromToken())
        .map(dto => this.mapToTicket(dto));
      this.totalItems = this.tickets.length;
      this.updateDataSource();
      this.isLoading = false;
      if (this.tickets.length > 0) {
        this.isData = true;
        this.isTableData = true;
      }
      else {
        this.isData = false;
        this.isTableData = false;
      }
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

  loadTicketStatuses(): void {
    this.ticketService.getTicketStatuses().subscribe(statuses => {
      this.isLoading = false;
    });
  }

  loadPriorities(): void {
    this.ticketService.getPriorities().subscribe(priorities => {
      this.isLoading = false;
    });
  }

  loadEmployees(): void {
    this.ticketService.GetAllUsers().subscribe(employees => {
      this.isLoading = false;
    });
  }

  openEditModal(ticket: Ticket): void {
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

  openAddTicketToGroupModal(ticket: Ticket, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddToTicketGroupComponent, {
      data: { ticket }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTickets();
      }
    });
  }

  searchTickets(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      this.isTableData = false;
      const filteredTickets = this.tickets.filter(ticket =>
        ticket.ticket_ID?.toString().includes(query) ||
        ticket.client.user_Name.toLowerCase().includes(query) ||
        ticket.tag.tag_Name.toLowerCase().includes(query) ||
        ticket.priority.priority_Name.toLowerCase().includes(query) ||
        ticket.ticket_Status.status_Name.toLowerCase().includes(query) ||
        ticket.ticket_Description.toLowerCase().includes(query)
      );
      this.totalItems = filteredTickets.length;

      if (filteredTickets.length > 0) {
        this.isTableData = true;
      }

      this.updateDataSource(filteredTickets);
    } else {
      this.isTableData = true;
      this.totalItems = this.tickets.length;
      this.updateDataSource();
    }
  }

  updateDataSource(filteredTickets: Ticket[] = this.tickets): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.dataSource.data = filteredTickets.slice(start, end);
  }

  onPageChange(event: { pageIndex: number, pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
