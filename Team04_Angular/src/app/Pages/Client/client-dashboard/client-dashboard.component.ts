import { AfterViewInit, Component, ComponentFactoryResolver, HostBinding, OnDestroy, OnInit, signal, Signal, ViewChild, ViewContainerRef } from '@angular/core';
import { AdminTableComponent } from '../../SuperAdmin/admin-table/admin-table.component';
import { CreateTicketComponent } from '../../Ticket/create-ticket/create-ticket.component';
import { DisplayTicketComponent } from '../../Ticket/display-ticket/display-ticket.component';
import { SubmitFeedbackComponent } from '../../Client/client-feedback/client-feedback.component';
import { AuthService } from '../../../Services/Login/auth.service';
import { ChatbotLandingComponent } from '../../Chatbot/chatbot-landing/chatbot-landing.component';
import { TicketUpdatesComponent } from '../../Ticket/ticket-updates/ticket-updates.component';
import { ReopenTicketComponent } from '../../Ticket/reopen-ticket/reopen-ticket.component';
import { RentVDIComponent } from '../../Client/rent-vdi/rent-vdi.component';
import { Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ProfileIconComponent } from '../../Profile/profile-icon/profile-icon.component';
import { User_Account_Deactivate_Request } from '../../../Classes/requests';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DeactivationRequestComponent } from '../../User/deactivation-request/deactivation-request.component';
import { LogoutComponent } from '../../logout/logout.component';
import { SoftwareRequestComponent } from '../software-request/software-request.component';
import { ChatbotService } from '../../../Services/Chatbot/chatbot.service';
import { CommonModule } from '@angular/common';
import { TicketCreationToggleService } from '../../../ticket-creation-toggle.service';
import { Subscription } from 'rxjs';
import { FaqListComponent } from '../../FAQ/faq-list/faq-list.component';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, ProfileIconComponent, CommonModule, RouterLink]
})
export class ClientDashboardComponent implements AfterViewInit, OnInit, OnDestroy {

  email!: string
  //////////////////////////////////////////////////////////////////////////////////// DARKMODE STARTS

  darkMode = signal<boolean>(false);
  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

  setDarkMode() {
    this.darkMode.set(!this.darkMode());

    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  getDarkMode() {
    console.log(localStorage.getItem('darkMode'));
    if (localStorage.getItem('darkMode') == '[Signal: true]') {
      return true;
    }
    else {
      return false;
    };
  }

  /////////////////////////////////////////////////////////////////////////////////// DARKMODE ENDS

  ticketCreationOn: boolean = false;
  private subscription!: Subscription;

  username: string = '';
  showMenu: boolean = false;
    
  highlightedButton: string = '';
  userDRequest: User_Account_Deactivate_Request = new User_Account_Deactivate_Request();

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService,
    private userService: UserServiceService,
    public dialog: MatDialog,
    private router: Router,
    private chatbotService: ChatbotService,
    private ticketCreationService: TicketCreationToggleService
  ) { }

  updateUser() {
    this.router.navigateByUrl("Update-User")
  }

  showMenuModal() {
    this.showMenu = true;
  }

  closeMenuModal() {
    this.showMenu = false;
  } 

  ngAfterViewInit() {
    this.LoadClientViewTickets();
    this.userService.GetUser().subscribe(e => {
      this.username =  e.user_Name + ' ' + e.user_Surname;
    });
  }

  LoadCreateTicket() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CreateTicketComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadClientViewTickets() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DisplayTicketComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadTicketUpdates() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TicketUpdatesComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadChatbot() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChatbotLandingComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadVDIComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(RentVDIComponent);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadFeedbackComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SubmitFeedbackComponent);
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadReopenTickets() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ReopenTicketComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadRequestSoftware() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SoftwareRequestComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  highlightButton(buttonName: string): void {
    this.highlightedButton = buttonName;

    if (buttonName === 'createTicket') {
      this.LoadCreateTicket();
    }
    if (buttonName === 'viewAllTickets') {
      this.LoadClientViewTickets();
    }
    if (buttonName === 'chatbot') {
      this.LoadChatbot();
    }
    if (buttonName === 'ticketUpdates') {
      this.LoadTicketUpdates();
    }
    if (buttonName === 'viewAllTickets') {
      this.LoadClientViewTickets();
    }
    if (buttonName === 'reopenTickets') {
      this.LoadReopenTickets();
    }
    if (buttonName === 'SubmitFeedbackComponent') {
      this.LoadFeedbackComponent();
    }
    if (buttonName === 'RentVDIComponent') {
      this.LoadVDIComponent();
    }
    if (buttonName === 'ReqSoftComponent') {
      this.LoadRequestSoftware();
    }
  }

  logout(): void {
    const dialogRef = this.dialog.open(LogoutComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
      }
    })
  }

  LoadFAQ(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(FaqListComponent);
    this.dynamicComponentContainer.clear();
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  ngOnInit(): void {
    //console.log(this.userService.getUserIDFromToken())
    this.userDRequest.userID = this.userService.getUserIDFromToken();
    this.darkMode.set(this.getDarkMode());
    this.subscription = this.ticketCreationService.ticketCreation$.subscribe((status) => {
      this.ticketCreationOn = status;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  requestDeactivation(request: User_Account_Deactivate_Request) {
    if (!this.userService.getUserIDFromToken()) {
      alert('You are not logged in')
    } else {

      this.userService.RequestDeactivation(request).subscribe(a => { }, error => {
        console.error(error);
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

  async goToChat() {
    this.email = this.authService.getUserEmailFromToken()
    await this.chatbotService.startChat(this.userService.getUserIDFromToken()).subscribe(email => { console.log(email); this.router.navigateByUrl("chatbot-landing/" + email) })
  }
}
