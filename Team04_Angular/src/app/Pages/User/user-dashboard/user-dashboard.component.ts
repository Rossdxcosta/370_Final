import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  HostBinding,
  OnInit,
  signal,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { AuthService } from "../../../Services/Login/auth.service";
import { DeactivationRequestComponent } from "../deactivation-request/deactivation-request.component";
import { UserAccountRequestComponent } from "../user-account-request/user-account-request.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { User_Account_Deactivate_Request } from "../../../Classes/requests";
import { UserServiceService } from "../../../Services/Users/user-service.service";
import { MatDialog } from "@angular/material/dialog";
import { ProfileIconComponent } from "../../Profile/profile-icon/profile-icon.component";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LogoutComponent } from "../../logout/logout.component";

@Component({
  selector: "app-user-dashboard",
  templateUrl: "./user-dashboard.component.html",
  styleUrl: "./user-dashboard.component.scss",
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, ProfileIconComponent, CommonModule],
})
export class UserDashboardComponent implements AfterViewInit, OnInit {
  //////////////////////////////////////////////////////////////////////////////////// DARKMODE STARTS

  username: string = '';
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

  //////////////////////////////////////////////////////////////////////////////////// DARKMODE ENDS

  userDRequest: User_Account_Deactivate_Request =
    new User_Account_Deactivate_Request();
  @ViewChild("dynamicComponentContainer", { read: ViewContainerRef })
  dynamicComponentContainer!: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService,
    private userService: UserServiceService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  showMenu: boolean = false;

  updateUser() {
    this.router.navigateByUrl("Update-User");
  }

  ngOnInit(): void {
    //console.log(this.userService.getUserIDFromToken())
    this.userDRequest.userID = this.userService.getUserIDFromToken();
    this.userService.GetUser().subscribe(e => {
      this.username =  e.user_Name + ' ' + e.user_Surname;
    });
    this.darkMode.set(this.getDarkMode());
  }

  ngAfterViewInit(): void {
    this.LoadUserAccountRequestForm();
  }

  showMenuModal() {
    this.showMenu = true;
  }
  
  closeMenuModal() {
    this.showMenu = false;
  }

  LoadDeactivationRequest() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        DeactivationRequestComponent
      );
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }

  LoadUserAccountRequestForm() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        UserAccountRequestComponent
      );
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentFactory);
  }


  logout(): void {
    const dialogRef = this.dialog.open(LogoutComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
      }
    })
  }

  requestDeactivation(request: User_Account_Deactivate_Request) {
    if (!this.userService.getUserIDFromToken()) {
      alert("You are not logged in");
    } else {
      this.userService.RequestDeactivation(request).subscribe(
        (a) => {},
        (error) => {
          console.error(error);
          //this.errorMessage = 'Registration failed.';
        }
      );
    }
  }

  openDialog(request: User_Account_Deactivate_Request): void {
    const dialogRef = this.dialog.open(DeactivationRequestComponent, {
      data: request,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed", result);
      this.requestDeactivation(result);
    });
  }
}
