// import { Component } from '@angular/core';
// import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatStepper, MatStepperModule } from '@angular/material/stepper';
// import { MatButtonModule } from '@angular/material/button';
// import { AgChartOptions } from 'ag-charts-community';
// import { AgCharts, AgChartsModule } from 'ag-charts-angular';
// import { CommonModule } from '@angular/common';
// import { first } from 'rxjs';
// import { AuthService } from '../../../Services/Login/auth.service';
// import { ChangePassword, Login } from '../../../Classes/auth-classes';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-change-password',
//   templateUrl: './change-password.component.html',
//   styleUrl: './change-password.component.scss',
//   standalone: true,
//   imports: [
//     MatButtonModule,
//     MatStepperModule,
//     FormsModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     AgCharts,
//     AgChartsModule,
//     CommonModule
//   ],
// })
// export class ChangePasswordComponent {

//   incrCounter: number = 0;
//   firstFormGroup = this._formBuilder.group({
//     firstCtrl: ['', Validators.required],
//   });
//   secondFormGroup = this._formBuilder.group({
//     secondCtrl: ['', [Validators.required, Validators.pattern(StrongPasswordRegx)]],
//     confirmSecondCtrl: ['', [Validators.required, Validators.pattern(StrongPasswordRegx)]],
//   });
//   OTP = this._formBuilder.group({
//     firstCtrl: ['', Validators.required],
//   });

//   constructor(private _formBuilder: FormBuilder, private authService: AuthService, private _snackBar : MatSnackBar, private router: Router) {

//   }
//   passbutton = true;
//   updatePassError() {
//     if (this.passwordFormField.value?.match('^(?=.*[A-Z])') && this.passwordFormField.value?.match('(?=.*[a-z])') && this.passwordFormField.value?.match('(.*[0-9].*)') && this.passwordFormField.value?.match('(?=.*[!@#$%^&*])') && this.passwordFormField.value?.match('.{8,}') && this.passwordFormField.value == this.passwordConfirmFormField.value) {
//       this.passbutton = false
//       console.log("f")
//     }
//     else {
//       this.passbutton = true
//       console.log("t")
//     }

//   }

//   get passwordFormField() {
//     return this.secondFormGroup.controls.secondCtrl;
//   }
//   get passwordConfirmFormField() {
//     return this.secondFormGroup.controls.confirmSecondCtrl;
//   }

//   CheckEmail() {
//     this.authService.getUserEmailFromToken()
//   }

//   //Stepper stuff
//   isDisabled = false;
//   firstStepCompleted = false

//   isDisabled2 = false;
//   secondStepCompleted = false;

//   changeStepStatus() {
//     this.firstStepCompleted = true
//   }

//   loginDTO = new Login()

//   //Check OTP
//   async goFowardOTP(stepper: MatStepper) {

//     this.loginDTO.email = this.authService.getUserEmailFromToken()
//     this.loginDTO.password = this.OTP.controls.firstCtrl.value ?? ""

//     console.log(this.loginDTO)
//     this.isDisabled = true;
//     await this.authService.checkOTP(this.loginDTO)
//       .subscribe((jwtDTO) => {
//         console.log(jwtDTO);
//         if (jwtDTO) {
//           stepper.next()
//           this.isDisabled = false;
//           this.changeStepStatus();
//         } else {
//           this.isDisabled = false
//           this._snackBar.open("Password is incorrect","Close", {
//             duration: 3000,
//           });
//         }

//       })
//   }

//   //Send OTP email
//   async goFoward(stepper: MatStepper) {

//     this.loginDTO.email = this.authService.getUserEmailFromToken()
//     this.loginDTO.password = this.firstFormGroup.controls.firstCtrl.value ?? ""

//     console.log(this.loginDTO)
//     this.isDisabled = true;
//     await this.authService.checkPassword(this.loginDTO)
//       .subscribe((jwtDTO) => {
//         console.log(jwtDTO);
//         if (jwtDTO.flag) {
//           stepper.next()
//           this.isDisabled = false;
//           this.changeStepStatus();
//         } else {
//           this.isDisabled = false
//           this._snackBar.open("Password is incorrect","Close", {
//             duration: 3000,
//           });
//         }

//       })
//   }

//   NewPassword: ChangePassword = new ChangePassword();
//   async goFowardCPass(stepper: MatStepper) {

