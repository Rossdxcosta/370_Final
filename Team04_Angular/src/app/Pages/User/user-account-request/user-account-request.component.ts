import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { AccountRequestDTO, User_Account_creation_Request } from '../../../Classes/requests';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { Role } from '../../../Classes/role-classes';
import { SuperAdminDataServiceService } from '../../../Services/SuperAdmin/super-admin-data-service.service';
import { FormControl, FormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { AdminDataServiceService } from '../../../Services/Admin/admin-data-service.service';
import { delay } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Department } from '../../../Classes/department-classes';
import { DepartmentService } from '../../../Services/Department/department.service';
import { Company } from '../../../Classes/company';
import { CompanyService } from '../../../Services/Admin/company-service.service';
import { CompanyRequest } from '../../../Classes/companyRequest';

@Component({
  selector: 'app-user-account-request',
  templateUrl: './user-account-request.component.html',
  styleUrl: './user-account-request.component.scss',
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ]
})
export class UserAccountRequestComponent implements OnInit {
  roles: Role[] = [];
  departments: Department[] = [];
  selectedDepartmet: string = '';
  selectedRole: number = 0;
  request: User_Account_creation_Request = new User_Account_creation_Request;
  reason: string = '';
  alreadyRequested: boolean = false;
  selectedCompany: Company = new Company;
  companies: Company[] = [];
  companyRequest: CompanyRequest = new CompanyRequest;
  showErrorModal: Boolean = false;
  addCompanyModal: Boolean = false;
  showSuccessModal: Boolean = false;
  companyName: String = '';
  companyLocation: String = '';

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

  showModalInfo(message: string): void {
    this.infoMessage = message;
    this.showInfoModal = true;
  }

  closeInfoModal(): void {
    this.showInfoModal = false;
  }

  constructor(private adDataService: AdminDataServiceService, private dataService: UserServiceService, private adminService: SuperAdminDataServiceService, private departmentService: DepartmentService, private companyService: CompanyService){}

  ngOnInit(): void {
    this.adDataService.ViewAccountRequests().subscribe(e => {
      this.CheckAccountRequests(e);
    });
    this.adminService.GetAllRoles().subscribe( e => {
      this.roles = e;
    });
    this.loadDepartments();
    this.LoadCompanies();
  }

  loadDepartments(){
    this.departmentService.getDepartments().subscribe(e => {
      this.departments = e;
    });
  }

  LoadCompanies(){
    this.companyService.getAllCompanies().subscribe(e => {
      this.companies = e;
    })
  }

  onSubmit(){
    var userId = this.dataService.getUserIDFromToken();
    this.companyRequest.clientID = userId;
    this.companyRequest.companyName = this.companyName;
    this.companyRequest.companyLocation = this.companyLocation;
    this.closeModal();
    this.ShowModal();
    try {
      this.companyService.requestCompany(this.companyRequest);
    } catch (error) {
      this.showErrorModal = true;
    }
  }

  errorModal(){
    this.showErrorModal = true;
  }

  closeErrorModal(){
    this.showErrorModal = false;
  }

  showCompanyModal(){
    this.addCompanyModal = true;
  }

  ShowModal(){
    this.showSuccessModal = true;
  }

  closeModal(){
    this.addCompanyModal = false;
    this.showSuccessModal = false;
  }

  selectRole(role: string){
    this.selectedRole = Number(role);
  }

  CheckAccountRequests(requests: AccountRequestDTO[]){
    let user: string = this.dataService.getUserIDFromToken();
    for (let i = 0; i < requests.length; i++) {
      console.log(requests[i].request.user_ID);
      if (requests[i].request.user_ID == user) {
        this.alreadyRequested = true;
        console.log("REQUEST FOUND!");
      }      
    }
  }

  CreateNewAccountRequest(){
    if (this.reason != '' && this.selectedRole > 0){
      var userId = this.dataService.getUserIDFromToken();    
      this.request.reason = this.reason;
      this.request.role_ID = this.selectedRole;
      this.request.user_ID = userId;
      
      console.log(this.request)

      this.dataService.RequestAccount(this.request).subscribe(e => {
        this.alreadyRequested = true;
        this.RequestSuccess();
      });
    }
    else{
      this.showModalError("Please fill in all fields");
      return;
    }
  }

  RequestSuccess(){
    this.showModalSuccess("Your request was logged. Please be patient while our staff reviews yur request");
  }
}
