import { AfterViewChecked, AfterViewInit, Component, ComponentFactoryResolver, HostBinding, signal, ViewChild, ViewContainerRef } from "@angular/core";
import { AuthService } from "../../../Services/Login/auth.service";
import { TagsComponent } from "../../Tickets/Tags/tags/tags.component";
import { Router, RouterLink } from "@angular/router";
import { TicketManagementComponent } from "../ticket-management/ticket-management.component";
import { FeedbackManagementComponent } from "../feedback-management/feedback-management.component";
import { TicketGroupListComponent } from "../../TicketGroup/ticket-group-list/ticket-group-list.component";
import { DeactivationRequestComponent } from "../../User/deactivation-request/deactivation-request.component";
import { User_Account_Deactivate_Request } from "../../../Classes/requests";
import { MatDialog } from "@angular/material/dialog";
import { UserServiceService } from "../../../Services/Users/user-service.service";
import { LogoutComponent } from "../../logout/logout.component";
import { CommonModule } from "@angular/common";
import { ProfileIconComponent } from '../../Profile/profile-icon/profile-icon.component';
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { OpenChatsComponent } from "../open-chats/open-chats.component";
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from "../../Calendar/calendar/calendar.component";
import { EmployeeCurrentPerformanceComponent } from "../employee-reports/employee-reports.component";

@Component({
  selector: "app-employee-dashboard",
  templateUrl: "./employee-dashboard.component.html",
  styleUrl: "./employee-dashboard.component.scss",
  standalone: true,
  imports:[MatMenuModule, MatButtonModule, ProfileIconComponent, CommonModule, FullCalendarModule, EmployeeCurrentPerformanceComponent]
})
export class employeeDashboardComponent implements AfterViewInit {

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

  //////////////////////////////////////////////////////////////////////////////////// DARKMODE ENDS

  username: string = '';
  showMenu: boolean = false;

  userDRequest: User_Account_Deactivate_Request =
    new User_Account_Deactivate_Request();

  @ViewChild("dynamicComponentContainer", { read: ViewContainerRef })
  dynamicComponentContainer!: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService,
    private userService: UserServiceService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  updateUser(){
    this.router.navigateByUrl("Update-User")
  }

  showMenuModal() {
    this.showMenu = true;
  }
  
  closeMenuModal() {
    this.showMenu = false;
  }

  ngAfterViewInit(): void {
    this.LoadCalendar();
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

  ngOnInit(): void {
    //console.log(this.userService.getUserIDFromToken())
    this.userDRequest.userID = this.userService.getUserIDFromToken();
    this.userService.GetUser().subscribe(e => {
      this.username =  e.user_Name + ' ' + e.user_Surname;
    });
    this.darkMode.set(this.getDarkMode());
  }

  requestDeactivation(request: User_Account_Deactivate_Request) {
    if (!this.userService.getUserIDFromToken()) {
      alert("You are not logged in");
    } else {
      this.userService.RequestDeactivation(request).subscribe(
        (a) => {},
        (error) => {
          console.error(error);
          //this.errorMessage = 'Registration failed.';
        }
      );
    }
  }

  openDialog(request: User_Account_Deactivate_Request): void {
    const dialogRef = this.dialog.open(DeactivationRequestComponent, {
      data: request,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed", result);
      this.requestDeactivation(result);
    });
  }

  LoadTags() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(TagsComponent);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadCalendar() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        CalendarComponent
      );
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadTicketTable() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        TicketManagementComponent
      );
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadFeedback() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        FeedbackManagementComponent
      );
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadReports() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        EmployeeCurrentPerformanceComponent
      );
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadTicketGroups() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        TicketGroupListComponent
      );
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadOpenChats() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        OpenChatsComponent
      );
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  // logout(){
  //     this.authService.logout()
  // }
  logout(): void {
    const dialogRef = this.dialog.open(LogoutComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}
