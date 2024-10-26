import { Component, OnInit } from '@angular/core';
import { VDI, VDIType } from '../../../Classes/VDI';
import { VDIService } from '../../../Services/VDI/VDI-service.service';

@Component({
  selector: 'app-vdi',
  templateUrl: './VDI-manager.component.html',
  styleUrls: ['./VDI-manager.component.scss']
})
export class VDIComponent implements OnInit {
  // VDI properties
  allVDI: VDI[] = [];
  filteredVDI: VDI[] = [];
  vdiTypes: VDIType[] = [];
  currentVDI: VDI = new VDI();
  searchQuery: string = '';
  isEdit: boolean = false;

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  // Modal control properties
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  deleteVDIId: number | null = null;

  // Loading control properties
  isLoading: boolean = true;
  isData: boolean = false;
  isTableData: boolean = false;

  // Modal feedback properties
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  showDeleteConfirmedModal: boolean = false;

  constructor(private dataservice: VDIService) {}

  ngOnInit(): void {
    this.loadVDIs();
    this.loadVDITypes();
  }

  loadVDIs(): void {
    this.dataservice.GetAllVDI().subscribe(vdi => {
      this.allVDI = vdi;
      this.totalItems = vdi.length;
      this.updateDataSource();
      this.isLoading = false;
      if (vdi.length > 0) {
        this.isData = true;
        this.isTableData = true;
      } else {
        this.isData = false;
        this.isTableData = false;
      }
    });
  }

  loadVDITypes(): void {
    this.dataservice.getAllVDITypes().subscribe(types => {
      this.vdiTypes = types;
    });
  }

  openAddModal(): void {
    this.isEdit = false;
    this.currentVDI = new VDI();
    this.showModal = true;
  }

  openEditModal(vdi: VDI): void {
    this.isEdit = true;
    this.currentVDI = { ...vdi };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  openDeleteModal(vdiId: number): void {
    this.deleteVDIId = vdiId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  onSubmit(): void {
    if (this.isEdit) {
      this.dataservice.UpdateVDI(this.currentVDI.vdI_ID, this.currentVDI).subscribe(() => {
        this.loadVDIs();
        this.closeModal();
        this.openSuccessModal();
      });
    } else {
      this.dataservice.CreateNewVDI(this.currentVDI).subscribe(() => {
        this.loadVDIs();
        this.closeModal();
        this.openSuccessModal();
      });
    }
  }

  confirmDelete(): void {
    if (this.deleteVDIId) {
      this.dataservice.DeleteVDI(this.deleteVDIId).subscribe(() => {
        this.loadVDIs();
        this.closeDeleteModal();
        this.openDeleteConfirmedModal();
      },
      (error) => {
        console.error('Error deleting VDI:', error);
        this.openErrorModal();
      });
    }
  }

  searchVDI(): void {
    if (this.searchQuery) {
      this.isTableData = false;
      const query = this.searchQuery.toLowerCase();
      const filteredVDI = this.allVDI.filter(vdi =>
        vdi.vdI_Name.toLowerCase().includes(query) ||
        this.getVDITypeName(vdi.vdI_Type_ID).toLowerCase().includes(query)
      );

      if (filteredVDI.length > 0) {
        this.isTableData = true;
      }

      this.totalItems = filteredVDI.length;
      this.updateDataSource(filteredVDI);
    } else {
      this.isTableData = true;
      this.totalItems = this.allVDI.length;
      this.updateDataSource();
    }
  }

  getVDITypeName(typeId: number): string {
    const type = this.vdiTypes.find(t => t.vdI_Type_ID === typeId);
    return type ? type.vdI_Type_Name : 'Unknown';
  }

  // Update Table from Pagination
  updateDataSource(filteredVDIs: VDI[] = this.allVDI) {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.filteredVDI = filteredVDIs.slice(start, end);
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
