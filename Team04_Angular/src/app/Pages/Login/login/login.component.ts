import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  signal,
  HostBinding,
  OnInit,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { merge } from "rxjs";
import { Login } from "../../../Classes/auth-classes";
import { AuthService } from "../../../Services/Login/auth.service";
import { Router } from "@angular/router";
import { UserServiceService } from "../../../Services/Users/user-service.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, AfterViewInit {
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

  loginDto = new Login();
  hide = true;
  emailMessage = "";
  passwordMessage = "";

  @ViewChild("passwordInput") passwordInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.darkMode.set(this.getDarkMode());
  }

  ngAfterViewInit() {
    const carLogin = document.getElementById("car-login");
    const carDown = document.getElementById("down");
    const passwordInput = this.passwordInput.nativeElement;

    passwordInput.addEventListener("focus", () => {
      carLogin?.classList.add("password");
      carDown?.classList.add("password");
    });

    passwordInput.addEventListener("blur", () => {
      carLogin?.classList.remove("password");
      carDown?.classList.remove("password");
    });
  }

  login(event: Event) {
    event.preventDefault();
    if (!this.loginDto.email) {
      this.emailMessage = "Please input your email";
      return;
    }
    if (!this.loginDto.password) {
      this.passwordMessage = "Please input your password";
      return;
    }

    this.authService.login(this.loginDto).subscribe({
      next: (jwtDto) => {
        if (!jwtDto.flag) {
          alert(jwtDto.message);
          if (jwtDto.message == 'Deactivated') {
            this.router.navigateByUrl('/Verify-User');
          }
        } else {
          sessionStorage.setItem("jwtToken", jwtDto.token);
          const role = this.userService.getUserRoleFromToken();
          this.authService.generateSupabaseToken()
          this.navigateBasedOnRole(role);
        }
      },
      error: (error) => {
        console.error("Login failed:", error);
        alert("Login Failed");
      },
    });
  }

  private navigateBasedOnRole(role: string) {
    const roleRoutes: { [key: string]: string } = {
      superadmin: "/superadmin-dashboard",
      admin: "/admin-dashboard",
      client: "/client-dashboard",
      employee: "/employee-dashboard",
    };
    this.router.navigate([roleRoutes[role.toLowerCase()] || "/user-dashboard"]);
  }
}
