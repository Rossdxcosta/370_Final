import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../Services/Ticket/ticket.service';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { TicketUpdates } from '../../../Classes/ticket-updates';
import { MatTableDataSource } from '@angular/material/table';
import { TicketDTO } from '../../../Classes/ticket.classes';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ticket-updates',
  templateUrl: './ticket-updates.component.html',
  styleUrls: ['./ticket-updates.component.scss']
})
export class TicketUpdatesComponent implements OnInit {
  ticketUpdates: TicketUpdates[] = [];
  filteredUpdates: TicketUpdates[] = [];
  dataSource = new MatTableDataSource<TicketUpdates>();
  ticketStatusLookup: { [key: number]: string } = {};
  // Loading conditions
  isLoading = true;
  noUpdatesToShow = false; 
  // Modal control
  showConfirmModal = false;
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  showInfoModal: boolean = false;

  successMessage: string = "";
  errorMessage: string = "";
  infoMessage: string = "";

  showModalSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  showModalError(message: string): void {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  showModalInfo(message: string): void {
    this.infoMessage = message;
    this.showInfoModal = true;
  }

  closeInfoModal(): void {
    this.showInfoModal = false;
  }

  constructor(
    private ticketService: TicketService,
    private userService: UserServiceService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.fetchTicketUpdates();
    this.fetchTicketStatuses();
  }

  fetchTicketUpdates(): void {
    const clientId = this.userService.getUserIDFromToken();
    if (clientId) {
      console.log('Fetching ticket updates for client:', clientId);
      this.ticketService.getTicketUpdatesByUserId(clientId).subscribe(
        (updates: TicketUpdates[]) => {
          console.log('Fetched ticket updates:', updates);
          this.ticketUpdates = updates;
          this.fetchAdditionalTicketDetails();
        },
        (error: any) => {
          console.error('Error fetching ticket updates', error);
          this.snackBar.open('Error fetching ticket updates', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      );
    } else {
      console.error('Client ID is null or invalid');
      this.snackBar.open('Client ID is null or invalid', 'Close', { duration: 3000 });
      this.isLoading = false;
    }
  }

  fetchTicketStatuses(): void {
    this.ticketService.getTicketStatuses().subscribe(
      (statuses) => {
        statuses.forEach(status => {
          this.ticketStatusLookup[status.ticket_Status_ID] = status.status_Name;
        });
      },
      (error) => {
        console.error('Error fetching ticket statuses:', error);
        this.showModalError("Error fetching tickets statuses");
      }
    );
  }

  fetchAdditionalTicketDetails(): void {
    let remainingRequests = this.ticketUpdates.length;
    this.ticketUpdates.forEach(update => {
      this.ticketService.getTicketById(update.ticket_ID).subscribe(
        (ticket: TicketDTO) => {
          if (ticket.ticket_Subscription) {
            console.log("TICKET : " + ticket);
            update.ticket_Description = ticket.ticket_Description;
            //update.client = ticket.client;
            if (!update.hasBeenDismissed && update.ticket_Status_New_ID != 5) {
              this.filteredUpdates.push(update);
            }
          }
          remainingRequests--;
          if (remainingRequests === 0) {
            this.isLoading = false;
            this.dataSource.data = this.filteredUpdates;
            if (this.filteredUpdates.length === 0) {
              this.noUpdatesToShow = true;
            }
          }
        },
        (error) => {
          console.error('Error fetching ticket details:', error);
          this.showModalError("Error fetching ticket details");
          remainingRequests--;
          if (remainingRequests === 0) {
            this.isLoading = false;
            this.dataSource.data = this.filteredUpdates;
            if (this.filteredUpdates.length === 0) {
              this.noUpdatesToShow = true;
            }
          }
        }
      );
    });
  }

  getStatusName(statusId: number): string {
    return this.ticketStatusLookup[statusId] || 'Unknown';
  }

  dismissUpdate(update: TicketUpdates): void {
    update.hasBeenDismissed = true;
    this.ticketService.updateTicketNotifications(update.ticket_Update_ID, update).subscribe(
      () => {
        console.log('Ticket update dismissed:', update.ticket_Update_ID);
        this.showModalSuccess("Update Dismissed");
        this.filteredUpdates = this.filteredUpdates.filter(u => u.ticket_Update_ID !== update.ticket_Update_ID);
        this.dataSource.data = this.filteredUpdates;
        if (this.filteredUpdates.length === 0) {
          this.noUpdatesToShow = true;
        }
      },
      (error) => {
        console.error('Error dismissing ticket update:', error);
        this.showModalError("Error fdismissing update");
        update.hasBeenDismissed = false; 
      }
    );
  }

  openDismissAllDialog(): void {
    this.showConfirmModal = true;
  }

  closeDismissAllDialog(): void {
    this.showConfirmModal = false;
  }

  dismissAllUpdates(): void {
    this.filteredUpdates.forEach(update => {
      if (!update.hasBeenDismissed) {
        update.hasBeenDismissed = true;
        this.ticketService.updateTicketNotifications(update.ticket_Update_ID, update).subscribe(
          () => {
            console.log('Ticket update dismissed:', update.ticket_Update_ID);
            this.showModalSuccess("All updates dismissed");
            this.filteredUpdates = this.filteredUpdates.filter(u => u.ticket_Update_ID !== update.ticket_Update_ID);
            this.dataSource.data = this.filteredUpdates;
            this.noUpdatesToShow = this.filteredUpdates.length === 0;
          },
          (error) => {
            console.error('Error dismissing ticket update:', error);
            this.showModalError("Error dismissing updates");
            update.hasBeenDismissed = false; 
          }
        );
      }
    });
    this.closeDismissAllDialog();
  }
}