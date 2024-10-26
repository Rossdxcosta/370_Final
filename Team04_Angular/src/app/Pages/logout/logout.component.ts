import { Component, HostBinding, OnInit, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit{
  //////////////////////////////////////////////////////////////////////////////////// DARKMODE STARTS

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
  
  constructor(public dialogRef: MatDialogRef<LogoutComponent>) {}
  
  ngOnInit(): void {
    this.darkMode.set(this.getDarkMode());
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}