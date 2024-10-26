import { NgModule, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthenticationInterceptor } from './Services/JWT/JWT_Injector';
import { NavbarComponent } from "./Navbar/navbar.component";
import { FooterComponent } from "./Footer/footer.component";
import { HomeComponent } from './Pages/Home/home.component';
import { UserDashboardComponent } from './Pages/User/user-dashboard/user-dashboard.component';
import { SuperAdminDasboardComponent } from './Pages/SuperAdmin/super-admin-dasboard/super-admin-dasboard.component';
import { AdminTableComponent } from './Pages/SuperAdmin/admin-table/admin-table.component';
import { RoleTableComponent } from './Pages/SuperAdmin/role-table/role-table.component';
import { AuditLogComponent } from './Pages/SuperAdmin/audit-log/audit-log.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ClientDashboardComponent } from './Pages/Client/client-dashboard/client-dashboard.component';
import { CreateTicketComponent } from './Pages/Ticket/create-ticket/create-ticket.component';
import { TagsComponent } from './Pages/Tickets/Tags/tags/tags.component'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select'; 
import { MatTableModule } from '@angular/material/table'; 
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminRoleRequestTableComponent } from './Pages/SuperAdmin/admin-role-request-table/admin-role-request-table.component';
import { UserRoleTableComponent } from './Pages/Admin/user-role-table/user-role-table.component';
import { TicketTableComponent } from './Pages/Admin/ticket-table/ticket-table.component';
import { AdminDataServiceService } from './Services/Admin/admin-data-service.service';
import { DeactivationRequestsComponent } from './Pages/Admin/deactivation-requests/deactivation-requests.component';
import { DeactivationRequestComponent } from './Pages/User/deactivation-request/deactivation-request.component';
import { employeeDashboardComponent } from './Pages/Employee/employee-dashboard/employee-dashboard.component';
import { UserAccountRequestComponent } from './Pages/User/user-account-request/user-account-request.component';
import { AccountRequestsComponent } from './Pages/Admin/account-requests/account-requests.component';
import { TicketManagementComponent } from './Pages/Employee/ticket-management/ticket-management.component';
import { DisplayTicketComponent } from './Pages/Ticket/display-ticket/display-ticket.component';
//import { ChatbotLandingComponent } from './Pages/Chatbot/chatbot-landing/chatbot-landing.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog'; 
import { ListFAQComponent } from './Pages/Admin/faq/list-faq/list-faq.component';
import { FaqListComponent } from './Pages/FAQ/faq-list/faq-list.component';
import { FAQService } from './Services/FAQ/faq.service';
import { TicketUpdatesComponent } from './Pages/Ticket/ticket-updates/ticket-updates.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReopenTicketComponent } from './Pages/Ticket/reopen-ticket/reopen-ticket.component';
import { FeedbackManagementComponent  } from './Pages/Employee/feedback-management/feedback-management.component';
import { SubmitFeedbackComponent } from './Pages/Client/client-feedback/client-feedback.component';
import { ReportingComponent } from './Pages/reporting/reporting.component';
import { AgChartsModule } from 'ag-charts-angular';
import { AgGridModule } from 'ag-grid-angular';
import { MatCardModule } from '@angular/material/card';
import { ReportingService } from './Services/Reporting/reporting.service';
import { AgCharts } from 'ag-charts-angular';
//import { EditTicketAdminComponent } from './Pages/Admin/edit-ticket-admin/edit-ticket-admin.component';
import { ProfileIconComponent } from './Pages/Profile/profile-icon/profile-icon.component';
import { TicketGroupListComponent } from './Pages/TicketGroup/ticket-group-list/ticket-group-list.component';
import { AddToTicketGroupComponent } from './Pages/TicketGroup/add-to-ticket-group/add-to-ticket-group.component';
import { TrainChatbotComponent } from './Pages/AI_Engineer/train-chatbot/train-chatbot.component';
import { ForgotPasswordComponent } from './Pages/User/forgot-password/forgot-password.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { OTPVerifierComponent } from './Pages/User/otpverifier/otpverifier.component';
import { PriorityComponent } from './Pages/Admin/status-editor/status-editor.component';
import { EscalateTicketComponent } from './Pages/Employee/Escalate-Ticket/escalate-ticket/escalate-ticket.component';
import { AdminEscalationRequestsComponent } from './Pages/Admin/escalation-requests/admin-escalation-requests/admin-escalation-requests.component';import { MatMenu } from '@angular/material/menu';
import { UpdateUserComponent } from './Pages/User/update-user/update-user.component';
import { MatIconModule } from '@angular/material/icon';
import { LogoutComponent } from './Pages/logout/logout.component';
import { SoftwareRequestComponent } from './Pages/Client/software-request/software-request.component';
import { OpenChatsComponent } from './Pages/Employee/open-chats/open-chats.component';
import { SoftwareComponent } from './Pages/Admin/software/software.component';
import { VDIComponent } from './Pages/Admin/VDI-manager/VDI-manager.component';
import { UsersTabComponent } from './Pages/Admin/admin-dashboard/users-tab/users-tab.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { OptInComponent } from './Pages/Profile/opt-in/opt-in.component';
import { DepartmentComponent } from './Pages/SuperAdmin/department/department.component';
import { CompanyManagerComponent } from './Pages/Admin/company/company-manager.component';
import { BlueScreenComponent } from './blue-screen/blue-screen.component';
import { PdfViewerComponent } from './Pages/reporting/PDFViewer/pdf-viewer/pdf-viewer.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ReportOptInComponent } from './Pages/reporting/report-opt-in/report-opt-in.component';
import { FeedbackManagementComp  } from './Pages/Admin/feedback-management/feedback-management.component';
import { FeedbackManagementSadmin  } from './Pages/SuperAdmin/feedback-management/feedback-management.component';
import { EmployeeCurrentPerformanceComponent } from './Pages/Employee/employee-reports/employee-reports.component';
import { VDIRequestsComponent } from './Pages/Admin/software-req/software-req.component';






