import { Component, OnInit } from '@angular/core';
import { Software } from '../../../Classes/software';
import { SoftwareServiceService } from '../../../Services/Software/software-service.service';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit {
  // Software properties
  software: Software[] = [];
  displayedSoftware: Software[] = [];
  currentSoftware: Software = new Software();
  searchQuery: string = '';
  isEdit: boolean = false;

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  // Modal control properties
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  deleteSoftwareId: number | null = null;

  // Loading control properties
  isLoading: boolean = false;
  isData: boolean = false;
  isTableData: boolean = false;

  // Modal feedback properties
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  showDeleteConfirmedModal: boolean = false;

  constructor(private softwareService: SoftwareServiceService) {}

  ngOnInit(): void {
    this.loadSoftware();
  }

  loadSoftware(): void {
    this.softwareService.getAllSoftware().subscribe(software => {
      this.software = software;
      this.totalItems = software.length;
      this.updateDataSource();
      this.isLoading = false;
      if (software.length > 0) {
        this.isData = true;
        this.isTableData = true;
      } else {
        this.isData = false;
        this.isTableData = false;
      }
    });
  }

  openAddModal(): void {
    this.isEdit = false;
    this.currentSoftware = new Software();
    this.openModal();
    this.showModal = true;
  }

  openEditModal(software: Software): void {
    this.isEdit = true;
    this.currentSoftware = { ...software };
    this.openModal();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  openModal(): void {
    const modal = document.getElementById('crud-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  openDeleteModal(softwareId: number): void {
    this.deleteSoftwareId = softwareId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  onSubmit(): void {
    if (this.isEdit) {
      this.softwareService.updateSoftware(this.currentSoftware).subscribe(() => {
        this.loadSoftware();
        this.closeModal();
        this.openSuccessModal();
      });
    } else {
      this.softwareService.createNewSoftware(this.currentSoftware).subscribe(() => {
        this.loadSoftware();
        this.closeModal();
        this.openSuccessModal();
      });
    }
  }

  confirmDelete(): void {
    if (this.deleteSoftwareId) {
      this.softwareService.deleteSoftware(this.deleteSoftwareId).subscribe(
        () => {
          this.loadSoftware();
          this.closeDeleteModal();
          this.openDeleteConfirmedModal();
        },
        (error) => {
          console.error('Error deleting software:', error);
          this.openErrorModal();
        }
      );
    }
  }

  searchSoftware(): void {
    if (this.searchQuery) {
      this.isTableData = false;
      const query = this.searchQuery.toLowerCase();
      const filteredSoftware = this.software.filter(software =>
        software.software_Name.toLowerCase().includes(query) || 
        software.software_Description.toLowerCase().includes(query)
      );

      if (filteredSoftware.length > 0) {
        this.isTableData = true;
      }

      this.totalItems = filteredSoftware.length;
      this.updateDataSource(filteredSoftware);
    } else {
      this.isTableData = true;
      this.totalItems = this.software.length;
      this.updateDataSource();
    }
  }

  // Update Table from Pagination
  updateDataSource(filteredSoftware: Software[] = this.software) {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.displayedSoftware = filteredSoftware.slice(start, end);
  }

  // Update Pagination Numbers
  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  // Pagination Calculation
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  // Modal control methods
  openSuccessModal() {
    this.showSuccessModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  openErrorModal() {
    this.showErrorModal = true;
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  openDeleteConfirmedModal() {
    this.showDeleteConfirmedModal = true;
  }

  closeDeleteConfirmedModal() {
    this.showDeleteConfirmedModal = false;
  }
}
