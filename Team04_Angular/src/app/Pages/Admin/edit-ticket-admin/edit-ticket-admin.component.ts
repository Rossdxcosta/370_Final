import { ChangeDetectorRef, Component, Inject, OnInit, AfterViewInit, signal, HostBinding, HostListener, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ticket } from '../../../Classes/ticket.classes';
import { ToDoList, ToDoListItem } from '../../../Classes/todolist-classes';
import { TicketStatus } from '../../../Classes/ticket-status.classes';
import { User } from '../../../Classes/users-classes';
import { Priority } from '../../../Classes/priority.classes';
import { TicketService } from '../../../Services/Ticket/ticket.service';
import { TodolistService } from '../../../Services/Ticket/ToDoList/todolist.service';
import { AgChartOptions } from 'ag-charts-community';
import { AgChartsModule } from 'ag-charts-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { EscalateTicketComponent } from '../../Employee/Escalate-Ticket/escalate-ticket/escalate-ticket.component';


interface ChartOption {
  label: string;
  value: string;
  options: AgChartOptions;
}

@Component({
  selector: 'app-edit-ticket-admin',
  standalone: true,
  templateUrl: './edit-ticket-admin.component.html',
  styleUrls: ['./edit-ticket-admin.component.scss'],
  imports: [AgChartsModule, CommonModule, FormsModule]
})
export class EditTicketAdminComponent implements OnInit {
  ticket: Ticket;
  ticketStatuses: TicketStatus[] = [];
  priorities: Priority[] = [];
  employees: User[] = [];
  toDoListCreated = false;
  checklists: ToDoList[] = [];
  notes: ToDoListItem[] = [];
  checklistsToDelete: number[] = [];
  notesToDelete: number[] = [];
  chartData!: ChartOption;
  intervalId!: any;
  timeRemaining: string = '';
  secondsLeft: number = 0;
  Days: number = 0;
  Hours: number = 0;
  Minutes: number = 0;
  Seconds: number = 0;
  userRole: string = '';
  timePassed: number = 0;

  // Filterable dropdown properties
  employeeFilter: string = '';
  filteredEmployees: User[] = [];
  showDropdown: boolean = false;
  activeItemIndex: number = -1;
  

