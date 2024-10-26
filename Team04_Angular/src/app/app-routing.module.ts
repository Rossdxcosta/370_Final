import { UpdateUserComponent } from './Pages/User/update-user/update-user.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./Pages/Login/login/login.component";
import { HomeComponent } from "./Pages/Home/home.component";
import { UserDashboardComponent } from "./Pages/User/user-dashboard/user-dashboard.component";
import { TestsComponent } from "./Pages/Tests/tests.component";
import { CreateUserComponent } from "./Pages/User/create-user/create-user.component";
import { SuperAdminDasboardComponent } from "./Pages/SuperAdmin/super-admin-dasboard/super-admin-dasboard.component";
import { ClientDashboardComponent } from "./Pages/Client/client-dashboard/client-dashboard.component";
import { CreateTicketComponent } from "./Pages/Ticket/create-ticket/create-ticket.component";
import { TagsComponent } from "./Pages/Tickets/Tags/tags/tags.component";
import { AdminDashboardComponent } from "./Pages/Admin/admin-dashboard/admin-dashboard.component";
import { employeeDashboardComponent } from "./Pages/Employee/employee-dashboard/employee-dashboard.component";
import { DisplayTicketComponent } from "./Pages/Ticket/display-ticket/display-ticket.component";
import { ChatbotLandingComponent } from "./Pages/Chatbot/chatbot-landing/chatbot-landing.component";
import { ListFAQComponent } from "./Pages/Admin/faq/list-faq/list-faq.component";
import { FaqListComponent } from "./Pages/FAQ/faq-list/faq-list.component";
import { ReportingComponent } from "./Pages/reporting/reporting.component";
import { ChangePasswordComponent } from "./Pages/Login/change-password/change-password.component";
import { TicketGroupListComponent } from "./Pages/TicketGroup/ticket-group-list/ticket-group-list.component";
import { AddToTicketGroupComponent } from "./Pages/TicketGroup/add-to-ticket-group/add-to-ticket-group.component";
import { CanActivateFn } from "@angular/router";
import { authGuard } from "./guard/auth.guard";
import { ForgotPasswordComponent } from "./Pages/User/forgot-password/forgot-password.component";
import { OTPVerifierComponent } from "./Pages/User/otpverifier/otpverifier.component";
import { LogoutComponent } from "./Pages/logout/logout.component";
import { EmployeeChatComponent } from './Pages/Employee/employee-chat/employee-chat.component';
import { OpenChatsComponent } from './Pages/Employee/open-chats/open-chats.component';
import { DepartmentComponent } from './Pages/SuperAdmin/department/department.component';
import { BlueScreenComponent } from './blue-screen/blue-screen.component';
import { ReportOptInComponent } from './Pages/reporting/report-opt-in/report-opt-in.component';

// interface CanActivate {
//   canActivate()
// }

const routes: Routes = [
  { path: "", component: HomeComponent },
  //Temporary
  { path: "Chat/:id", component: EmployeeChatComponent },
  { path: "OpenChats", component: OpenChatsComponent },
  { path: "Departments", component: DepartmentComponent },
  { path: "OptIn", component: ReportOptInComponent },
  //Login Sub-System
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "ChangePassword", component: ChangePasswordComponent, canActivate: [authGuard]},

  //SuperAdmin Sub-System
  {
    path: "superadmin-dashboard",
    component: SuperAdminDasboardComponent,
    canActivate: [authGuard],
  },

  //Admin Sub-System
  {
    path: "admin-dashboard",
    component: AdminDashboardComponent,
    canActivate: [authGuard],
  },

  //User Sub-System
  {path: "user-dashboard", component: UserDashboardComponent, canActivate: [authGuard]},
  {path: "Verify-User", component: OTPVerifierComponent},
  {path: "Update-User", component: UpdateUserComponent, canActivate: [authGuard]},
  { path: "create-u", component: CreateUserComponent },
  {
    path: "user-dashboard",
    component: UserDashboardComponent,
    canActivate: [authGuard],
  },

  //Client Sub-System
  {
    path: "client-dashboard",
    component: ClientDashboardComponent,
    canActivate: [authGuard],
  },

  { path: "Forgot-Password", component: ForgotPasswordComponent },

  // //Create Ticket
  // {path: "create-ticket", component: CreateTicketComponent},

  // //View Ticket
  // { path: 'display-tickets', component: DisplayTicketComponent },

  //Tags under Ticket-subsystem
  // { path: 'tags', component: TagsComponent },

  //Employee Sub-System
  {
    path: "employee-dashboard",
    component: employeeDashboardComponent,
    canActivate: [authGuard],
  },

  //Chatbot Sub-System
  {
    path: "chatbot-landing/:id",
    component: ChatbotLandingComponent,
    canActivate: [authGuard],
  },

  //{ path: 'register', component: CreateUserComponent },

  //FAQ
  { path: "admin/faq", component: ListFAQComponent, canActivate: [authGuard] },
  { path: "faq-list", component: FaqListComponent },

  //Ticket Groups
  {
    path: "ticket-groups",
    component: TicketGroupListComponent,
    canActivate: [authGuard],
  },
  {
    path: "ticket-groups/:id/add-ticket",
    component: AddToTicketGroupComponent,
    canActivate: [authGuard],
  },

  //Reporting
  {
    path: "admin-dashboard/reporting",
    component: ReportingComponent,
    canActivate: [authGuard],
  },

  //REMOVE IN PRODUCTION
  { path: "test", component: TestsComponent },
  { path: "blue", component: BlueScreenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