@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    //SuperAdminDasboardComponent,
    AdminTableComponent,
    RoleTableComponent,
    AuditLogComponent,
    //SaWelcomePageComponent,
    CreateTicketComponent,
    TagsComponent,
    AdminRoleRequestTableComponent,
    AppComponent,
    // UserRoleTableComponent,
    TicketTableComponent,
    // UserAccountRequestComponent,
    // AccountRequestsComponent,
    TicketManagementComponent,
    DisplayTicketComponent,
    //ChatbotLandingComponent,
    ListFAQComponent,
    FaqListComponent,
    TicketUpdatesComponent,
    ReopenTicketComponent,
    SubmitFeedbackComponent,
    FeedbackManagementComponent,
    TrainChatbotComponent,
    TicketGroupListComponent,
    AddToTicketGroupComponent,
    ForgotPasswordComponent,
    OTPVerifierComponent,
    PriorityComponent,
    EscalateTicketComponent,
    AdminEscalationRequestsComponent,
    // DenyConfirmationDialog,
    // AcceptEscalationDialog,
    //UpdateUserComponent,
    LogoutComponent,
    SoftwareRequestComponent,
    OpenChatsComponent,
    SoftwareComponent,
    VDIComponent,
    OptInComponent,
    DepartmentComponent,
    CompanyManagerComponent,
    BlueScreenComponent,
    FeedbackManagementComp,
    FeedbackManagementSadmin,
    VDIRequestsComponent,
    SoftwareRequestComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NavbarComponent,
    FooterComponent,
    FormsModule,
    HttpClientModule,
    NgbModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatTableModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    AgChartsModule,
    AgGridModule,
    MatCardModule,
    AgCharts,
    MatDialogModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatMenu,
    MatIconModule,
    DeactivationRequestComponent,
    NgxExtendedPdfViewerModule,
    FullCalendarModule,
    PdfViewerComponent,
],
  providers: [
    FAQService, ReportingService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    provideAnimationsAsync(),
    provideNgxMask()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  
  bootstrap: [AppComponent]
})
export class AppModule implements OnInit {
  constructor(){}

  ngOnInit(): void {
  }
}
