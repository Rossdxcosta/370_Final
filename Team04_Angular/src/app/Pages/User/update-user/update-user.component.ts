import { Component, HostBinding, Inject, OnInit, signal } from "@angular/core";
import {
  language,
  Title,
  User,
  UserEditDTO,
} from "../../../Classes/users-classes";
import { AuthService } from "../../../Services/Login/auth.service";
import { UserServiceService } from "../../../Services/Users/user-service.service";
import { Router } from "@angular/router";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Login } from "../../../Classes/auth-classes";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ImagesUploadService } from "../../../Services/Supabase/images-upload.service";

@Component({
  selector: "app-update-user",
  templateUrl: "./update-user.component.html",
  styleUrls: ["./update-user.component.scss"],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class UpdateUserComponent implements OnInit {
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

  maxdate = new Date();
  updatedUser: UserEditDTO = new UserEditDTO();
  currentFile?: File;
  message = "";
  preview = "";

  titles: Title[] = [];
  languages: language[] = [];

  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  showInfoModal: boolean = false;

  successMessage: string = "";
  errorMessage: string = "";
  infoMessage: string = "";

  showModalSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  showModalError(message: string): void {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  showModalInfo(message: string): void {
    this.infoMessage = message;
    this.showInfoModal = true;
  }

  closeInfoModal(): void {
    this.showInfoModal = false;
  }

  constructor(
    private authService: AuthService,
    private userService: UserServiceService,
    private router: Router,
    private _adapter: DateAdapter<any>,
    private _snackBar: MatSnackBar,
    private imageservice: ImagesUploadService,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) { }

  ngOnInit(): void {
    this.darkMode.set(this.getDarkMode());
    this.userService.GetAllLanguages().subscribe(
      (data: language[]) => {
        this.languages = data;
      },
      (error: any) => {
        this.showModalError("Could not fech languages");
        this.darkMode.set(this.getDarkMode());
      }
    );

    this.userService.GetAllTitles().subscribe(
      (data: Title[]) => {
        this.titles = data;
      },
      (error: any) => {
        console.error("Error fetching titles:", error);
      }
    );

    this.userService.GetUser().subscribe((user: User) => {
      this.updatedUser.email = user.email;
      this.updatedUser.name = user.user_Name;
      this.updatedUser.surname = user.user_Surname;
      this.updatedUser.phone = user.phone;
      this.updatedUser.title_ID = user.title_ID;
      this.updatedUser.language_ID = user.language_ID;
    });
  }

  onPhoneChange(phone: number) {
    this.updatedUser.phone = this.convertPhoneToString(phone);
  }

  convertPhoneToString(phone: number): string {
    let phoneString = phone.toString();

    if (phoneString.length === 9) {
      phoneString = "0" + phoneString;
    }

    return phoneString;
  }

  updateUser() {
    this.userService.UpdateUser(this.updatedUser).subscribe((res: any) => {
      if (res) {
        console.log("updated");
        this.upload();
      }
    });
  }

  back() {
    var role = this.userService.getUserRoleFromToken();

    switch (role.toLowerCase()) {
      case "superadmin":
        this.router.navigate(["/superadmin-dashboard"]);
        break;
      case "admin":
        this.router.navigate(["/admin-dashboard"]);
        break;
      case "client":
        this.router.navigate(["/client-dashboard"]);
        break;
      case "employee":
        this.router.navigate(["/employee-dashboard"]);
        break;
      default:
        this.router.navigate(["/user-dashboard"]);
        break;
    }
  }

  selectFile(event: any): void {
    this.message = "";
    this.preview = "";
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        this.preview = "";
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  upload() {
    this.imageservice
      .uploadImage(this.currentFile)
      .then((bruh) => {

        this.showModalSuccess("Changes Saved");

        var role = this.userService.getUserRoleFromToken();

        switch (role.toLowerCase()) {
          case "superadmin":
            this.router.navigate(["/superadmin-dashboard"]);
            break;
          case "admin":
            this.router.navigate(["/admin-dashboard"]);
            break;
          case "client":
            this.router.navigate(["/client-dashboard"]);
            break;
          case "employee":
            this.router.navigate(["/employee-dashboard"]);
            break;
          default:
            this.router.navigate(["/user-dashboard"]);
            break;
        }
      
      });
  }

  download() {
    this.imageservice.downloadImage().then((bruh) => {
      let url = URL.createObjectURL(bruh.data!);
      this.preview = url;
      if (bruh.error) {
      }
    });
  }
}
