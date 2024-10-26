import { Component, HostBinding, Inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { User_Account_Deactivate_Request } from "../../../Classes/requests";
import { UserServiceService } from "../../../Services/Users/user-service.service";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-deactivation-request",
  templateUrl: "./deactivation-request.component.html",
  styleUrl: "./deactivation-request.component.scss",
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule,
  ],
})
export class DeactivationRequestComponent implements OnInit {
  darkMode = signal<boolean>(false);
  @HostBinding("class.dark") get mode() {
    return this.darkMode();
  }

  setDarkMode() {
    this.darkMode.set(!this.darkMode());

    if (this.getDarkMode()) {
      localStorage.setItem("textColor", "black");
    } else {
      localStorage.setItem("textColor", "white");
    }

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

  ngOnInit(): void {
    this.darkMode.set(this.getDarkMode());
  }

  constructor(
    private userService: UserServiceService,
    public dialogRef: MatDialogRef<DeactivationRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User_Account_Deactivate_Request
  ) {}

  request: User_Account_Deactivate_Request =
    new User_Account_Deactivate_Request();

  Reason = new FormControl(this.request.reason, [Validators.required]);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
