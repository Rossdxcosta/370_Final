import { Component, OnInit } from '@angular/core';
import { AdminDataServiceService, VDIRequest } from '../../../Services/Admin/admin-data-service.service';
import { VDIService } from '../../../Services/VDI/VDI-service.service';
import { VDI } from '../../../Classes/VDI'; 

@Component({
  selector: 'app-vdi-requests',
  templateUrl: './software-request.component.html',
  styleUrls: ['./software-request.component.scss']
})
export class SftRequestsComponent implements OnInit {
  vdiRequests: VDIRequest[] = [];
  isLoading: boolean = true;
  isData: boolean = false;
  isTableData: boolean = false;
  showApproveModal: boolean = false;
  showDenyModal: boolean = false;
  selectedVDIRequestID: number = 0;
  vdiMap: { [key: number]: string } = {}; 

  constructor(private adminService: AdminDataServiceService, private vdiService: VDIService) { }

  ngOnInit(): void {
    this.loadVDIs(); 
    this.loadVDIRequests(); 
  }

  loadVDIs() {
    this.vdiService.GetAllVDI().subscribe(
      (vdIs: VDI[]) => {
        this.vdiMap = {};
        vdIs.forEach(vdi => {
          this.vdiMap[vdi.vdI_ID] = vdi.vdI_Name; 
        });
      },
      (error) => {
        console.error('Error fetching VDIs:', error);
      }
    );
  }

  loadVDIRequests() {
    this.isLoading = true;
    this.adminService.getVDIRequests().subscribe(
      (data) => {
        console.log('VDI Requests:', data); 
        this.vdiRequests = data.map(request => ({
          ...request,
          vdiName: this.vdiMap[request.vdI_ID] || 'Unknown VDI' 
        }));
        this.isLoading = false;
        this.isData = this.vdiRequests.length > 0;
        this.isTableData = this.isData;
      },
      (error) => {
        console.error('Error fetching VDI requests:', error);
        this.isLoading = false;
        this.isData = false;
        this.isTableData = false;
      }
    );
  }

  openApproveModal(vdI_Request_ID: number) {
    this.selectedVDIRequestID = vdI_Request_ID;
    console.log(vdI_Request_ID);
    this.showApproveModal = true;
  }

  closeApproveModal() {
    this.showApproveModal = false;
    this.selectedVDIRequestID = 0;
  }

  openDenyModal(vdiRequestID: number) {
    this.selectedVDIRequestID = vdiRequestID;
    this.showDenyModal = true;
  }

  closeDenyModal() {
    this.showDenyModal = false;
    this.selectedVDIRequestID = 0;
  }

  approveVDIRequest() {
    console.log(this.selectedVDIRequestID);
    this.adminService.approveVDIRequest(this.selectedVDIRequestID).subscribe(
      (response) => {
        console.log('VDI request approved:', response);
        this.loadVDIRequests();
        this.closeApproveModal();
      },
      (error) => {
        console.error('Error approving VDI request:', error);
      }
    );
  }

  denyVDIRequest() {
    if (this.selectedVDIRequestID === 0) return;

    this.adminService.denyVDIRequest(this.selectedVDIRequestID).subscribe(
      (response) => {
        console.log(response);
        this.loadVDIRequests();
        this.closeDenyModal();
      },
      (error) => {
        console.error('Error denying VDI request:', error);
      }
    );
  }
}
