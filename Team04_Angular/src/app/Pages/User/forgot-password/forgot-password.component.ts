// import { Component } from '@angular/core';
// import { Login } from '../../../Classes/auth-classes';
// import { AuthService } from '../../../Services/Login/auth.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';
// import { UserServiceService } from '../../../Services/Users/user-service.service';

// @Component({
//   selector: 'app-forgot-password',
//   templateUrl: './forgot-password.component.html',
//   styleUrl: './forgot-password.component.scss'
// })
// export class ForgotPasswordComponent {

// Test!: string

// loginDTO: Login = new Login()

//   constructor( private authService: AuthService, private _snackBar : MatSnackBar, private router: Router, private userService: UserServiceService){

//   }

//   async VerifySecurityCode() {

//     console.log(this.loginDTO)
//     await this.authService.VerifySecCode(this.loginDTO)
//       .subscribe((jwtDTO) => {
//         console.log(jwtDTO);
//         if (jwtDTO.flag) {

//           //this.isDisabled = false
//           localStorage.setItem('jwtToken', jwtDTO.token);
//           var role = this.userService.getUserRoleFromToken();

//       switch (role.toLowerCase()) {
//         case "superadmin":
//           this.router.navigate(['/superadmin-dashboard']);
//           break;
//         case "admin":
//           this.router.navigate(['/admin-dashboard']);
//           break;
//         case "client":
//           this.router.navigate(['/client-dashboard']);
//           break;
//         case "employee":
//           this.router.navigate(['']);
//           break;
//         default:
//           this.router.navigate(['/user-dashboard']);
//           break;}

//         } else {
//           this._snackBar.open(jwtDTO.message,"Close", {
//             duration: 3000,
//           });
//         }

//       })
//   }

// }
import { Component, HostBinding, OnInit, signal } from "@angular/core";
import { ChangePassword, Login } from "../../../Classes/auth-classes";
import { AuthService } from "../../../Services/Login/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { UserServiceService } from "../../../Services/Users/user-service.service";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrl: "./forgot-password.component.scss",
})
export class ForgotPasswordComponent implements OnInit {
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

  pingemail() {
    console.log(this.loginDTO.email);
  }

  Test!: string;
  loginDTO: Login = new Login();
  otpSent: boolean = false;
  email: string = "";

  errorMessage: string = "";
  hide: boolean = true;


  secondFormGroup = this._formBuilder.group({
    secondCtrl: [
      "",
      [Validators.required, Validators.pattern(StrongPasswordRegx)],
    ],
    confirmSecondCtrl: [
      "",
      [Validators.required, Validators.pattern(StrongPasswordRegx)],
    ],
  });
  // Modal feedback properties
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserServiceService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.darkMode.set(this.getDarkMode());
  }

  async sendOTP() {
    console.log(this.email);
    await this.authService.sendCEOTP(this.loginDTO).subscribe((jwtDTO) => {
      if (jwtDTO) {
        this.otpSent = true;
        this.openSuccessModal();
      } else {
        this.otpSent = false;
        this.openErrorModal();
      }
    });
  }

  isDisabled = true;

  NewPassword: ChangePassword = new ChangePassword();

  async goForwardCPass() {
    this.NewPassword.email = this.loginDTO.email;
    this.NewPassword.password =
      this.secondFormGroup.controls.secondCtrl.value ?? "";
    this.NewPassword.confirmPassword =
      this.secondFormGroup.controls.confirmSecondCtrl.value ?? "";
    this.isDisabled = true;

    await this.authService
      .ChangePassword(this.NewPassword)
      .subscribe((jwtDTO) => {
        if (jwtDTO) {
          this.isDisabled = false;
          this.goToLogin()
        } else {
          this.isDisabled = false;
          this.showErrorModal = true;
        }
      });
  }

  passbutton=false;

  updatePassError() {
    if (
      this.passwordFormField.value?.match("^(?=.*[A-Z])") &&
      this.passwordFormField.value?.match("(?=.*[a-z])") &&
      this.passwordFormField.value?.match("(.*[0-9].*)") &&
      this.passwordFormField.value?.match("(?=.*[!@#$%^&*])") &&
      this.passwordFormField.value?.match(".{8,}") &&
      this.passwordFormField.value === this.passwordConfirmFormField.value
    ) {
      this.passbutton = false; 
    } else {
      this.passbutton = true; 
    }
  }

  get passwordFormField() {
    return this.secondFormGroup.controls.secondCtrl;
  }

  get passwordConfirmFormField() {
    return this.secondFormGroup.controls.confirmSecondCtrl;
  }

  goToLogin() {
    this.router.navigateByUrl("/login");
  }

  async VerifySecurityCode() {
    await this.authService.VerifySecCode(this.loginDTO).subscribe(
      (jwtDTO) => {
        console.log(jwtDTO);
        if (jwtDTO.flag) {
          this.isDisabled = false
        } else {
          this._snackBar.open(jwtDTO.message, "Close", {
            duration: 3000,
          });
          this.errorMessage = jwtDTO.message;
        }
      },
      (error) => {
        this.errorMessage = "An error occurred while verifying the code.";
      }
    );
  }

  // Modal control methods
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
    this.showErrorModal = false;
  }
}

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
