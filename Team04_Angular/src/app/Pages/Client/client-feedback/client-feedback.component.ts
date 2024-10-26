import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ClientFeedbackService } from '../../../Services/Client/client-feedback.service';
import { ClientFeedback } from '../../../Classes/client-feedback';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { ChatbotLogDto } from '../../../Classes/chatbot_log'; 
import { TicketDTO } from '../../../Classes/ticket.classes';
import { TicketService } from '../../../Services/Ticket/ticket.service';

@Component({
  selector: 'app-submit-feedback',
  templateUrl: './client-feedback.component.html',
  styleUrls: ['./client-feedback.component.scss']
})
export class SubmitFeedbackComponent implements OnInit {
  @ViewChild('successModal') private successModalRef!: TemplateRef<any>;
  feedbackForm!: FormGroup;
  isLoading = false;
  chatbotLogs: ChatbotLogDto[] = []; 
  errorMessage: string | null = null;
  tickets: TicketDTO[] = []; 

  @ViewChild('successModal') successModal!: TemplateRef<any>;  
  showSuccessModal = false;

  constructor(
    private fb: FormBuilder,
    private feedbackService: ClientFeedbackService,
    private userService: UserServiceService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private ticketService: TicketService,
  ) {
    // So by the looks of it ross made this initializer 
    this.feedbackForm = this.fb.group({
      Client_ID: [this.userService.getUserIDFromToken()],
      // Then the validators thing is what triggers the validation
      Client_Feedback_Detail: ['', [Validators.required, Validators.minLength(25)]],
      Chatbot_Log_ID: [null], 
      Ticket_ID: [null], 
      Feedback_Date_Created: [new Date()],
    });    
  }

  ngOnInit(): void {
    this.loadChatbotLogs();
    this.loadTickets()
  }

  loadChatbotLogs(): void {
    this.feedbackService.getChatbotLogs().subscribe({
      next: (logs) => {
        this.chatbotLogs = logs;
      },
      error: (error) => {
        console.error('Error loading chatbot logs:', error);
      }
    });
  }

  submitFeedback(): void {
    if (this.feedbackForm.valid) {
      this.isLoading = true; 
      const feedbackData: ClientFeedback = this.feedbackForm.value;
      console.log('Submitting feedback:', feedbackData); 
      this.feedbackService.createFeedback(feedbackData).subscribe({
        next: (response) => {
          console.log('Feedback submitted successfully:', response);
          this.isLoading = false; 
          this.errorMessage = null; 
          this.openSuccessModal(); 
        },
        error: (error) => {
          console.error('Error submitting feedback:', error);
          this.isLoading = false; 
          this.errorMessage = error.error; 
        }
      });
    }
  }

  openSuccessModal() {
    this.showSuccessModal = true;
  }

  loadTickets() {
    const userId = this.userService.getUserIDFromToken();
    if (userId) {
      console.log('Fetching tickets for user:', userId);
      this.ticketService.getTicketsByUserId(userId).subscribe(
        (data: TicketDTO[]) => {
          console.log('Fetched tickets:', data);
          this.tickets = data.map(ticket => {
            return {
              ...ticket
            };
          });
        },
        (error: any) => {
          console.error('Error fetching tickets:', error);
        }
      );
    } else {
      console.error('User ID is null or invalid');
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}