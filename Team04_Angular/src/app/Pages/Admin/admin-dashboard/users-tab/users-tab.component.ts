import { Component } from '@angular/core';
import { DeactivationRequestsComponent } from '../../deactivation-requests/deactivation-requests.component';

import gsap from 'gsap';
import { UserRoleTableComponent } from '../../user-role-table/user-role-table.component';
import { AccountRequestsComponent } from '../../account-requests/account-requests.component';

@Component({
  selector: 'app-users-tab',
  templateUrl: './users-tab.component.html',
  styleUrl: './users-tab.component.scss',
  standalone: true,
  imports: [
    DeactivationRequestsComponent,
    UserRoleTableComponent,
    AccountRequestsComponent
  ]
})
export class UsersTabComponent {
  constructor(){
    gsap.registerPlugin()
  }

  scroll(page: number){
    gsap.to(".table-container",{x:-(page*9)+"0vw"})
  }
}
