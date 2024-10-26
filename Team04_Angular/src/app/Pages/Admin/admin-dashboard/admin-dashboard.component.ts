import { AfterViewInit, Component, ComponentFactoryResolver, HostBinding, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { AWelcomePageComponent } from '../a-welcome-page/a-welcome-page.component';
import { AuthService } from '../../../Services/Login/auth.service';
import { UserRoleTableComponent } from '../user-role-table/user-role-table.component'; 
import { DeactivationRequestsComponent } from '../deactivation-requests/deactivation-requests.component';
import { TicketTableComponent } from '../ticket-table/ticket-table.component';
import { AccountRequestsComponent } from '../account-requests/account-requests.component';
import { ListFAQComponent } from '../faq/list-faq/list-faq.component';
import { ReportingComponent } from '../../reporting/reporting.component';
import { TicketGroupListComponent } from '../../TicketGroup/ticket-group-list/ticket-group-list.component';
import { VDIComponent } from '../VDI-manager/VDI-manager.component';
import { TrainChatbotComponent } from '../../AI_Engineer/train-chatbot/train-chatbot.component';
import { PriorityComponent } from '../../../Pages/Admin/status-editor/status-editor.component';
import { AdminEscalationRequestsComponent } from '../escalation-requests/admin-escalation-requests/admin-escalation-requests.component';
import { ProfileIconComponent } from '../../Profile/profile-icon/profile-icon.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { DeactivationRequestComponent } from '../../User/deactivation-request/deactivation-request.component';
import { MatDialog } from '@angular/material/dialog';
import { User_Account_Deactivate_Request } from '../../../Classes/requests';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { LogoutComponent } from '../../logout/logout.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersTabComponent } from './users-tab/users-tab.component';
import { CompanyManagerComponent } from '../company/company-manager.component';
import { FeedbackManagementComp } from '../feedback-management/feedback-management.component';
import { TagsComponent } from '../../Tickets/Tags/tags/tags.component';
import { VDIRequestsComponent } from '../../Admin/software-req/software-req.component';
import { SftRequestsComponent } from '../../Admin/software-request/software-request.component';
import { SoftwareComponent } from '../../Admin/software/software.component';




@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone:true,
  imports:[MatMenuModule, MatButtonModule, ProfileIconComponent, CommonModule]
})
export class AdminDashboardComponent implements AfterViewInit {

  //////////////////////////////////////////////////////////////////////////////////// DARKMODE STARTS

  darkMode = signal<boolean>(false);
  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

  setDarkMode(){
    this.darkMode.set(!this.darkMode());

    if (this.getDarkMode()) {
      localStorage.setItem('textColor', 'black');
    }
    else{
      localStorage.setItem('textColor', 'white');
    }
    
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

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private authService: AuthService,public dialog: MatDialog, private userService: UserServiceService, private router: Router) {}
  //
  updateUser(){
    this.router.navigateByUrl("Update-User")
  }

  userDRequest: User_Account_Deactivate_Request = new User_Account_Deactivate_Request();


  ngAfterViewInit() {
    this.LoadWelcomePage();
  }
  ngOnInit(): void{
    //console.log(this.userService.getUserIDFromToken())
    this.userService.GetUser().subscribe(e => {
      this.username =  e.user_Name + ' ' + e.user_Surname;
    });
    this.userDRequest.userID = this.userService.getUserIDFromToken();
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
  

  openDialog(request: User_Account_Deactivate_Request): void {
    const dialogRef = this.dialog.open(DeactivationRequestComponent, {
      data: request,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.requestDeactivation(result)
    });
  }

  LoadWelcomePage() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AWelcomePageComponent);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadUserRoleTable() {
   const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UserRoleTableComponent);
   this.dynamicComponentContainer.clear();
   this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadCompanyTable(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompanyManagerComponent);
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
  
  LoadTagTable(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TagsComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadSoftwareReq() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(VDIRequestsComponent);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadSoftwareRequest() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(VDIRequestsComponent);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }
  
  LoadSoftware() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SftRequestsComponent);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadSoftwarecomp() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SoftwareComponent);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadVDI() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(VDIComponent);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }
  LoadCompany() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompanyManagerComponent);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }
  LoadFeedback() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(FeedbackManagementComp);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadReporting() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ReportingComponent);
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
