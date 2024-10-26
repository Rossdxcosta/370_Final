import { Component, OnInit } from '@angular/core';
import { Software, SoftwareRequest } from '../../../Classes/software';
import { SoftwareServiceService } from '../../../Services/Software/software-service.service';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-software-request',
  templateUrl: './software-request.component.html',
  styleUrls: ['./software-request.component.scss']
})
export class SoftwareRequestComponent implements OnInit {
  allSoftware: Software[] = [];
  displayedSoftware: Software[] = [];
  filteredSoftware: Software[] = [];
  searchQuery: string = '';
  newRequest: SoftwareRequest = new SoftwareRequest();
  selectedSoftware: Software | null = null;

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  // Loading and data state management
  isLoading: boolean = true;
  isData: boolean = false;
  isTableData: boolean = false;

  // Modal control properties
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  showConfirmModal: boolean = false;
  errorMessage: string = '';

  constructor(
    private softwareService: SoftwareServiceService,
    private userService: UserServiceService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllSoftware();
  }

  getAllSoftware(): void {
    this.isLoading = true; 
    this.softwareService.getAllSoftware().subscribe(
      (software) => {
        this.allSoftware = software;
        this.totalItems = software.length;
        this.isLoading = false; 
        this.isData = software.length > 0;
        this.isTableData = this.isData;
        this.updateDataSource();
      },
      (error) => {
        this.isLoading = false;
        this.isData = false;
        this.isTableData = false;
        console.error('Error fetching software:', error);
      }
    );
  }

  requestSoftware(softID: number): void {
    this.newRequest.clientID = this.userService.getUserIDFromToken();
    this.newRequest.softID = softID;

    console.log('Requesting software with ID:', softID);
    console.log('Client ID:', this.newRequest.clientID);
    console.log('Software Request Object:', this.newRequest);

    this.isLoading = true; 
    this.softwareService.requestSoftware(this.newRequest).subscribe(
      (res) => {
        this.isLoading = false;
        console.log('Software request successful:', res);
        this.openSuccessModal();
        this.closeConfirmationModal();
      },
      (error) => {
        this.isLoading = false; 
        this.errorMessage = 'Error requesting software. Please try again.';
        console.error('Error occurred during software request:', error);
        this.openErrorModal(); 
        this.closeConfirmationModal();
      }
    );
}


  searchSoftware(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      this.isTableData = false;
      const filteredSoftware = this.allSoftware.filter((software) =>
        software.software_Name.toLowerCase().includes(query) ||
        software.software_Description.toLowerCase().includes(query)
      );
      this.totalItems = filteredSoftware.length;
      this.updateDataSource(filteredSoftware);

      if (filteredSoftware.length > 0) {
        this.isTableData = true;
      }
    } else {
      this.isTableData = true;
      this.totalItems = this.allSoftware.length;
      this.updateDataSource();
    }
  }

  // Update Table from Pagination
  updateDataSource(filteredSoftware: Software[] = this.allSoftware): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.displayedSoftware = filteredSoftware.slice(start, end);
  }

  // Update Pagination Numbers
  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  // Modal control methods
  openSuccessModal(): void {
    this.showSuccessModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  openErrorModal(): void {
    this.showErrorModal = true;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  openConfirmationModal(software: Software): void {
    this.selectedSoftware = software;
    this.showConfirmModal = true;
  }

  closeConfirmationModal(): void {
    this.showConfirmModal = false;
    this.selectedSoftware = null;
  }

  confirmSoftware(): void {
    if (this.selectedSoftware) {
        console.log('Confirming software request for:', this.selectedSoftware);
        this.requestSoftware(this.selectedSoftware.software_ID);
    } else {
        console.error('No software selected for confirmation');
    }
}

  // Pagination Calculation
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
