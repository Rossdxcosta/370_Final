import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SuperAdminDataServiceService } from '../../../Services/SuperAdmin/super-admin-data-service.service';
import { User } from '../../../Classes/users-classes';
import { Role } from '../../../Classes/role-classes';
import { Department } from '../../../Classes/department-classes';

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.scss'],
})
export class AdminTableComponent implements OnInit, AfterViewInit {
  admins: User[] = [];
  filteredAdmins: User[] = [];
  searchQuery: string = '';
  currentAdmin: User = new User();
  users: User[] = [];
  roles: Role[] = [];
  departments: Department[] = [];
  User_ID: string = '';
  updatedDepartment: string = 'basic';
  updatedRole: string = 'basic';

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  // Modal state
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  adminToDelete: string | null = null;

  constructor(private superAdminService: SuperAdminDataServiceService) {}

  ngOnInit(): void {
    this.loadPagination();
  }

  loadPagination(): void {
    this.totalItems = this.admins.length;
    this.updateDataSource();
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  onAddSubmit() {
    if (this.User_ID) {
      this.superAdminService.AssignAdmin(this.User_ID).subscribe(admins => {
        this.GetAllAdmins();
        this.closeAddModal();
      });
    }
  }

  openEditModal(admin: User): void {
    this.currentAdmin = { ...admin };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  onEditSubmit() {
    if (this.currentAdmin && this.updatedDepartment !== "basic" && this.updatedRole !== "basic") {
      this.currentAdmin.department_ID = Number(this.updatedDepartment);
      this.currentAdmin.role_ID = Number(this.updatedRole);

      this.superAdminService.UpdateAdmin(this.currentAdmin.user_ID, this.currentAdmin).subscribe(e => {
        this.GetAllAdmins();
        this.closeEditModal();
      });
    } else {
      window.alert("Please input all fields");
    }
  }

  openDeleteModal(adminId: string): void {
    this.adminToDelete = adminId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.adminToDelete = null;
  }

  confirmDelete(): void {
    if (this.adminToDelete) {
      this.superAdminService.DeleteAdmin(this.adminToDelete).subscribe(e => {
        this.GetAllAdmins();
        this.closeDeleteModal();
      });
    }
  }

  ngAfterViewInit() {
    this.GetAllAdmins();
    this.GetAllUsers();
    this.GetAllRoles();
    this.GetAllDepartments();
  }

  getUserID(id: string) {
    this.User_ID = id;
  }

  GetAllAdmins() {
    this.superAdminService.GetAllAdmins().subscribe(admins => {
      this.admins = admins;
      this.filteredAdmins = admins;
      this.totalItems = admins.length;
      this.updateDataSource();
    });
  }

  GetAllUsers() {
    this.superAdminService.GetAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  GetAllRoles() {
    this.superAdminService.GetAllRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  GetAllDepartments() {
    this.superAdminService.GetAllDepartments().subscribe(depts => {
      this.departments = depts;
    });
  }

  searchUsers(): void {
    if (this.searchQuery) {
      this.filteredAdmins = this.admins.filter(admin => 
        admin.user_Name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        admin.user_Surname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredAdmins = [...this.admins];
    }
    this.totalItems = this.filteredAdmins.length;
    this.updateDataSource();
  }

  updateDataSource(filteredAdmins: User[] = this.filteredAdmins): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.filteredAdmins = filteredAdmins.slice(start, end);
  }

  onPageChange(event: { pageIndex: number, pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  handleDepartmentChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.updatedDepartment = target.value;
  }

  handleRoleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.updatedRole = target.value;
  }
}
