import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../Services/Ticket/ticket.service';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { Ticket, TicketDTO } from '../../../Classes/ticket.classes';
import { TicketStatus } from '../../../Classes/ticket-status.classes';
import { MatTableDataSource } from '@angular/material/table';

interface SearchCriteria {
  status: string;
  startDate: string | null;
  endDate: string | null;
}

@Component({
  selector: 'app-display-ticket',
  templateUrl: './display-ticket.component.html',
  styleUrls: ['./display-ticket.component.scss']
})
export class DisplayTicketComponent implements OnInit {
  tickets: TicketDTO[] = [];
  filteredTickets: TicketDTO[] = [];
  displayedColumns: string[] = ['ticket_Status_Name', 'ticket_Description', 'ticket_Date_Created', 'Actions'];
  dataSource = new MatTableDataSource<TicketDTO>(this.tickets);

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  // Modal control properties
  showCloseConfirmModal: boolean = false;
  showReopenConfirmModal: boolean = false;
  showEditDescriptionModal: boolean = false;
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  selectedTicket: TicketDTO | null = null;
  editedDescription: string = '';

  // Loading Section
  isLoading: boolean = true;
  isData: boolean = false;

  ticketStatuses: TicketStatus[] = [];
  searchCriteria: SearchCriteria = {
    status: '',
    startDate: null,
    endDate: null
  };
  maxDate: Date = new Date();

  constructor(
    private ticketService: TicketService,
    private userService: UserServiceService
  ) {}

  ngOnInit() {
    this.loadTicketStatuses();
    this.loadTickets();
  }

  // Get Ticket Statuses
  loadTicketStatuses() {
    this.ticketService.getTicketStatuses().subscribe(
      (data: TicketStatus[]) => {
        this.ticketStatuses = data;
        this.isLoading = false;
        if (this.ticketStatuses.length > 0) {
          this.isData = true;
        }
      },
      (error: any) => {
        console.error('Error fetching ticket statuses:', error);
        this.isLoading = false;
      }
    );
  }

  applyFilters() {
    console.log('Applying filters with criteria:', this.searchCriteria);
    this.filteredTickets = this.tickets.filter(ticket => {
      const statusMatch =
        !this.searchCriteria.status || ticket.ticket_Status_Name === this.searchCriteria.status;

      const ticketDate = new Date(ticket.ticket_Date_Created);

      const startDateMatch =
        !this.searchCriteria.startDate ||
        ticketDate >= new Date(this.searchCriteria.startDate);

      const endDateMatch =
        !this.searchCriteria.endDate ||
        ticketDate <= new Date(this.searchCriteria.endDate);

      return statusMatch && startDateMatch && endDateMatch;
    });
    this.totalItems = this.filteredTickets.length;
    this.pageIndex = 0;
    this.updateDataSource();
  }

  onSearchCriteriaChange() {
    this.applyFilters();
  }

  clearSearchCriteria() {
    this.searchCriteria = {
      status: '',
      startDate: null,
      endDate: null
    };
    this.applyFilters();
  }

  // Get Tickets
  loadTickets() {
    const userId = this.userService.getUserIDFromToken();
    if (userId) {
      this.ticketService.searchTickets(userId).subscribe(
        (data: TicketDTO[]) => {
          this.tickets = data;
          this.filteredTickets = data;
          this.totalItems = data.length;
          this.updateDataSource();
          this.isLoading = false;
          if (data.length > 0) {
            this.isData = true;
          } else {
            this.isData = false;
          }
        },
        (error: any) => {
          console.error('Error fetching tickets:', error);
          this.isLoading = false;
        }
      );
    } else {
      console.error('User ID is null or invalid');
      this.isLoading = false;
      this.isData = false;
    }
  }

  openCloseConfirmationModal(ticket: TicketDTO) {
    this.selectedTicket = ticket;
    this.showCloseConfirmModal = true;
  }

  closeCloseConfirmationModal() {
    this.showCloseConfirmModal = false;
    this.selectedTicket = null;
  }

  confirmCloseTicket() {
    if (this.selectedTicket) {
      const closedStatusId = 3;
      const updatedTicket: Ticket = {
        ...(this.selectedTicket as Ticket),
        ticket_Status_ID: closedStatusId,
        ticketGroup: [],
        ticket_ID: this.selectedTicket.ticket_ID!
      };
      this.ticketService.updateTicket(this.selectedTicket.ticket_ID!, updatedTicket).subscribe(
        () => {
          console.log('Ticket closed successfully');
          this.loadTickets();
          this.closeCloseConfirmationModal();
        },
        (error: any) => {
          console.error('Error closing ticket:', this.selectedTicket, updatedTicket, error);
        }
      );
    }
  }

  openReopenConfirmationModal(ticket: TicketDTO) {
    this.selectedTicket = ticket;
    this.showReopenConfirmModal = true;
  }

  closeReopenConfirmationModal() {
    this.showReopenConfirmModal = false;
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
          this.loadTickets();
          this.closeReopenConfirmationModal();
        },
        (error: any) => {
          console.error('Error reopening ticket:', error);
        }
      );
    }
  }

  openEditDescriptionModal(ticket: TicketDTO) {
    this.selectedTicket = ticket;
    this.editedDescription = ticket.ticket_Description || '';
    this.showEditDescriptionModal = true;
  }

  closeEditDescriptionModal() {
    this.showEditDescriptionModal = false;
    this.selectedTicket = null;
    this.editedDescription = '';
  }

  saveTicketDescription(form: any) {
    if (form.invalid) {
      return;
    }
    if (this.selectedTicket) {
      const updatedTicket: Ticket = {
        ...(this.selectedTicket as Ticket),
        ticket_Description: this.editedDescription,
        ticketGroup: [],
        ticket_ID: this.selectedTicket.ticket_ID!
      };
      this.ticketService.updateTicket(this.selectedTicket.ticket_ID!, updatedTicket).subscribe(
        () => {
          console.log('Ticket description updated successfully');
          this.loadTickets();
          this.closeEditDescriptionModal();
          this.showSuccessModal = true;
        },
        (error: any) => {
          console.error('Error updating ticket description:', error);
          this.closeEditDescriptionModal();
          this.showErrorModal = true;
        }
      );
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  // Update Table from Pagination
  updateDataSource() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.dataSource.data = this.filteredTickets.slice(start, end);
    console.log('Data source updated:', this.dataSource.data);
  }

  // Update Pagination Numbers
  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  // Pagination Calculation
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
