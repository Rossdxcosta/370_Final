import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Ticket, TicketDTO } from "../../../Classes/ticket.classes";
import { TicketService } from "../../../Services/Ticket/ticket.service";
import { TicketStatus } from "../../../Classes/ticket-status.classes";
import { Priority } from "../../../Classes/priority.classes";
import { User } from "../../../Classes/users-classes";
import { Tag } from "../../../Classes/tags-classes";
import { EditTicketAdminComponent } from "../edit-ticket-admin/edit-ticket-admin.component";
import { AddToTicketGroupComponent } from "../../TicketGroup/add-to-ticket-group/add-to-ticket-group.component";
import { forkJoin, Subscription } from "rxjs";
import { TicketGroup } from "../../../Classes/ticket-group.classes";
import { ToDoList, ToDoListItem } from "../../../Classes/todolist-classes";
import { TodolistService } from "../../../Services/Ticket/ToDoList/todolist.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as ExcelJS from "exceljs";
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: "app-ticket-management",
  templateUrl: "./ticket-table.component.html",
  styleUrls: ["./ticket-table.component.scss"],
})
export class TicketTableComponent implements OnInit {
  readonly EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  tickets: Ticket[] = [];
  employees: User[] = [];
  currentTicket: Ticket = new Ticket();
  searchQuery: string = "";
  isEdit: boolean = false;
  displayedColumns: string[] = [
    "ticket_ID",
    "client",
    "employee",
    "tag",
    "priority",
    "ticket_Status",
    "ticket_Description",
    "ticket_Date_Created",
    "addToGroup",
  ];
  dataSource = new MatTableDataSource<Ticket>([]);
  ticketStatuses: TicketStatus[] = [];
  priorities: Priority[] = [];
  private subscriptions: Subscription = new Subscription();
  showEditModal = false;


  //TODOLISTSTUFF
  toDoListCreated = false;
  checklists: ToDoList[] = [];
  notes: ToDoListItem[] = [];
  checklistsToDelete: number[] = [];
  notesToDelete: number[] = [];

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  //loading stuff
  isLoading: boolean = true;
  isData: boolean = true;
  isTableData: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ticketService: TicketService,
    private dialog: MatDialog,
    private toDoListService: TodolistService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadTicketsAndGroups();
    this.loadTicketStatuses();
    this.loadPriorities();
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTicketsAndGroups(): void {
    this.isLoading = true;
  
    // Fetch tickets and ticket groups in parallel
    forkJoin({
      tickets: this.ticketService.getTickets(),
      ticketGroups: this.ticketService.getAllTicketGroups()
    }).subscribe(({ tickets: ticketDTOs, ticketGroups }) => {
      // Map TicketDTOs to Tickets
      this.tickets = ticketDTOs.map((dto) => this.mapToTicket(dto));
  
      // Create a mapping from ticket IDs to the groups they belong to
      const ticketIdToGroupsMap = new Map<number, TicketGroup[]>();
  
      ticketGroups.forEach((group) => {
        if (group.tickets) {
          group.tickets.forEach((ticket) => {
            if (!ticketIdToGroupsMap.has(ticket.ticket_ID!)) {
              ticketIdToGroupsMap.set(ticket.ticket_ID!, []);
            }
            ticketIdToGroupsMap.get(ticket.ticket_ID!)!.push(group);
          });
        }
      });
  
      // Update each ticket's ticketGroup property
      this.tickets.forEach((ticket) => {
        ticket.ticketGroup = ticketIdToGroupsMap.get(ticket.ticket_ID!) || [];
      });
  
      this.dataSource.data = this.tickets;
      this.totalItems = this.dataSource.data.length;
      this.updateDataSource();
  
      this.isLoading = false;
      if (this.tickets.length > 0) {
        this.isData = true;
        this.isTableData = true;
      } else {
        this.isData = false;
        this.isTableData = false;
      }
    });
  }

  private mapToTicket(dto: TicketDTO): Ticket {
    return {
      ticket_ID: dto.ticket_ID || 0,
      client_ID: dto.client_ID,
      client: dto.client || new User(),
      employee: dto.employee || new User(),
      tag_ID: dto.tag_ID,
      tag: dto.tag || new Tag(),
      priority_ID: dto.priority_ID,
      priority: dto.priority || new Priority(),
      ticket_Status_ID: dto.ticket_Status_ID,
      ticket_Status: dto.ticket_Status || new TicketStatus(),
      ticket_Description: dto.ticket_Description,
      ticket_Date_Created: new Date(dto.ticket_Date_Created),
      ticket_Subscription: dto.ticket_Subscription,
      assigned_Employee_ID: dto.assigned_Employee_ID,
      ticketGroup: dto.ticketGroup || [], 
    };
  }

