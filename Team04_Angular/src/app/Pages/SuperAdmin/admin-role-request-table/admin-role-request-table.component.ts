// import { Component, OnInit } from '@angular/core';
// import { SuperAdminDataServiceService } from '../../../Services/SuperAdmin/super-admin-data-service.service';
// import { AccountRequestDTO } from '../../../Classes/requests';

// @Component({
//   selector: 'app-admin-role-request-table',
//   templateUrl: './admin-role-request-table.component.html',
//   styleUrl: './admin-role-request-table.component.scss'
// })
// export class AdminRoleRequestTableComponent implements OnInit {
//   requests: AccountRequestDTO[] = [];
//   searchQuery: string = '';

//   constructor(private dataService: SuperAdminDataServiceService){}

//   ngOnInit(): void {
//     this.ViewAdminRequests();
//   }

//   ViewAdminRequests(){
//     this.dataService.ViewAdminRequests().subscribe(requests => {
//       this.requests = requests;
//     });
//   }

//   AcceptRequest(id: number){
//     this.dataService.AcceptAdminRequest(id).subscribe(e =>{
//       this.ViewAdminRequests();
//     });
//   }

//   DenyRequest(id: number){
//     this.dataService.DenyAdminRequest(id).subscribe(e =>{
//       this.ViewAdminRequests();
//     });
//   }

//   searchRequestee(): void {
//     if (this.searchQuery) {
//       this.requests = this.requests.filter((request: any) => (request.request.user.user_Name.toLowerCase().includes(this.searchQuery.toLowerCase())));
//     } else {
//       this.ViewAdminRequests();
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { SuperAdminDataServiceService } from '../../../Services/SuperAdmin/super-admin-data-service.service';
import { AccountRequestDTO } from '../../../Classes/requests';

@Component({
  selector: 'app-admin-role-request-table',
  templateUrl: './admin-role-request-table.component.html',
  styleUrls: ['./admin-role-request-table.component.scss']
})
export class AdminRoleRequestTableComponent implements OnInit {
  // Loading Section
  isLoading: boolean = true;
  isData: boolean = false;
  isTableData: boolean = false;

  // Modal control properties
  showCloseConfirmModal: boolean = false;
  showReopenConfirmModal: boolean = false;
  showApproveRequestModal: boolean = false;
  showDenyRequestModal: boolean = false;
  requestId: number = 0;
  userId: number = 0;

  requests: AccountRequestDTO[] = [];
  searchQuery: string = '';

  constructor(private dataService: SuperAdminDataServiceService) {}

  ngOnInit(): void {
    this.ViewAdminRequests();
  }

  ViewAdminRequests() {
    this.dataService.ViewAdminRequests().subscribe(requests => {
      this.requests = requests;
      this.isLoading = false;

      if (this.requests.length > 0) {
        this.isData = true;
        this.isTableData = true;
      } else {
        this.isData = false;
        this.isTableData = false;
      }
    });
  }

  AcceptRequest(id: number) {
    this.dataService.AcceptAdminRequest(id).subscribe(() => {
      this.ViewAdminRequests();
      this.closeAcceptModal();
    });
  }

  DenyRequest(id: number) {
    this.dataService.DenyAdminRequest(id).subscribe(() => {
      this.ViewAdminRequests();
      this.closeDenyModal();
    });
  }

  openAcceptModal(id: number) {
    this.showApproveRequestModal = true;
    this.userId = id;
  }

  closeAcceptModal() {
    this.showApproveRequestModal = false;
  }

  openDenyModal(id: number) {
    this.showDenyRequestModal = true;
    this.requestId = id;
  }

  closeDenyModal() {
    this.showDenyRequestModal = false;
  }

  searchRequestee(): void {
    if (this.searchQuery) {
      this.requests = this.requests.filter(request =>
        request.request.user.user_Name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.request.user.user_Surname.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.ViewAdminRequests();
    }
  }
}

