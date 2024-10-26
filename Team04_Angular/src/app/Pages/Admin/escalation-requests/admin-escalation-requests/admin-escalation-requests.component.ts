import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../../Services/Ticket/ticket.service';
import { EscalationRequestDto } from '../../../../Classes/escalation-request-dto';

@Component({
  selector: 'app-admin-escalation-requests',
  templateUrl: './admin-escalation-requests.component.html',
  styleUrls: ['./admin-escalation-requests.component.scss']
})
export class AdminEscalationRequestsComponent implements OnInit {
  escalationRequests: EscalationRequestDto[] = [];
  employees: any[] = [];
  selectedEmployeeId: string | null = null;
  showDenyModal: boolean = false;
  showAcceptModal: boolean = false;
  currentRequest: EscalationRequestDto | null = null;
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

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadEscalationRequests();
  }

  loadEscalationRequests(): void {
    this.ticketService.getEscalationRequests().subscribe((requests: EscalationRequestDto[]) => {
      this.escalationRequests = requests;
    }, error => {
      this.showModalError("Error loading requests");
    });
  }

  acceptRequest(request: EscalationRequestDto): void {
    this.currentRequest = request;

    if (request.departmentId) {
      this.ticketService.getEmployeesByDepartment(request.departmentId).subscribe((employees: any[]) => {
        this.employees = employees;
        this.showAcceptModal = true;
      }, error => {
        this.showModalError("Error loading employees");
      });
    } else {
      this.showModalError("Nodepartment linked to this request");
    }
  }

  denyRequest(request: EscalationRequestDto): void {
    this.currentRequest = request;
    this.showDenyModal = true;
  }

  confirmDeny(): void {
    if (this.currentRequest) {
      this.ticketService.processEscalationRequest({
        escalationId: this.currentRequest.escalationId,
        accept: false,
        newEmployeeId: null
      }).subscribe(() => {
        this.showModalSuccess("Request denied succesfully");
        this.loadEscalationRequests();
        this.closeDenyModal();
      }, error => {
        this.showModalError("Error processing request");
      });
    }
  }

  confirmAccept(): void {
    if (this.currentRequest && this.selectedEmployeeId) {
      this.ticketService.processEscalationRequest({
        escalationId: this.currentRequest.escalationId,
        accept: true,
        newEmployeeId: this.selectedEmployeeId
      }).subscribe(() => {
        this.showModalSuccess("Ticket reassigned succesfully");
        this.loadEscalationRequests();
        this.closeAcceptModal();
      }, error => {
        this.showModalError("Error processing request");
      });
    }
  }

  closeDenyModal(): void {
    this.showDenyModal = false;
    this.currentRequest = null;
  }

  closeAcceptModal(): void {
    this.showAcceptModal = false;
    this.currentRequest = null;
    this.selectedEmployeeId = null;
  }
}
