// // import { Component } from '@angular/core';
// // import { AuthService } from '../../../Services/Login/auth.service';
// // import { Login } from '../../../Classes/auth-classes';
// // import { MatSnackBar } from '@angular/material/snack-bar';
// // import { Router } from '@angular/router';
// // import { UserServiceService } from '../../../Services/Users/user-service.service';

// // @Component({
// //   selector: 'app-otpverifier',
// //   templateUrl: './otpverifier.component.html',
// //   styleUrl: './otpverifier.component.scss'
// // })
// // export class OTPVerifierComponent {

// //   loginDTO: Login = new Login()

// //   constructor( private authService: AuthService, private _snackBar : MatSnackBar, private router: Router, private userService: UserServiceService){

// //   }
// // email:string ="";
// //   async sendOTP() {

// //     console.log(this.loginDTO);
// //     //this.isDisabled = true;
// //     await this.authService.sendOTP(this.loginDTO)
// //       .subscribe((jwtDTO) => {
// //         console.log(jwtDTO);
// //         if (jwtDTO) {
// //           //stepper.next()
// //           this.isDisabled = false;
// //           //this.changeStep1Status();

// //           this._snackBar.open("OTP is sent", "Close", {
// //             duration: 3000,
// //           })
// //         } else {
// //           this.isDisabled = false
// //           this._snackBar.open("Password is incorrect","Close", {
// //             duration: 3000,
// //           });
// //         }
        
// //       })
// //   }

// //   isDisabled = true

// //   async ActivateAccount() {

// //     console.log(this.loginDTO)
// //     await this.authService.ReactivateAccount(this.loginDTO)
// //       .subscribe((jwtDTO) => {
// //         console.log(jwtDTO);
// //         if (jwtDTO.flag) {

// //           this.isDisabled = false
// //           localStorage.setItem('jwtToken', jwtDTO.token);
// //           var role = this.userService.getUserRoleFromToken();

// //       switch (role.toLowerCase()) {
// //         case "superadmin":
// //           this.router.navigate(['/superadmin-dashboard']);
// //           break;
// //         case "admin":
// //           this.router.navigate(['/admin-dashboard']);
// //           break;
// //         case "client":
// //           this.router.navigate(['/client-dashboard']);
// //           break;
// //         case "employee":
// //           this.router.navigate(['']);
// //           break;
// //         default:
// //           this.router.navigate(['/user-dashboard']);
// //           break;}

// //         } else {
// //           this._snackBar.open(jwtDTO.message,"Close", {
// //             duration: 3000,
// //           });
// //         }
        
// //       })
// //   }

// // }
// import { Component } from '@angular/core';
// import { AuthService } from '../../../Services/Login/auth.service';
// import { Login } from '../../../Classes/auth-classes';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';
// import { UserServiceService } from '../../../Services/Users/user-service.service';

// @Component({
//   selector: 'app-otpverifier',
//   templateUrl: './otpverifier.component.html',
//   styleUrl: './otpverifier.component.scss'
// })
// export class OTPVerifierComponent {

//   loginDTO: Login = new Login()

//   constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router, private userService: UserServiceService){

//   }

//   email:string ="";
//   isDisabled = true;

//   async sendOTP() {
//     console.log(this.loginDTO);
//     await this.authService.sendOTP(this.loginDTO)
//       .subscribe((jwtDTO) => {
//         console.log(jwtDTO);
//         if (jwtDTO) {
//           this.isDisabled = false;
//           this._snackBar.open("OTP is sent", "Close", {
//             duration: 3000,
//           });
//         } else {
//           this.isDisabled = false;
//           this._snackBar.open("Password is incorrect","Close", {
//             duration: 3000,
//           });
//         }
//       })
//   }

//   async ActivateAccount() {
//     console.log(this.loginDTO);
//     await this.authService.ReactivateAccount(this.loginDTO)
//       .subscribe((jwtDTO) => {
//         console.log(jwtDTO);
//         if (jwtDTO.flag) {
//           this.isDisabled = false;
//           localStorage.setItem('jwtToken', jwtDTO.token);
//           var role = this.userService.getUserRoleFromToken();

//           switch (role.toLowerCase()) {
//             case "superadmin":
//               this.router.navigate(['/superadmin-dashboard']);
//               break;
//             case "admin":
//               this.router.navigate(['/admin-dashboard']);
//               break;
//             case "client":
//               this.router.navigate(['/client-dashboard']);
//               break;
//             case "employee":
//               this.router.navigate(['']);
//               break;
//             default:
//               this.router.navigate(['/user-dashboard']);
//               break;
//           }
//         } else {
//           this._snackBar.open(jwtDTO.message,"Close", {
//             duration: 3000,
//           });
//         }
//       })
//   }
// }


import { Component } from '@angular/core';
import { AuthService } from '../../../Services/Login/auth.service';
import { Login } from '../../../Classes/auth-classes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserServiceService } from '../../../Services/Users/user-service.service';

@Component({
  selector: 'app-otpverifier',
  templateUrl: './otpverifier.component.html',
  styleUrl: './otpverifier.component.scss'
})
export class OTPVerifierComponent {

  loginDTO: Login = new Login();
  hide: boolean = true; // Add this property to control OTP visibility

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserServiceService
  ) {}

  email: string = "";
  isDisabled = true;

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

  async sendOTP() {
    console.log(this.loginDTO);
    await this.authService.sendOTP(this.loginDTO).subscribe((jwtDTO) => {
      console.log(jwtDTO);
      if (jwtDTO) {
        this.hide = false;
        this.showModalSuccess("OTP Sent");
      } else {
        this.hide = false;
        this.showModalError("Password is incorrect");
      }
    });
  }

  async ActivateAccount() {
    console.log(this.loginDTO);
    await this.authService.ReactivateAccount(this.loginDTO).subscribe((jwtDTO) => {
      console.log(jwtDTO);
      if (jwtDTO.flag) {
        this.hide = false;
        localStorage.setItem('jwtToken', jwtDTO.token);
        var role = this.userService.getUserRoleFromToken();

        switch (role.toLowerCase()) {
          case "superadmin":
            this.router.navigate(['/superadmin-dashboard']);
            break;
          case "admin":
            this.router.navigate(['/admin-dashboard']);
            break;
          case "client":
            this.router.navigate(['/client-dashboard']);
            break;
          case "employee":
            this.router.navigate(['']);
            break;
          default:
            this.router.navigate(['/user-dashboard']);
            break;
        }
      } else {
        this.showModalInfo(jwtDTO.message);
      }
    });
  }
}
