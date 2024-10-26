import { Component, OnInit } from '@angular/core';
import { UserServiceService } from './Services/Users/user-service.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'SmartSupportAI';

  constructor(private userService: UserServiceService){}

  ngOnInit(): void {
    this.userService.getUserRoleFromToken();
    initFlowbite();
  }
}