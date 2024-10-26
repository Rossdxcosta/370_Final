import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TicketGroup } from "../../../Classes/ticket-group.classes";
import { Ticket } from "../../../Classes/ticket.classes";
import { TicketService } from "../../../Services/Ticket/ticket.service";

@Component({
  selector: "app-ticket-group-list",
  templateUrl: "./ticket-group-list.component.html",
  styleUrls: ["./ticket-group-list.component.scss"],
})
export class TicketGroupListComponent implements OnInit {
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
  showErrorModal2: boolean = false;
  errorMessage: string = '';
  showDeleteConfirmedModal: boolean = false;

  openSuccessModal() {
    this.showSuccessModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  openErrorModal() {
    this.showErrorModal = true;
  }

  openErrorModal2() {
    this.showErrorModal2 = true;
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  closeErrorModal2() {
    this.showErrorModal2 = false;
  }

  openDeleteConfirmedModal() {
    this.showDeleteConfirmedModal = true;
  }

  closeDeleteConfirmedModal() {
    this.showDeleteConfirmedModal = false;
  }
  // ------------------------------------------------ Modal Section End
  ticketGroups: TicketGroup[] = [];
  ticketGroupsDetail: TicketGroup[] = [];
  filteredTicketGroups: TicketGroup[] = [];
  filteredTicketGroupsDetail: TicketGroup[] = [];
  // Add this in your component class
  filteredDetailTickets: Ticket[] = [];
  searchTerm: string = "";

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

    // Pagination properties details
    pageIndexG: number = 0;
    pageSizeG: number = 5;
    totalItemsG: number = 0;

  // Loading Section
  isLoading: boolean = true;
  isData: boolean = false;
  isTableData: boolean = false;

  // New properties for modal control
  showFormModal: boolean = false;
  showDeleteModal: boolean = false;
  showDetailModal: boolean = false;
  ticketGroupForm: FormGroup;
  ticketGroupId: number | null = null;
  deleteTicketGroupId: number | null = null;
  detailTicketGroup: TicketGroup | null = null;
  detailTickets: Ticket[] = [];
  detailDisplayedColumns: string[] = [
    "ticket_ID",
    "ticket_Description",
    "ticket_Date_Created",
    "remove",
  ];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService
  ) {
    this.ticketGroupForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      dateCreated: [new Date()],
    });
  }

  ngOnInit(): void {
    this.loadTicketGroups();
  }

  loadTicketGroups(): void {
    this.ticketService.getAllTicketGroups().subscribe(
      (data) => {
        this.ticketGroups = data;
        this.filteredTicketGroups = data;
        this.totalItems = this.ticketGroups.length;
        this.updateDataSource();
        this.isLoading = false;

        if (this.filteredTicketGroups.length > 0) {
          this.isData = true;
          this.isTableData = true;
        } else {
          this.isData = false;
          this.isTableData = false;
        }
      },
      (error) => console.error("Error fetching ticket groups:", error)
    );
  }

  openFormModal(ticketGroupId?: number): void {
    if (ticketGroupId) {
      this.ticketGroupId = ticketGroupId;
      this.ticketService.getTicketGroupById(ticketGroupId).subscribe(
        (data) => {
          this.ticketGroupForm.patchValue(data);
          this.showFormModal = true;
        },
        (error) => console.error("Error fetching ticket group details:", error)
      );
    } else {
      this.ticketGroupId = null;
      this.ticketGroupForm.reset({
        name: "",
        description: "",
        dateCreated: new Date(),
      });
      this.showFormModal = true;
    }
  }

  closeFormModal(): void {
    this.showFormModal = false;
  }

  openDeleteModal(ticketGroupId: number): void {
    this.deleteTicketGroupId = ticketGroupId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  openDetailModal(ticketGroupId: number): void {
    this.ticketService.getTicketGroupById(ticketGroupId).subscribe(
      (group) => {
        this.detailTicketGroup = group;
        this.loadDetailTickets();
        this.showDetailModal = true;
      },
      (error) => console.error("Error fetching ticket group:", error)
    );
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.detailTicketGroup = null;
    this.detailTickets = [];
  }

  loadDetailTickets(): void {
    if (this.detailTicketGroup) {
      this.ticketService
        .getTicketsByGroupId(this.detailTicketGroup.ticketGroup_ID)
        .subscribe(
          (tickets) => {
            this.detailTickets = tickets;
            this.pageIndexG = 0; 
            this.totalItemsG = this.detailTickets.length;
            this.updateDataSourceGroup();
            this.isLoading = false;
          },
          (error) => console.error("Error fetching tickets:", error)
        );
    }
  }
  
  removeDetailTicket(ticketId: number): void {
    if (
      this.detailTicketGroup &&
      confirm("Are you sure you want to remove this ticket from the group?")
    ) {
      this.ticketService
        .removeTicketFromGroup(this.detailTicketGroup.ticketGroup_ID, ticketId)
        .subscribe(
          () => {
            this.detailTickets = this.detailTickets.filter(
              (ticket) => ticket.ticket_ID !== ticketId
            );
            this.totalItemsG = this.detailTickets.length;
            if (this.pageIndexG > this.totalPagesGroup - 1) {
              this.pageIndexG = this.totalPagesGroup - 1;
              if (this.pageIndexG < 0) {
                this.pageIndexG = 0;
              }
            }
            this.updateDataSourceGroup();
          },
          (error) => console.error("Error removing ticket:", error)
        );
    }
  }
  

  onSubmit(): void {
    if (this.ticketGroupForm.valid) {
      const ticketGroup: TicketGroup = this.ticketGroupForm.value;

      if (typeof ticketGroup.dateCreated === "string") {
        ticketGroup.dateCreated = new Date(ticketGroup.dateCreated);
      }

      if (this.ticketGroupId) {
        ticketGroup.ticketGroup_ID = this.ticketGroupId;
        this.ticketService
          .updateTicketGroup(this.ticketGroupId, ticketGroup)
          .subscribe({
            next: () => {
              this.loadTicketGroups();
              this.closeFormModal();
              this.openSuccessModal();
            },
            error: (error) => {
              console.error("Error updating ticket group:", error);
              this.openErrorModal();
            }
          });
      } else {
        this.ticketService.addTicketGroup(ticketGroup).subscribe({
          next: () => {
            this.loadTicketGroups();
            this.closeFormModal();
            this.openSuccessModal();
          },
          error: (error) => {
            console.error("Error adding ticket group:", error);
            this.openErrorModal();
          },
        });
      }
    }
  }

  confirmDelete(): void {
    if (this.deleteTicketGroupId) {
      this.ticketService.deleteTicketGroup(this.deleteTicketGroupId).subscribe(
        () => {
          this.loadTicketGroups();
          this.closeDeleteModal();
          this.openDeleteConfirmedModal();
        },
        (error) => {
          console.error("Error deleting ticket group:", error);
          this.openErrorModal();
        }
      );
    }
  }

  searchTicketGroups(): void {
    if (this.searchTerm) {
      this.isTableData = false;
      this.filteredTicketGroups = this.ticketGroups.filter(
        (group) =>
          group.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          group.description
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
      this.totalItems = this.filteredTicketGroups.length;

      if (this.filteredTicketGroups.length > 0) {
        this.isTableData = true;
      }

      this.updateDataSource(this.filteredTicketGroups);
    } else {
      this.isTableData = true;
      this.totalItems = this.filteredTicketGroups.length;
      this.updateDataSource(this.filteredTicketGroups);
    }
  }

  updateDataSource(
    filteredTicketGroups: TicketGroup[] = this.ticketGroups
  ): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.filteredTicketGroups = filteredTicketGroups.slice(start, end);
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  updateDataSourceGroup(
    detailTickets: Ticket[] = this.detailTickets
  ): void {
    const start = this.pageIndexG * this.pageSizeG;
    const end = start + this.pageSizeG;
    this.filteredDetailTickets = detailTickets.slice(start, end);
  }  

  onPageChangeGroup(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndexG = event.pageIndex;
    this.pageSizeG = event.pageSize;
    this.updateDataSourceGroup();
  }  

  get totalPagesGroup(): number {
    return Math.ceil(this.totalItemsG / this.pageSizeG);
  }  
}