  @ViewChild('employeeInput') employeeInput!: ElementRef;

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
    return localStorage.getItem('darkMode') === '[Signal: true]';
  }

  /////////////////////////////////////////////////////////////////////////////////// DARKMODE ENDS

  // Modal and confirmation properties
  showDeleteListModal: boolean = false;
  confirmDeleteListBool: boolean = false;
  deleteListNumber: number | null = null;
  showDeleteConfirmedModal: boolean = false;
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  showEscalationModal: boolean = false;

  openSuccessModal() {
    this.showSuccessModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.dialogRef.close(this.ticket);
  }

  openErrorModal() {
    this.showErrorModal = true;
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  openEscalationModal() {
    this.showEscalationModal = true;
  }

  closeEscalationModal() {
    this.showEscalationModal = false;
  }

  openDeleteListModal(todolist_ID: number): void {
    this.deleteListNumber = todolist_ID;
    this.showDeleteListModal = true;
  }

  closeDeleteListModal(): void {
    this.showDeleteListModal = false;
  }

  openDeleteConfirmedModal() {
    this.showDeleteConfirmedModal = true;
  }

  closeDeleteConfirmedModal() {
    this.showDeleteConfirmedModal = false;
  }

  confirmDeleteList(): void {
    if (this.ticket.ticket_ID) {
      this.toDoListService.deleteToDoList(this.ticket.ticket_ID).subscribe(
        () => {
          this.toDoListCreated = false;
          this.checklists = [];
          this.notes = [];
          this.loadToDoList();
          this.closeDeleteListModal();
          this.openDeleteConfirmedModal();
        },
        (error) => {
          console.error('Error deleting ticket group:', error);
          this.openErrorModal();
        }
      );
    }
  }

  constructor(
    public dialogRef: MatDialogRef<EditTicketAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket },
    private ticketService: TicketService,
    private snackBar: MatSnackBar,
    private toDoListService: TodolistService,
    private cdr: ChangeDetectorRef,
    private userService: UserServiceService,
    private dialog: MatDialog
  ) {
    this.ticket = { ...data.ticket };
  }

  ngOnInit(): void {
    console.log('RECEIVED:', this.ticket);
    this.loadTicketStatuses();
    this.loadPriorities();
    this.loadEmployees();
    this.loadToDoList();
    this.start();
    this.darkMode.set(this.getDarkMode());
    this.userRole = this.userService.getUserRoleFromToken();
  }

  openEscalateModal(): void {
    const dialogRef = this.dialog.open(EscalateTicketComponent, {
      width: '400px',
      data: { ticketId: this.ticket.ticket_ID, employeeId: this.ticket.assigned_Employee_ID }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openEscalationModal();
      }
    });
  }

  /////////////////////////////////////////////////////////////////////////////////// CHART STARTS

  secondsSinceDate(dateString: any): number {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - givenDate.getTime();
    return differenceInMilliseconds / 1000;
  }

  stringFromSeconds(seconds: number) {
    this.Days = Math.floor(seconds / 86400);
    seconds -= this.Days * 86400;
    this.Hours = Math.floor(seconds / 3600);
    seconds -= this.Hours * 3600;
    this.Minutes = Math.floor(seconds / 60);
    this.Seconds = seconds % 60;
  }

  start() {
    this.intervalId = setInterval(() => {
      this.renderChart();
    }, 1000);
  }

  renderChart() {
    let breachtime = this.ticket.priority.breachTime;

    const breachDays = Number(breachtime.substring(0, breachtime.indexOf(':')));

    breachtime = breachtime.substring(breachtime.indexOf(':') + 1);

    const breachHours = Number(breachtime.substring(0, breachtime.indexOf(':')));

    breachtime = breachtime.substring(breachtime.indexOf(':') + 1);

    const breachMinutes = Number(breachtime.substring(0, breachtime.indexOf(':')));

    breachtime = breachtime.substring(breachtime.indexOf(':') + 1);

    const breachSeconds = Number(breachtime.substring(0, breachtime.indexOf(':')));


    const totalBreachSeconds =
      breachSeconds +
      breachMinutes * 60 +
      breachHours * 3600 +
      breachDays * 86400;
    this.timePassed = this.secondsSinceDate(this.ticket.ticket_Date_Created);
    this.secondsLeft = totalBreachSeconds - this.timePassed;

    this.stringFromSeconds(this.secondsLeft);

    const color = this.getDarkMode() ? '#4b5563' : '#e5e7eb';

    this.chartData = {
      label: '',
      value: 'RadialTimer',
      options: {
        data: [
          { status: 'Time passed', count: this.timePassed },
          { status: 'Time to breach', count: totalBreachSeconds - this.timePassed }
        ],
        series: [
          {
            type: 'pie',
            angleKey: 'count',
            fills: ['#c81e1e', color],
            strokes: ['#c81e1e', color]
          }
        ],
        background: {
          fill: 'rgba(0,0,0,0)'
        },
        tooltip: {
          enabled: false
        }
      }
    };
  }

  /////////////////////////////////////////////////////////////////////////////////// CHART ENDS

  createToDoList(): void {
    this.toDoListCreated = true;
    this.checklists = [];
    this.notes = [];
    this.cdr.detectChanges();
  }

  addChecklistItem(): void {
    if (this.ticket.ticket_ID !== undefined) {
      const newChecklist: ToDoList = {
        to_do_List_ID: 0,
        ticket_ID: this.ticket.ticket_ID,
        item_Description: '',
        is_Completed: false
      };
      this.checklists.push(newChecklist);
      this.cdr.detectChanges();
    } else {
      console.error('Ticket_ID is undefined');
    }
  }

  removeChecklistItem(index: number, checklistId: number): void {
    if (checklistId !== 0) {
      this.checklistsToDelete.push(checklistId);
    }
    this.checklists.splice(index, 1);
  }

  addNote(): void {
    if (this.ticket.ticket_ID !== undefined) {
      const newNote: ToDoListItem = {
        to_Do_Note_ID: 0,
        ticket_ID: this.ticket.ticket_ID,
        note_Description: ''
      };
      this.notes.push(newNote);
      this.cdr.detectChanges();
    } else {
      console.error('Ticket_ID is undefined');
    }
  }

  removeNoteItem(index: number, noteId: number): void {
    if (noteId !== 0) {
      this.notesToDelete.push(noteId);
    }
    this.notes.splice(index, 1);
  }

  saveToDoList(): void {
    // Handle checklist deletions
    this.checklistsToDelete.forEach((checklistId) => {
      this.toDoListService.deleteChecklist(checklistId).subscribe({
        next: () => {
          console.log(`Checklist item ${checklistId} deleted successfully`);
        },
        error: (error) => {
          console.error(`Error deleting checklist item ${checklistId}`, error);
        }
      });
    });

    // Handle note deletions
    this.notesToDelete.forEach((noteId) => {
      this.toDoListService.deleteNote(noteId).subscribe({
        next: () => {
          console.log(`Note item ${noteId} deleted successfully`);
        },
        error: (error) => {
          console.error(`Error deleting note item ${noteId}`, error);
        }
      });
    });

    // Clear deletion arrays
    this.checklistsToDelete = [];
    this.notesToDelete = [];

    // Handle checklist items
    this.checklists.forEach((checklist) => {
      if (checklist.to_do_List_ID === 0) {
        const checklistDto = {
          to_do_List_ID: checklist.to_do_List_ID,
          ticket_ID: this.ticket.ticket_ID!,
          item_Description: checklist.item_Description,
          is_Completed: checklist.is_Completed
        };
        this.toDoListService.createChecklist(this.ticket.ticket_ID!, checklistDto).subscribe({
          next: (response) => {
            checklist.to_do_List_ID = response.to_do_List_ID;
            console.log('Checklist created successfully', response);
          },
          error: (error) => {
            console.error('Error creating checklist', error);
          }
        });
      } else {
        const checklistDto = {
          to_do_List_ID: checklist.to_do_List_ID,
          ticket_ID: this.ticket.ticket_ID!,
          item_Description: checklist.item_Description,
          is_Completed: checklist.is_Completed
        };
        this.toDoListService.updateChecklist(checklist.to_do_List_ID, checklistDto).subscribe({
          next: (response) => {
            console.log('Checklist updated successfully', response);
          },
          error: (error) => {
            console.error('Error updating checklist', error);
          }
        });
      }
    });

    // Handle notes
    this.notes.forEach((note) => {
      if (note.to_Do_Note_ID === 0) {
        const noteDto = { ticket_ID: note.ticket_ID, note_Description: note.note_Description };
        this.toDoListService.createNote(this.ticket.ticket_ID!, noteDto).subscribe({
          next: (response) => {
            note.to_Do_Note_ID = response.to_Do_Note_ID;
            console.log('Note created successfully', response);
          },
          error: (error) => {
            console.error('Error creating note', error);
          }
        });
      } else {
        const noteDto = { note_Description: note.note_Description };
        this.toDoListService.updateNote(note.to_Do_Note_ID, noteDto).subscribe({
          next: (response) => {
            console.log('Note updated successfully', response);
          },
          error: (error) => {
            console.error('Error updating note', error);
          }
        });
      }
    });
    this.openSuccessModal();
  }

  loadToDoList(): void {
    if (this.ticket.ticket_ID !== undefined) {
      this.toDoListService.getChecklists(this.ticket.ticket_ID).subscribe({
        next: (response) => {
          console.log('Raw checklists:', response);
          this.checklists = response.map((item) => ({
            ...item,
            Item_Description: item.item_Description || '',
            Is_Completed: item.is_Completed || false
          }));
          console.log('Mapped checklists:', this.checklists);
          this.toDoListCreated = this.checklists.length > 0;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching checklists', error);
        }
      });

      this.toDoListService.getNotes(this.ticket.ticket_ID).subscribe({
        next: (response) => {
          console.log('Raw notes:', response);
          this.notes = response.map((item) => ({
            ...item,
            Note_Description: item.note_Description || ''
          }));
          console.log('Mapped notes:', this.notes);
          this.toDoListCreated = this.toDoListCreated || this.notes.length > 0;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching notes', error);
        }
      });
    } else {
      console.error('Ticket_ID is undefined');
    }
  }

  //============================== Edit Ticket Section ===========================================//

  loadTicketStatuses(): void {
    this.ticketService.getTicketStatuses().subscribe({
      next: (statuses: TicketStatus[]) => {
        this.ticketStatuses = statuses;
      },
      error: (error: any) => {
        console.error('Error loading ticket statuses:', error);
      }
    });
  }

  loadPriorities(): void {
    this.ticketService.getPriorities().subscribe({
      next: (priorities: Priority[]) => {
        this.priorities = priorities;
      },
      error: (error: any) => {
        console.error('Error loading priorities:', error);
      }
    });
  }

  loadEmployees(): void {
    this.ticketService.GetAllUsers().subscribe({
      next: (employees: User[]) => {
        this.employees = employees.filter((emp) => [3, 4, 5].includes(emp.role_ID));
        this.filteredEmployees = this.employees;
      },
      error: (error: any) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  openDropdown() {
    this.showDropdown = true;
    this.filteredEmployees = this.employees;
    this.activeItemIndex = -1;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  filterEmployees() {
    const filterValue = this.employeeFilter.toLowerCase();
    this.filteredEmployees = this.employees.filter((employee) =>
      `${employee.user_Name} ${employee.user_Surname}`.toLowerCase().includes(filterValue)
    );

    // Reset assigned employee if input doesn't match any employee
    if (!this.filteredEmployees.find((emp) => `${emp.user_Name} ${emp.user_Surname}` === this.employeeFilter)) {
      this.ticket.assigned_Employee_ID = "";
    }
  }

  selectEmployee(employee: User) {
    this.ticket.assigned_Employee_ID = employee.user_ID;
    this.employeeFilter = `${employee.user_Name} ${employee.user_Surname}`;
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const clickedInside = this.employeeInput?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeDropdown();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.showDropdown) {
      if (event.key === 'ArrowDown') {
        this.activeItemIndex = (this.activeItemIndex + 1) % this.filteredEmployees.length;
        event.preventDefault();
      } else if (event.key === 'ArrowUp') {
        this.activeItemIndex = (this.activeItemIndex - 1 + this.filteredEmployees.length) % this.filteredEmployees.length;
        event.preventDefault();
      } else if (event.key === 'Enter') {
        if (this.activeItemIndex >= 0 && this.activeItemIndex < this.filteredEmployees.length) {
          this.selectEmployee(this.filteredEmployees[this.activeItemIndex]);
          event.preventDefault();
        }
      }
    }
  }

  onSubmit(): void {
    if (this.ticket.ticket_ID) {
      const ticketToUpdate: Partial<Ticket> = {
        assigned_Employee_ID: this.ticket.assigned_Employee_ID,
        tag_ID: this.ticket.tag_ID,
        priority_ID: this.ticket.priority_ID,
        ticket_Status_ID: this.ticket.ticket_Status_ID,
        ticket_Description: this.ticket.ticket_Description,
        ticket_Subscription: this.ticket.ticket_Subscription
      };

      this.ticketService.updateTicket(this.ticket.ticket_ID, ticketToUpdate as Ticket).subscribe(
        () => {
          this.openSuccessModal();
        },
        (error) => {
          this.openErrorModal();
        }
      );
    } else {
      this.openErrorModal();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onReassign(): void {
    this.ticketService.reassignTicket(this.ticket.ticket_ID!, this.ticket.assigned_Employee_ID!).subscribe({
      next: () => {
        this.dialogRef.close(this.ticket);
      },
      error: (error: any) => {
        console.error('Error reassigning ticket:', error);
      }
    });
  }
  //============================== Edit Ticket Section ============================================//
}
