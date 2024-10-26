import { Component } from "@angular/core";
import { AccountRequestDTO } from "../../../Classes/requests";
import { AdminDataServiceService } from "../../../Services/Admin/admin-data-service.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-account-requests",
  templateUrl: "./account-requests.component.html",
  styleUrl: "./account-requests.component.scss",
  standalone: true,
  imports: [CommonModule],
})
export class AccountRequestsComponent {
  // Loading Section
  isLoading: boolean = true;
  isData: boolean = false;
  isTableData: boolean = false;

    // Modal control properties
    showCloseConfirmModal: boolean = false;
showReopenConfirmModal: boolean = false;
  showApproveRequestModal: boolean = false;
  showDenyRequestModal: boolean = false;

  requests: AccountRequestDTO[] = [];
  requestId: number = 0;
  userId: number = 0;

  constructor(private dataService: AdminDataServiceService) {}

  ngOnInit(): void {
    this.ViewAdminRequests();
  }

  ViewAdminRequests() {
    this.dataService.ViewAccountRequests().subscribe((e) => {
      this.requests = e;
      this.isLoading = false;

      if (this.requests.length > 0) {
        this.isData = true;
        this.isTableData = true;
      } else {
        this.isData = false;
        this.isTableData = false;
      }
    });
  }

  AcceptRequest(id: number) {
    this.dataService.AcceptAccountRequest(id).subscribe((e) => {
      this.ViewAdminRequests();
      this.closeAcceptModal();
    });
  }

  denyRequest(id: number) {
    this.dataService.DenyAccountRequest(id).subscribe((e) => {
      this.ViewAdminRequests();
      this.closeDenyModal();
    });
  }

  openAcceptModal(id: number) {
    this.showApproveRequestModal = true;
    this.userId = id;
  }

  closeAcceptModal() {
    this.showApproveRequestModal = false;
  }

  openDenyModal(id: number) {
    this.showDenyRequestModal = true;
    this.requestId = id;
  }

  closeDenyModal() {
    this.showDenyRequestModal = false;
  }
}
