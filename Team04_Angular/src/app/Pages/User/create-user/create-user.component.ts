import { Component, HostBinding, Inject, OnDestroy, OnInit, signal } from "@angular/core";
import { Login, Register } from "../../../Classes/auth-classes";
import { AuthService } from "../../../Services/Login/auth.service";
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  UntypedFormBuilder,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { merge } from "jquery";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import {
  MatDatepickerIntl,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { Title, language } from "../../../Classes/users-classes";
import { MatSelectModule } from "@angular/material/select";
import { UserServiceService } from "../../../Services/Users/user-service.service";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { MatSnackBar } from "@angular/material/snack-bar";
import gsap from "gsap";
import { SignUpAnimationService } from "../../../Services/AnimationServices/sign-up-animation.service";
import {
  findFlagUrlByCountryName,
  findFlagUrlByIso3Code,
  findFlagUrlByNationality,
} from "country-flags-svg-v2";
import { City, Country, State } from "../../../Classes/location-classes";
import { LocationService } from "../../../Services/Locations/location.service";

//import {provideMomentDateAdapter} from '@angular/material-moment-adapter';

@Component({
  selector: "app-create-user",
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatSelectModule,
    CommonModule,
    MatStepperModule,
  ],
  templateUrl: "./create-user.component.html",
  styleUrl: "./create-user.component.scss",
})
export class CreateUserComponent implements OnInit, OnDestroy {

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
    
  registerDto = new Register();

  otpDto = new Login();

  maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 16));

  //TODO: import from table
  titles: Title[] = [];

  languages: language[] = [];

  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];

  selectedCountry: Country | null = null;
  selectedState: State | null = null;
  selectedCity: City | null = null;
  aCity!: City;

  citySelected = false;

  ngOnInit(): void {
    this.darkMode.set(this.getDarkMode());
    this.userService.GetAllLanguages().subscribe(
      (data: language[]) => {
        this.languages = data;
      },
      (error: any) => {
        console.error("Error fetching priorities:", error);
      }
    );
    this.userService.GetAllTitles().subscribe(
      (data: Title[]) => {
        this.titles = data;
      },
      (error: any) => {
        console.error("Error fetching priorities:", error);
      }
    );

    this.password.valueChanges.subscribe((value) => {
      console.log(value);
      this.updatePassError();
    });
    this.passwordConfirm.valueChanges.subscribe((value) => {
      console.log(value);
      this.updatePassError();
    });

    this.startAnimation();

    this.locationService.loadLocations().subscribe((brodie: Country[]) => {
      console.log(brodie[5].states);
      this.countries = brodie;
    });
  }

  onCountryChange() {
    if (this.selectedCountry) {
      this.states = this.selectedCountry.states;
      this.cities = [];
      this.selectedState = null;
      this.selectedCity = null;
      this.citySelected = false;
    } else {
      this.states = [];
      this.cities = [];
      this.selectedState = null;
      this.selectedCity = null;
      this.citySelected = false;
    }
  }

  onStateChange() {
    if (this.selectedState) {
      this.cities = this.selectedState.cities;
      this.selectedCity = null;
      this.citySelected = false;
    } else {
      this.cities = [];
      this.selectedCity = null;
      this.citySelected = false;
    }
  }

  onCityChange() {
    if (this.selectedCity) {
      this.aCity = this.selectedCity;
      this.citySelected = true;
    }
  }

  ngOnDestroy() {
    this.animationService.stopAnimation();
  }

  async register(): Promise<void> {
    this.registerDto.name = this.name.value ?? "";
    this.registerDto.surname = this.surname.value ?? "";
    this.registerDto.email = this.email.value ?? "";
    this.registerDto.dob = this.dob.value ?? new Date();
    this.registerDto.titleID = this.title.value ?? 1;
    this.registerDto.languageID = this.language.value ?? 1;
    this.registerDto.password = this.password.value ?? "";
    this.registerDto.confirmPassword = this.passwordConfirm.value ?? "";
    this.registerDto.cityID = this.aCity.id;

    await this.authService.register(this.registerDto).subscribe(
      (jwtDto) => {
        sessionStorage.setItem("jwtToken", jwtDto.token);
        console.log(jwtDto);
        if (!jwtDto.flag) {
          this.showModalError(jwtDto.message);
        } else {
          this.showModalSuccess("Registration successful! Welcome!");
          var role = this.userService.getUserRoleFromToken();

          this.generatetoken();

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
              this.router.navigate([""]);
              break;
            default:
              this.router.navigate(["/user-dashboard"]);
              break;
          }
        }
      },
      (error) => {
        console.error(error);
        this.showModalError("Registration failed. Please try again.");
      }
    );
  }

  generatetoken() {
    this.authService.generateSupabaseToken();
  }

  trackByTitle(index: number, atitle: Title): number {
    return atitle.title_ID;
  }
  
  trackByLanguage(index: number, lang: language): number {
    return lang.language_ID;
  }
  
  //_______________________________________________________________________//
  //Validation

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

  hide = true;
  
  //email form field
  name = new FormControl(this.registerDto.name, [Validators.required]);
  surname = new FormControl(this.registerDto.surname, [Validators.required]);
  email = new FormControl(this.registerDto.email, [
    Validators.required,
    Validators.email,
  ]);

  otp = new FormControl(this.otpDto.password, Validators.required);

  dob = new FormControl(this.registerDto.dob, [Validators.required]);
  title = new FormControl(this.registerDto.titleID, [Validators.required]);
  language = new FormControl(this.registerDto.languageID, [
    Validators.required,
  ]);

  password = new FormControl(this.registerDto.password, [
    Validators.required,
    Validators.pattern(StrongPasswordRegx),
  ]);
  passwordConfirm = new FormControl(this.registerDto.confirmPassword, [
    Validators.required,
    Validators.pattern(StrongPasswordRegx),
  ]);

  city = new FormControl(this.registerDto.cityID);

  constructor(
    private authService: AuthService,
    private userService: UserServiceService,
    private router: Router,
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private animationService: SignUpAnimationService,
    private locationService: LocationService
  ) {
    this.email.statusChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());

    this.email.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());

    gsap.registerPlugin();
  }

  updateErrorMessage() {
    if (this.email.hasError("required")) {
      this.errorMessage = "You must enter a value";
    } else if (this.email.hasError("email")) {
      this.errorMessage = "Not a valid email";
    } else {
      this.errorMessage = "";
    }
  }

  login() {
    this.router.navigate(["/login"]);
  }

  passbutton = true;

  updatePassError() {
    if (
      this.password.value?.match("^(?=.*[A-Z])") &&
      this.password.value?.match("(?=.*[a-z])") &&
      this.password.value?.match("(.*[0-9].*)") &&
      this.password.value?.match("(?=.*[!@#$%^&*])") &&
      this.password.value?.match(".{8,}") &&
      this.password.value == this.passwordConfirm.value
    ) {
      this.passbutton = false;
    } else {
      this.passbutton = true;
    }
  }

  onFileChanged(event: any) {
    const file = event.target.files[0];
  }

  editForm = this.fb.group({
    photo: [],
  });

  get passwordFormField() {
    return this.password;
  }
  get passwordConfirmFormField() {
    return this.password;
  }

  nextPage(stepper: MatStepper) {
    stepper.next();
  }

  Step2Completed = false;

  changeStep2Status() {
    this.Step2Completed = true;
  }

  isDisabled: boolean = true;

  async goConfirmOTP() {
    this.otpDto.email = this.email.value ?? "";
    this.otpDto.password = this.otp.value ?? "";

    console.log(this.otpDto);
    this.isDisabled = true;
    this.authService.checkOTP(this.otpDto).subscribe((jwtDTO) => {
      if (jwtDTO == true) {
        this.showModalSuccess("OTP verified successfully!");
        this.changeStep2Status();
        this.isDisabled = false;
      } else {
        this.isDisabled = false;
        this.showModalError("OTP is incorrect. Please try again.");
      }
    });
  }

  Step1Completed = false;

  changeStep1Status() {
    this.Step1Completed = true;
  }

  async sendOTP(stepper: MatStepper) {
    this.otpDto.email = this.email.value ?? "";
    this.otpDto.password = this.otp.value ?? "";

    console.log(this.otpDto);
    //this.isDisabled = true;
    await this.authService.sendOTP(this.otpDto).subscribe((jwtDTO) => {
      console.log(jwtDTO);
      if (jwtDTO) {
        stepper.next();
        //this.isDisabled = false;
        this.changeStep1Status();
      } else {
        this.isDisabled = false;
        this.showModalError("Password is incorrect. Please try again.");
      }
    });
  }

  currentImageSrc: string =
    "../../../../assets/SignupFrames/character_robot_walk0.png";
  animationEnabled: boolean = false;

  startAnimation() {
    this.animationService.startAnimation(
      14, // frameRate: 30 fps
      this.animationEnabled,
      (frameNumber: number) => {
        this.currentImageSrc = `../../../../assets/SignupFrames/character_robot_walk${frameNumber}.png`;
      }
    );
  }

  toggleAnimation() {
    this.animationEnabled = !this.animationEnabled;
    if (this.animationEnabled) {
      this.startAnimation();
    } else {
      this.animationService.stopAnimation();
    }
  }

  flagurl = findFlagUrlByCountryName("Germany");

  setFlag(code: any) {
    console.log(code);
    this.toggleAnimation();
    gsap
      .timeline()
      .fromTo(
        ".flag",
        { x: 0 },
        {
          x: -300,
          onComplete: () => {
            this.changeFlag(code);
          },
        }
      )
      .fromTo(
        ".flag",
        { x: 1000 },
        {
          x: 0,
          onComplete: () => {
            this.toggleAnimation();
          },
        }
      );
  }

  changeFlag(code: string) {
    this.flagurl = findFlagUrlByCountryName(code);
  }

  setGermanFlag() {}
}

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
