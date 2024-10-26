import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { AdminDataServiceService } from "../../../Services/Admin/admin-data-service.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ChangeDetectorRef } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TicketDTO } from "../../../Classes/ticket.classes";
import { User } from "../../../Classes/users-classes";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-user-table",
  templateUrl: "./user-role-table.component.html",
  styleUrls: ["./user-role-table.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class UserRoleTableComponent implements OnInit, AfterViewInit {
  // Used in the pagination
  dataSource = new MatTableDataSource<User>([]);

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  // Loading Section
  isLoading: boolean = true;
  isData: boolean = true;
  isTableData: boolean = true;

  users: any[] = [];
  paginatedUsers: any[] = [];
  roles: any[] = [];
  currentUser: any = {};
  searchQuery: string = "";
  updateRoleModal: boolean = false;
  removeRoleModal: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private modalRef!: NgbModalRef;

  private readonly ADMIN_ROLE_ID = 4;
  private readonly SUPER_ADMIN_ROLE_ID = 5;

  constructor(
    private dataService: AdminDataServiceService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe((event: PageEvent) => {
      this.onPageChange(event);
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.dataService.GetAllUsers().subscribe({
      next: (retrievedUsers) => {
        console.log("Users loaded:", retrievedUsers);
        this.dataSource.data = retrievedUsers.filter(
          (user) =>
            user.role_ID !== this.ADMIN_ROLE_ID &&
            user.role_ID !== this.SUPER_ADMIN_ROLE_ID &&
            user.isActive
        );
        this.isLoading = false;
        if (retrievedUsers.length > 0) {
          this.isData = true;
          this.isTableData = true;
        } else {
          this.isData = false;
          this.isTableData = false;
        }
        this.users = retrievedUsers.filter(
          (user) =>
            user.role_ID !== this.ADMIN_ROLE_ID &&
            user.role_ID !== this.SUPER_ADMIN_ROLE_ID &&
            user.isActive
        ); // Initialize pagination
        this.totalItems = this.dataSource.data.length;
        this.pageIndex = 0;
        this.updateDataSource();
      },
      error: (err) => {
        console.error("Error loading users:", err);
      },
    });
  }

  loadRoles(): void {
    this.dataService.GetAllRoles().subscribe({
      next: (retrievedRoles) => {
        console.log("Roles loaded:", retrievedRoles);
        this.roles = retrievedRoles;
      },
      error: (err) => {
        console.error("Error loading roles:", err);
      },
    });
  }

  removeUserRole(id: string): void {
    this.dataService.RemoveUserRole(id).subscribe({
      next: (response) => {
        console.log("Response:", response);
        this.loadUsers();
        this.modalRef.close();
      },
      error: (err) => {
        console.error("Error removing user role:", err);
      },
    });
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown";
  }

  openRoleModal(user: any): void {
    if (
      user.role_ID === this.ADMIN_ROLE_ID ||
      user.role_ID === this.SUPER_ADMIN_ROLE_ID
    ) {
      alert("You cannot update the role of an admin or super admin.");
      return;
    }
    this.currentUser = { ...user };
    this.updateRoleModal = true;
  }

  openRemoveRoleModal(user: any): void {
    if (
      user.role_ID === this.ADMIN_ROLE_ID ||
      user.role_ID === this.SUPER_ADMIN_ROLE_ID
    ) {
      alert("You cannot remove the role of an admin or super admin.");
      return;
    }
    this.currentUser = { ...user };
    this.removeRoleModal = true;
  }

  onRoleSubmit(): void {
    if (
      this.currentUser.role_ID === this.ADMIN_ROLE_ID ||
      this.currentUser.role_ID === this.SUPER_ADMIN_ROLE_ID
    ) {
      alert("You cannot update the role of an admin or super admin.");
      return;
    }
    this.dataService
      .UpdateUserRole(this.currentUser.user_ID, this.currentUser.role_ID)
      .subscribe({
        next: () => {
          this.loadUsers();
          this.cdr.detectChanges();
          this.closeModal();
        },
        error: (err) => {
          console.error("Error updating user role:", err);
        },
      });
  }

  closeModal(): void {
    this.removeRoleModal = false;
    this.updateRoleModal = false;
  }

  confirmRemoveRole(): void {
    this.removeUserRole(this.currentUser.user_ID);
    this.closeModal();
  }

  search(): void {
    this.isTableData = false;
    console.log(this.searchQuery);
    if (this.searchQuery) {
      this.dataSource.data = this.users.filter(
        (user: any) =>
          this.getRoleName(user.role_ID)
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          user.user_Name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      if (this.dataSource.data.length > 0) {
        this.isTableData = true;
      }
      this.pageIndex = 0;
      this.isTableData = true;
      this.totalItems = this.dataSource.data.length;
    } else {
      this.loadUsers();
      this.isTableData = true;
    }
  }

  // onPageChange(event: PageEvent): void {
  //   const startIndex = event.pageIndex * event.pageSize;
  //   const endIndex = startIndex + event.pageSize;
  //   this.paginateUsers(startIndex, endIndex);
  // }

  // Update Table from Pgination
  updateDataSource() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.dataSource.data = this.users.slice(start, end);
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
