import { Component, HostBinding, Inject, signal, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TicketService } from "../../../Services/Ticket/ticket.service";
import { Ticket } from "../../../Classes/ticket.classes";
import { TicketGroup } from "../../../Classes/ticket-group.classes";

@Component({
  selector: "app-add-to-ticket-group",
  templateUrl: "./add-to-ticket-group.component.html",
  styleUrls: ["./add-to-ticket-group.component.scss"],
})
export class AddToTicketGroupComponent implements OnInit {
  //////////////////////////////////////////////////////////////////////////////////// DARKMODE STARTS

  darkMode = signal<boolean>(false);
  @HostBinding("class.dark") get mode() {
    return this.darkMode();
  }

  setDarkMode() {
    this.darkMode.set(!this.darkMode());

    localStorage.setItem("darkMode", this.darkMode.toString());
  }

  getDarkMode() {
    console.log(localStorage.getItem("darkMode"));
    if (localStorage.getItem("darkMode") == "[Signal: true]") {
      return true;
    } else {
      return false;
    }
  }

  /////////////////////////////////////////////////////////////////////////////////// DARKMODE ENDS

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
    this.dialogRef.close(false);
  }

  openErrorModal() {
    this.showErrorModal = true;
  }

  closeErrorModal() {
    this.showErrorModal = true;
    this.dialogRef.close(false);
  }
  // ------------------------------------------------ Modal Section End

  ticketGroups: TicketGroup[] = [];
  selectedGroupId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddToTicketGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket },
    private ticketService: TicketService,
  ) {
    this.loadTicketGroups();
  }

  ngOnInit(): void {
    this.darkMode.set(this.getDarkMode());
  }

  loadTicketGroups(): void {
    this.ticketService.getAllTicketGroups().subscribe((groups) => {
      this.ticketGroups = groups;
    });
  }

  onAddTicket(): void {
    if (this.selectedGroupId && this.data.ticket.ticket_ID) {
      this.ticketService
        .addTicketToGroup(this.selectedGroupId, this.data.ticket.ticket_ID)
        .subscribe(
          (result) => {
            this.openSuccessModal();
          },
          (error) => {
              this.openErrorModal();
          }
        );
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
