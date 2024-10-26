import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TicketService } from '../../../Services/Ticket/ticket.service';
import { TagsService } from '../../../Services/Tickets/Tags/tag.service';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { TicketDTO } from '../../../Classes/ticket.classes';
import { Priority } from '../../../Classes/priority.classes';
import { TicketStatus } from '../../../Classes/ticket-status.classes';
import { Tag } from '../../../Classes/tags-classes';
import { User } from '../../../Classes/users-classes';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent implements OnInit {

  // ------------------------------------------------ Modal Section Start
  // Instructions
  // Copy paste this section into the TypeScript component, AFTER you have copy pasted the HTML components at the bottom of the HTML document
  // Remember to change the HTML to be relevant to the specific component
  // In the button you want to call the modal, most cases will be the submit button,
  //// call the openSuccesModal in the valid part
  //// call the openErrorModal in the invalid part
  // Use this document as a guide if you do not know what I am talking about
  
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;

  openSuccessModal() {
    this.showSuccessModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  openErrorModal() {
    this.showErrorModal = true;
  }

  closeErrorModal() {
    this.showErrorModal = true;
  }
  // ------------------------------------------------ Modal Section End

  priorities: Priority[] = [];
  ticketStatuses: TicketStatus[] = [];
  ticketTags: Tag[] = [];
  subscribed: boolean = false;

  constructor(
    private ticketService: TicketService,
    private tagService: TagsService,
    private userService: UserServiceService,
  ) { }

  ngOnInit(): void {
    // Fetch priorities
    this.ticketService.getPriorities().subscribe(
      (data: Priority[]) => {
        this.priorities = data;
      },
      (error: any) => {
        console.error('Error fetching priorities:', error);
      }
    );

    // Fetch ticket statuses
    this.ticketService.getTicketStatuses().subscribe(
      (data: TicketStatus[]) => {
        this.ticketStatuses = data;
      },
      (error: any) => {
        console.error('Error fetching ticket statuses:', error);
      }
    );

    // Fetch ticket tags
    this.tagService.getAllTags().subscribe(
      (data: Tag[]) => {
        this.ticketTags = data;
      },
      (error: any) => {
        console.error('Error fetching ticket tags:', error);
      }
    );
  }

  onSubmit(ticketForm: NgForm) {
    if (ticketForm.valid) {
      this.subscribed = ticketForm.value.ticketSubscription;

      const newTicket: TicketDTO = {
        client_ID: this.userService.getUserIDFromToken(),
        tag_ID: ticketForm.value.tagId,
        priority_ID: 1,
        ticket_Status_ID: 1,
        ticket_Description: ticketForm.value.ticketDescription,
        ticket_Date_Created: new Date(),
        ticket_Subscription: this.subscribed,
        ticket_Status_Name: 'Open',
        client: new User(),
        employee: new User(),
        tag: new Tag(),
        priority: new Priority(),
        ticket_Status: new TicketStatus(),
        assigned_Employee_ID: ''
      };

      this.ticketService.createTicket(newTicket).subscribe(
        (response: TicketDTO) => {
          this.subscribed = false;
          console.log('Ticket created successfully!', newTicket);
          ticketForm.resetForm();
          // This is where you call the open success modal
          this.openSuccessModal();
        },
        (error: any) => {
          console.error('Error creating ticket:', error);
          // This is where you call the open error modal
          this.openErrorModal();
        }
      );
    }
  }
}