//     this.NewPassword.email = this.authService.getUserEmailFromToken()
//     this.NewPassword.password = this.secondFormGroup.controls.secondCtrl.value ?? "";
//     this.NewPassword.confirmPassword = this.secondFormGroup.controls.confirmSecondCtrl.value ?? "";

//     console.log(this.loginDTO)
//     this.isDisabled = true;
//     await this.authService.ChangePassword(this.NewPassword)
//       .subscribe((jwtDTO) => {
//         console.log(jwtDTO);
//         if (jwtDTO) {
//           stepper.next()
//           this.isDisabled = false;
//           this.changeStepStatus();
//         } else {
//           this.isDisabled = false
//           this._snackBar.open("Password is incorrect","Close", {
//             duration: 3000,
//           });
//         }

//       })
//   }

//   goToLogin(){
//     this.router.navigateByUrl("/login")
//   }

// }

// export const StrongPasswordRegx: RegExp =
//   /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

////////////////////////////////////////////////////////////////////////////////////////
import { Component, HostBinding, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthService } from "../../../Services/Login/auth.service";
import { ChangePassword, Login } from "../../../Classes/auth-classes";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MatStepper } from "@angular/material/stepper";
import { CommonModule } from "@angular/common"; 
import { MatStepperModule } from "@angular/material/stepper"; 
import { MatInputModule } from "@angular/material/input"; 
import { MatButtonModule } from "@angular/material/button"; 
import { MatFormFieldModule } from "@angular/material/form-field"; 

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule, 
    MatInputModule, 
    MatButtonModule, 
    MatFormFieldModule, 
  ],
})
export class ChangePasswordComponent implements OnInit {
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

  // Form groups for each step
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ["", Validators.required],
  });

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

  OTP = this._formBuilder.group({
    firstCtrl: ["", Validators.required],
  });

  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  showIncorrectErrorModal: boolean = false;
  showOTPErrorModal: boolean = false;
  showConfirmModal: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.darkMode.set(this.getDarkMode());
  }

  passbutton = true;

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  closeIncorrectErrorModal() {
    this.showIncorrectErrorModal = false;
  }

  closeOTPErrorModal() {
    this.showOTPErrorModal = false;
  }

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

  // Stepper logic
  isDisabled = false;
  isDisabled2 = false;

  loginDTO = new Login();

  // Step 1: Check old password
  async goForward(stepper: MatStepper) {
    this.loginDTO.email = this.authService.getUserEmailFromToken();
    this.loginDTO.password = this.firstFormGroup.controls.firstCtrl.value ?? "";
    this.isDisabled = true;

    await this.authService.checkPassword(this.loginDTO).subscribe((jwtDTO) => {
      if (jwtDTO.flag) {
        stepper.next(); // Move to the next step
        this.isDisabled = false;
      } else {
        this.isDisabled = false;
        this.showIncorrectErrorModal = true;
      }
    });
  }

  // Step 2: Check OTP
  async goForwardOTP(stepper: MatStepper) {
    this.loginDTO.email = this.authService.getUserEmailFromToken();
    this.loginDTO.password = this.OTP.controls.firstCtrl.value ?? "";
    this.isDisabled2 = true;

    await this.authService.checkOTP(this.loginDTO).subscribe((jwtDTO) => {
      if (jwtDTO) {
        stepper.next(); // Move to the next step (Password Change)
        this.isDisabled2 = false;
      } else {
        this.isDisabled2 = false;
        this.showOTPErrorModal = true;
      }
    });
  }

  // Step 3: Change password
  NewPassword: ChangePassword = new ChangePassword();

  async goForwardCPass(stepper: MatStepper) {
    this.NewPassword.email = this.authService.getUserEmailFromToken();
    this.NewPassword.password =
      this.secondFormGroup.controls.secondCtrl.value ?? "";
    this.NewPassword.confirmPassword =
      this.secondFormGroup.controls.confirmSecondCtrl.value ?? "";
    this.isDisabled = true;

    await this.authService
      .ChangePassword(this.NewPassword)
      .subscribe((jwtDTO) => {
        if (jwtDTO) {
          stepper.next(); 
          this.isDisabled = false;
        } else {
          this.isDisabled = false;
          this.showErrorModal = true;
        }
      });
  }

  goToLogin() {
    this.router.navigateByUrl("/login");
  }
}

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
