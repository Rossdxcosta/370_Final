import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { UserServiceService } from "../../../Services/Users/user-service.service";
import {
  AccountRequestDTO,
  User_Account_Request,
} from "../../../Classes/requests";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { AdminDataServiceService } from "../../../Services/Admin/admin-data-service.service";

@Component({
  selector: "app-deactivation-requests",
  templateUrl: "./deactivation-requests.component.html",
  styleUrl: "./deactivation-requests.component.scss",
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatPaginatorModule, CommonModule],
})
export class DeactivationRequestsComponent implements OnInit {
  requests!: User_Account_Request[];
  displayedColumns: string[] = [
    "Name",
    "Surname",
    "Email",
    "Role",
    "Reason",
    "Controls",
  ];
  showApproveRequestModal: boolean = false;
  showDenyRequestModal: boolean = false;
  requestId: number = 0;
  userId: string = "";

  // Loading Section
  isLoading: boolean = true;
  isData: boolean = false;
  isTableData: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserServiceService,
    private service: AdminDataServiceService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.userService.GetAllDeactRequests().subscribe((data) => {
      this.requests = data;
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

  DeactivateUser(ID: string) {
    this.userService.DeactivateAccount(ID).subscribe((data) => {
    });
  }

  AcceptRequest(id: string) {
    this.userService.DeactivateAccount(id).subscribe((e) => {
      this.loadRequests();
      this.closeAcceptModal();
    });
  }

  DenyRequest(id: number) {
    this.service.DenyAccountRequest(id).subscribe((e) => {
      this.loadRequests();
      this.closeDenyModal();
    });
  }

  openAcceptModal(id: string) {
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
