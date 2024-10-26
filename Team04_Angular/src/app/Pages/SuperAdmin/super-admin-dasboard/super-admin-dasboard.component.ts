import { AfterViewInit, Component, ComponentFactoryResolver, HostBinding, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { AdminRoleRequestTableComponent } from '../admin-role-request-table/admin-role-request-table.component';
import { AdminTableComponent } from '../admin-table/admin-table.component';
import { RoleTableComponent } from '../role-table/role-table.component';
import { AuditLogComponent } from '../audit-log/audit-log.component';
import { TagsComponent } from '../../Tickets/Tags/tags/tags.component';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { AuthService } from '../../../Services/Login/auth.service';
import { User_Account_Deactivate_Request } from '../../../Classes/requests';
import { MatDialog } from '@angular/material/dialog';
import { DeactivationRequestComponent } from '../../User/deactivation-request/deactivation-request.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ProfileIconComponent } from '../../Profile/profile-icon/profile-icon.component';
import { LogoutComponent } from '../../logout/logout.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AWelcomePageComponent } from '../../Admin/a-welcome-page/a-welcome-page.component';
import { ReportingComponent } from '../../reporting/reporting.component';
import { UserRoleTableComponent } from '../../Admin/user-role-table/user-role-table.component';
import { TrainChatbotComponent } from '../../AI_Engineer/train-chatbot/train-chatbot.component';
import { VDIComponent } from '../../Admin/VDI-manager/VDI-manager.component';
import { AccountRequestsComponent } from '../../Admin/account-requests/account-requests.component';
import { DeactivationRequestsComponent } from '../../Admin/deactivation-requests/deactivation-requests.component';
import { AdminEscalationRequestsComponent } from '../../Admin/escalation-requests/admin-escalation-requests/admin-escalation-requests.component';
import { ListFAQComponent } from '../../Admin/faq/list-faq/list-faq.component';
import { SoftwareComponent } from '../../Admin/software/software.component';
import { PriorityComponent } from '../../Admin/status-editor/status-editor.component';
import { TicketTableComponent } from '../../Admin/ticket-table/ticket-table.component';
import { TicketGroupListComponent } from '../../TicketGroup/ticket-group-list/ticket-group-list.component';
import { DepartmentComponent } from '../department/department.component';
import { FeedbackManagementSadmin } from '../feedback-management/feedback-management.component';
import { CompanyManagerComponent } from '../../Admin/company/company-manager.component';
import { VDIRequestsComponent } from '../../Admin/software-req/software-req.component';






@Component({
  selector: 'app-super-admin-dasboard',
  templateUrl: './super-admin-dasboard.component.html',
  styleUrl: './super-admin-dasboard.component.scss',
  standalone: true,
  imports:[MatMenuModule, MatButtonModule, ProfileIconComponent, CommonModule]
})
export class SuperAdminDasboardComponent implements AfterViewInit{

    //////////////////////////////////////////////////////////////////////////////////// DARKMODE STARTS

    darkMode = signal<boolean>(false);
    @HostBinding('class.dark') get mode() {
      return this.darkMode();
    }
  
    setDarkMode(){
      this.darkMode.set(!this.darkMode());
      
      localStorage.setItem('darkMode', this.darkMode.toString());
    }
  
    getDarkMode(){
      console.log(localStorage.getItem('darkMode'));
      if (localStorage.getItem('darkMode') == '[Signal: true]') {
        return true;
      }
      else{
        return false;
      };
    }
  
    /////////////////////////////////////////////////////////////////////////////////// DARKMODE ENDS

  username: string = '';
  showMenu: boolean = false;

  userDRequest: User_Account_Deactivate_Request = new User_Account_Deactivate_Request();

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private userService: UserServiceService, private authService: AuthService, public dialog: MatDialog, private router: Router) {}

  updateUser(){
    this.router.navigateByUrl("Update-User")
  }

  ngOnInit(): void{
    //console.log(this.userService.getUserIDFromToken())
    this.userDRequest.userID = this.userService.getUserIDFromToken();
    this.userService.GetUser().subscribe(e => {
      this.username =  e.user_Name + ' ' + e.user_Surname;
    });
    this.darkMode.set(this.getDarkMode());
  }

  showMenuModal(): void {
    this.showMenu = true;
  }

  closeMenuModal(): void {
    this.showMenu = false;
  }

  requestDeactivation(request: User_Account_Deactivate_Request) {
    if (!this.userService.getUserIDFromToken()) {
      alert('You are not logged in')
    } else {
      
    this.userService.RequestDeactivation(request).subscribe(a => { }, error => {
      console.error(error);
      //this.errorMessage = 'Registration failed.';
    })
    }
    
  }

  openDialog(request: User_Account_Deactivate_Request): void {
    const dialogRef = this.dialog.open(DeactivationRequestComponent, {
      data: request,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.requestDeactivation(result)
    });
  }

  ngAfterViewInit(){
    this.LoadWelcomePage();
  }

  downloadManuals() {
    const manualsPath = 'assets/Manuals/';

    // Define the file URLs
    const files = ['TrainingManual.pdf', 'UserManual.pdf'];
  
    // Open each file in a new tab with a small delay
    files.forEach((file, index) => {
      const url = `${manualsPath}${file}`;
      
      setTimeout(() => {
        window.open(url, '_blank');
      }, index * 500); // Delay of 500ms between each tab opening
    });
  }
  
  LoadWelcomePage() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AWelcomePageComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadAdminTable() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AdminTableComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  // LoadAdminTable() {
  //   const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AdminTableComponent);
  //   this.dynamicComponentContainer.clear();
  //   const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  // }

  LoadRolesTable(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(RoleTableComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadTagTable(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TagsComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadAuditLogTable(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AuditLogComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadDepartmentTable(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DepartmentComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadRoleRequestTable(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AdminRoleRequestTableComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadReporting(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ReportingComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadUserRoleTable() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UserRoleTableComponent);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
   }

   LoadUserFeedback() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(FeedbackManagementSadmin);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
   }
 
   LoadTicketTable() {
     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TicketTableComponent);
     this.dynamicComponentContainer.clear();
     this.dynamicComponentContainer.createComponent(componentFactory);
    }
    LoadEscalationRequests() {
     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AdminEscalationRequestsComponent);
     this.dynamicComponentContainer.clear();
     this.dynamicComponentContainer.createComponent(componentFactory);
    }
    LoadBreachTimer() {
     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PriorityComponent);
     this.dynamicComponentContainer.clear();
     this.dynamicComponentContainer.createComponent(componentFactory);
    }
 
    LoadCompany() {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompanyManagerComponent);
      this.dynamicComponentContainer.clear();
      this.dynamicComponentContainer.createComponent(componentFactory);
    }
    
   LoadDeactivateReqTable() {
     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DeactivationRequestsComponent);
     this.dynamicComponentContainer.clear();
     this.dynamicComponentContainer.createComponent(componentFactory);
    }
 
    LoadTrainChatbot() {
     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TrainChatbotComponent);
     this.dynamicComponentContainer.clear();
     this.dynamicComponentContainer.createComponent(componentFactory);
    }

    LoadSoftwareReq() {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(VDIRequestsComponent);
      this.dynamicComponentContainer.clear();
      this.dynamicComponentContainer.createComponent(componentFactory);
    }
 
   LoadAccountRequestTable() {
   const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AccountRequestsComponent);
   this.dynamicComponentContainer.clear();
   this.dynamicComponentContainer.createComponent(componentFactory);
   }
 
   LoadFAQTable() {
     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ListFAQComponent);
     this.dynamicComponentContainer.clear();
     this.dynamicComponentContainer.createComponent(componentFactory);
   }
 
   LoadSoftware() {
     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SoftwareComponent);
     this.dynamicComponentContainer.clear();
     this.dynamicComponentContainer.createComponent(componentFactory);
   }
 
   LoadVDI() {
     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(VDIComponent);
     this.dynamicComponentContainer.clear();
     this.dynamicComponentContainer.createComponent(componentFactory);
   }
 
   LoadTicketGroups() {
     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TicketGroupListComponent);
     this.dynamicComponentContainer.clear();
     this.dynamicComponentContainer.createComponent(componentFactory);
    }

  logout(): void {
    const dialogRef = this.dialog.open(LogoutComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}