  loadTicketStatuses(): void {
    this.ticketService
      .getTicketStatuses()
      .subscribe((statuses: TicketStatus[]) => {
        this.ticketStatuses = statuses;
        this.isLoading = false;
      });
  }

  loadPriorities(): void {
    this.ticketService.getPriorities().subscribe((priorities: Priority[]) => {
      this.priorities = priorities;
      this.isLoading = false;
    });
  }

  loadEmployees(): void {
    this.ticketService.GetAllUsers().subscribe((employees: User[]) => {
      this.employees = employees.filter((emp) =>
        [3, 4, 5].includes(emp.role_ID)
      );
      this.isLoading = false;
    });
  }

  openEditModal(ticket: Ticket): void {
    const dialogRef = this.dialog.open(EditTicketAdminComponent, {
      width: "1000px",
      data: { ticket: ticket },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTicketsAndGroups();
      }
    });
  }

  openAddTicketToGroupModal(ticket: Ticket, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddToTicketGroupComponent, {
      data: { ticket: ticket },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTicketsAndGroups();
      }
      else {
        this.loadTicketsAndGroups();
      }
    });
  }

  // addTicketToGroup(groupId: number, ticketId: number): void {
  //   const sub = this.ticketService
  //     .addTicketToGroup(groupId, ticketId)
  //     .subscribe(
  //       () => {},
  //       (error) => {
  //         console.error("Error adding ticket to group:", error);
  //       }
  //     );
  //   this.subscriptions.add(sub);
  // }

  searchTickets(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      this.isTableData = false;
      const filteredTickets = this.tickets.filter((ticket) => {
        const groupNames = ticket.ticketGroup?.map((g) => g.name.toLowerCase()).join(' ') || '';
        return (
          ticket.ticket_ID?.toString().includes(query) ||
          ticket.client.user_Name.toLowerCase().includes(query) ||
          ticket.employee.user_Name.toLowerCase().includes(query) ||
          ticket.employee.user_Surname.toLowerCase().includes(query) ||
          ticket.tag.tag_Name.toLowerCase().includes(query) ||
          ticket.priority.priority_Name.toLowerCase().includes(query) ||
          ticket.ticket_Status.status_Name.toLowerCase().includes(query) ||
          ticket.ticket_Description.toLowerCase().includes(query) ||
          groupNames.includes(query)
        );
      });
      this.totalItems = filteredTickets.length;
      if (filteredTickets.length > 0 || this.searchQuery === "") {
        this.isTableData = true;
      }
      this.updateDataSource(filteredTickets);
    } else {
      this.totalItems = this.tickets.length;
      this.updateDataSource();
    }
  }
  
  // Update Table from Pagination
  updateDataSource(filteredTickets: Ticket[] = this.tickets): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.dataSource.data = filteredTickets.slice(start, end);
  }

  // Update Pagination Numbers
  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  // Pagination Calculation
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  closeDialog(): void {
    this.showEditModal = false;
  }

  private loadImageFromAssets(url: string): Promise<string> {
    return lastValueFrom(this.http.get(url, { responseType: 'blob' })).then((blob) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
  }

  async exportTableToExcel(): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tickets');
  
    // Load images
    const logo1Base64 = await this.loadImageFromAssets('/assets/Images/ReportImages/bmwgroup.png');
    const logo2Base64 = await this.loadImageFromAssets('/assets/Images/ReportImages/bmwlogo-background-removed.png');
  
    // Add images to the workbook
    const imageId1 = workbook.addImage({
      base64: logo1Base64.split(',')[1],
      extension: 'png',
    });
  
    const imageId2 = workbook.addImage({
      base64: logo2Base64.split(',')[1],
      extension: 'png',
    });
  
    // Set DPI for conversion from cm to pixels (Excel uses 96 DPI)
    const dpi = 96;
  
    // Convert dimensions from cm to pixels
    const bmwGroupWidth = (5.98 / 2.54) * dpi;
    const bmwGroupHeight = (3.15 / 2.54) * dpi;
  
    const bmwLogoWidth = (5 / 2.54) * dpi;
    const bmwLogoHeight = (4.39 / 2.54) * dpi;
  
    // Add images to the worksheet without adding extra rows
    worksheet.addImage(imageId1, {
      tl: { col: 0, row: 0 },
      ext: { width: bmwGroupWidth, height: bmwGroupHeight },
      editAs: 'oneCell',
    });
  
    worksheet.addImage(imageId2, {
      tl: { col: 5, row: 0 },
      ext: { width: bmwLogoWidth, height: bmwLogoHeight },
      editAs: 'oneCell',
    });
  
    // Adjust row heights to accommodate images
    worksheet.getRow(1).height = Math.max(bmwGroupHeight, bmwLogoHeight) / (dpi / 72); // Convert pixels to points
  
    // Add title in the next row
    const titleRowIndex = 2;
    worksheet.mergeCells(`A${titleRowIndex}:H${titleRowIndex}`);
    const titleCell = worksheet.getCell(`A${titleRowIndex}`);
    const currentDate = new Date().toLocaleDateString();
    titleCell.value = `Tickets in the system as of ${currentDate}`;
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(titleRowIndex).height = 30;
  
    // Add an empty row before headers
    const emptyRowIndex = titleRowIndex + 1;
    worksheet.addRow([]);
  
    // Define columns without headers
    worksheet.columns = [
      { key: 'ID', width: 10 },
      { key: 'Client', width: 20 },
      { key: 'AssignedTo', width: 20 },
      { key: 'Tag', width: 15 },
      { key: 'Priority', width: 15 },
      { key: 'Status', width: 15 },
      { key: 'Description', width: 40 },
      { key: 'DateCreated', width: 20 },
    ];
  
    // Manually add the header row
    const headerRowIndex = emptyRowIndex + 1;
    const headerRowValues = ['ID', 'Client', 'Assigned To', 'Tag', 'Priority', 'Status', 'Description', 'Date Created'];
    worksheet.insertRow(headerRowIndex, headerRowValues);
  
    // Style the header row
    const headerRow = worksheet.getRow(headerRowIndex);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
    });
    worksheet.getRow(headerRowIndex).height = 20;
  
    // Add data rows starting from the row after the header
    this.tickets.forEach((ticket) => {
      worksheet.addRow({
        ID: ticket.ticket_ID,
        Client: `${ticket.client.user_Name} ${ticket.client.user_Surname}`,
        AssignedTo: `${ticket.employee.user_Name} ${ticket.employee.user_Surname}`,
        Tag: ticket.tag.tag_Name,
        Priority: ticket.priority.priority_Name,
        Status: ticket.ticket_Status.status_Name,
        Description: ticket.ticket_Description,
        DateCreated: ticket.ticket_Date_Created.toISOString(),
      });
    });
  
    // Style data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > headerRowIndex) {
        row.eachCell((cell) => {
          cell.font = { color: { argb: 'FF000000' } };
          cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
            left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
            bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
            right: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          };
          // Alternate row color
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: rowNumber % 2 === 0 ? 'FFE9EFF7' : 'FFFFFFFF' },
          };
        });
      }
    });

    
  
    // Generate Excel file and prompt download
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: this.EXCEL_TYPE });
      const fileName = `tickets_${new Date().getTime()}.xlsx`;
  
      if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
        // For IE
        (window.navigator as any).msSaveOrOpenBlob(blob, fileName);
      } else {
        // For other browsers
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(link.href);
        }, 100);
      }
    });

    // Conditional coloring for Priority column (Column 5)
    const priorityCell = worksheet.getRow(headerRowIndex).getCell(5);
    const priorityValue = priorityCell.value ? priorityCell.value.toString().toLowerCase() : '';
    
    let priorityFillColor = '';
    if (priorityValue === 'low') {
      priorityFillColor = 'FF92D050'; // Green
    } else if (priorityValue === 'medium') {
      priorityFillColor = 'FFFFC000'; // Orange
    } else if (priorityValue === 'high') {
      priorityFillColor = 'FFFF0000'; // Red
    }
    
    if (priorityFillColor) {
      priorityCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: priorityFillColor },
      };
    }
    
    // Conditional coloring for Status column (Column 6)
    const statusCell = worksheet.getRow(headerRowIndex).getCell(6);
    const statusValue = statusCell.value ? statusCell.value.toString().toLowerCase() : '';
    
    let statusFillColor = '';
    if (statusValue === 'breached') {
      statusFillColor = 'FFFF0000'; // Red
    } else if (statusValue === 'open' || statusValue === 'in progress') {
      statusFillColor = 'FF7030A0'; // Purple
    } else if (statusValue === 'closed') {
      statusFillColor = 'FF0070C0'; // Blue
    }
    
    if (statusFillColor) {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: statusFillColor },
      };
    }
  }
  
  

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    const file = `${fileName}_${new Date().getTime()}.xlsx`;
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(data);
    link.download = file;
    link.click();
  }
}
