import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TicketService } from '../../../Services/Ticket/ticket.service';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { Ticket, TicketDTO } from '../../../Classes/ticket.classes';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-reopen-ticket',
  templateUrl: './reopen-ticket.component.html',
  styleUrls: ['./reopen-ticket.component.scss']
})
export class ReopenTicketComponent implements OnInit {
  tickets: TicketDTO[] = [];
  displayedColumns: string[] = ['ticket_Status_Name', 'ticket_Description', 'ticket_Date_Created', 'Actions'];
  dataSource = new MatTableDataSource<TicketDTO>(this.tickets);

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  // Modal control properties
  showConfirmModal: boolean = false;
  selectedTicket: TicketDTO | null = null;

  // Loading Section
  isLoading: boolean = true;
  isData: boolean = false;

  constructor(
    private ticketService: TicketService,
    private userService: UserServiceService
  ) { }

  ngOnInit() {
    this.loadClosedTickets();
  }

  loadClosedTickets() {
    const userId = this.userService.getUserIDFromToken();
    if (userId) {
      // console.log('Fetching closed tickets for user:', userId);
      this.ticketService.searchTickets(userId, 'Closed').subscribe(
        (data: TicketDTO[]) => {
          // console.log('Fetched closed tickets:', data);
          this.tickets = data;
          this.totalItems = data.length; 
          this.updateDataSource(); 
          this.isLoading = false;
          if (data.length > 0) {
            this.isData = true;
          }
        },
        (error: any) => {
          console.error('Error fetching closed tickets:', error);
          this.isLoading = false;
        }
      );
    } else {
      console.error('User ID is null or invalid');
      this.isLoading = false;
      this.isData = true;
    }
  }

  openReopenConfirmationModal(ticket: TicketDTO) {
    this.selectedTicket = ticket;
    this.showConfirmModal = true;
  }

  closeReopenConfirmationModal() {
    this.showConfirmModal = false;
    this.selectedTicket = null;
  }

  confirmReopenTicket() {
    if (this.selectedTicket) {
      const reopenedStatusId = 4;
      const updatedTicket: Ticket = {
        ...(this.selectedTicket as Ticket),
        ticket_Status_ID: reopenedStatusId,
        ticketGroup: [],
        ticket_ID: this.selectedTicket.ticket_ID!
      };
      this.ticketService.updateTicket(this.selectedTicket.ticket_ID!, updatedTicket).subscribe(
        () => {
          console.log('Ticket reopened successfully');
          this.loadClosedTickets();
          this.closeReopenConfirmationModal();
        },
        (error: any) => {
          console.error('Error reopening ticket:', error);
        }
      );
    }
  }

  // Update Table from Pagination
  updateDataSource() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.dataSource.data = this.tickets.slice(start, end);
    console.log('Data source updated:', this.dataSource.data);
  }

  // Update Pagination Numbers
  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  // Pagination Calculation
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}