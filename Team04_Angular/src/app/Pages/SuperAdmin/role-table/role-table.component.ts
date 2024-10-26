import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SuperAdminDataServiceService } from '../../../Services/SuperAdmin/super-admin-data-service.service';
import { Role } from '../../../Classes/role-classes';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-role-table',
  templateUrl: './role-table.component.html',
  styleUrl: './role-table.component.scss'
})
export class RoleTableComponent implements OnInit {
  roles: Role[] = [];
  searchQuery: string = '';
  currentRole: Role = new Role;
  isEdit: boolean = false;
  @ViewChild('roleModal') roleModal!: TemplateRef<any>;
  private modalRef!: NgbModalRef;

  constructor(private dataService: SuperAdminDataServiceService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  async loadRoles(){
    this.dataService.GetAllRoles().subscribe(retrievedRoles => {
      this.roles = retrievedRoles;
      console.log(this.roles);
    });
  }

  openAddModal(): void {
    this.isEdit = false;
    this.currentRole = new Role();
    this.modalRef = this.modalService.open(this.roleModal);
  }

  openEditModal(role: Role): void {
    this.isEdit = true;
    this.currentRole = { ...role };
    this.modalRef = this.modalService.open(this.roleModal);
  }

  closeModal(): void {
    this.modalRef.close();
  }

  onSubmit(): void {
    if (this.isEdit) {
      this.dataService.EditRole(this.currentRole.id, this.currentRole).subscribe(() => {
        this.loadRoles();
        this.closeModal();
      });
    } else {
      this.dataService.AddRole(this.currentRole).subscribe(() => {
        this.loadRoles();
        this.closeModal();
      });
    }
  }

  DeleteRole(id: number){
    this.dataService.DeleteRole(id).subscribe(() => {
      this.loadRoles();
    });
  }

  searchRoles(): void {
    if (this.searchQuery) {
      this.roles = this.roles.filter((role: any) => (role.name.toLowerCase().includes(this.searchQuery.toLowerCase())));
    } else {
      this.loadRoles();
    }
  }
}
