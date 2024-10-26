import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserServiceService } from '../../Services/Users/user-service.service';
import { AuthService } from '../../Services/Login/auth.service';
import { ChatbotService } from '../../Services/Chatbot/chatbot.service';
import { LocationService } from '../../Services/Locations/location.service';
import { FormsModule } from '@angular/forms';
import { City, Country, State } from '../../Classes/location-classes';
import gsap from 'gsap';
import { ProfileIconComponent } from "../Profile/profile-icon/profile-icon.component";
import { Tag } from '../../Classes/tags-classes';
import { TagsService } from '../../Services/Tickets/Tags/tag.service';

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProfileIconComponent],
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss'
})
export class TestsComponent implements OnInit{

  constructor(private userService: UserServiceService, private authService: AuthService, private chatbotService : ChatbotService, private router: Router, private locationService: LocationService, private tagService: TagsService){
  gsap.registerPlugin()
  }
  chatID!: string
  email!: string

  Location!: Country

  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];

  selectedCountry: Country | null = null;
  selectedState: State | null = null;
  selectedCity: City | null = null;

  checkID(){
    alert(this.userService.getUserIDFromToken())
  }

  ngOnInit(): void {
    this.locationService.loadLocations().subscribe((brodie:Country[]) => {
      console.log(brodie[5].states)
      this.countries = brodie
    })


  }  

  onCountryChange() {
    if (this.selectedCountry) {
      this.states = this.selectedCountry.states;
      this.cities = [];
      this.selectedState = null;
      this.selectedCity = null;
    } else {
      this.states = [];
      this.cities = [];
      this.selectedState = null;
      this.selectedCity = null;
    }
  }

  onStateChange() {
    if (this.selectedState) {
      this.cities = this.selectedState.cities;
      this.selectedCity = null;
    } else {
      this.cities = [];
      this.selectedCity = null;
    }
  }

  saveLocations(){
    this.locationService.loadLocations().subscribe((brodie) => {
      console.log(brodie)
      this.locationService.SaveLocations(brodie).subscribe(a => {
        console.log("Countries saved successfully")
      })
    })
  }
  testtags! : Tag[]

  UploadTags(){
    this.tagService.getAllTags().subscribe(a => {
      this.chatbotService.uploadTags(a).subscribe()
    });
    
  }
  
}
