import { Component, HostBinding, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  darkMode = signal<boolean>(false);
  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

  setDarkMode() {
    this.darkMode.set(!this.darkMode());

    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  getDarkMode() {
    console.log(localStorage.getItem('darkMode'));
    if (localStorage.getItem('darkMode') == '[Signal: true]') {
      return true;
    }
    else {
      return false;
    };
  }
  
  ngOnInit(): void {
    this.setDarkMode();
  }
}
