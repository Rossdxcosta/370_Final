import { Component, HostBinding, Inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from '../../../../Services/Ticket/ticket.service';
import { Department } from '../../../../Classes/department-classes';
import { EscalationRequest } from '../../../../Classes/escalation-request.classes';

@Component({
  selector: 'app-escalate-ticket',
  templateUrl: './escalate-ticket.component.html',
  styleUrls: ['./escalate-ticket.component.scss']
})
export class EscalateTicketComponent implements OnInit {
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
    
  reasonForEscalation: string = '';
  selectedDepartment: number | null = null;
  departments: Department[] = [];

  constructor(
    public dialogRef: MatDialogRef<EscalateTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ticketId: number, employeeId: string },
    private ticketService: TicketService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.darkMode.set(this.getDarkMode());
  }

  loadDepartments(): void {
    this.ticketService.getDepartments().subscribe((departments: Department[]) => {
      this.departments = departments;
    });
  }

  onSubmit(): void {
    if (this.selectedDepartment === null) {
      this.snackBar.open('Please select a department', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }

    const escalationRequest = new EscalationRequest(
      this.data.ticketId,
      this.data.employeeId,
      this.reasonForEscalation,
      this.selectedDepartment,
      new Date()
    );

    this.ticketService.escalateTicket(escalationRequest).subscribe(
      () => {
        this.snackBar.open('Ticket escalated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        this.dialogRef.close(true);
      },
      (error: any) => {
        console.error('Error escalating ticket:', error);
        this.snackBar.open('Error escalating ticket', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
