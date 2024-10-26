import { Component, OnInit } from "@angular/core";
import { VDI, VDIType } from "../../../Classes/VDI";
import { VDIService } from "../../../Services/VDI/VDI-service.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserServiceService } from "../../../Services/Users/user-service.service";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-vdi",
  templateUrl: "./rent-vdi.component.html",
  styleUrls: ["./rent-vdi.component.scss"],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class RentVDIComponent implements OnInit {
  // Loading Section
  isLoading: boolean = true;
  isData: boolean = false;

  // Filtered VDIs
  filteredVDIs: VDI[] = [];
  // Table Source
  displayedColumns: string[] = ["vdI_Name", "vdI_Type_ID", "Controls"];
  // Table properties
  dataSource = new MatTableDataSource<VDI>([]);
  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(
    private dataservice: VDIService,
    private userService: UserServiceService
  ) {}

  searchQuery: string = "";
  allVDI: VDI[] = [];
  vdiTypes: VDIType[] = [];
  clientID: string = "";
  
  // Modal control properties
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  errorMessage: string = "";

  ngOnInit(): void {
    this.getAllVDI();
    this.getAllVDITypes();
    this.checkID();
  }

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

  getAllVDI() {
    this.isLoading = true;  // Start loading
    this.dataservice.GetAllVDI().subscribe(
      (vdi) => {
        this.allVDI = vdi;
        this.isData = this.allVDI.length > 0;
        this.updateFilteredVDIs();
        this.isLoading = false; // Stop loading
      },
      (error) => {
        console.error('Error fetching VDIs:', error);
        this.isLoading = false; // Stop loading on error
      }
    );
  }

  getAllVDITypes() {
    this.dataservice.getAllVDITypes().subscribe((types) => {
      this.vdiTypes = types;
    });
  }

  updateFilteredVDIs() {
    if (!this.searchQuery) {
      this.filteredVDIs = this.allVDI;
    } else {
      this.filteredVDIs = this.allVDI.filter(
        (vdi) =>
          vdi.vdI_Name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          this.getVDITypeName(vdi.vdI_Type_ID)
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
      );
    }
    this.totalItems = this.filteredVDIs.length;
    this.updateDataSource();
  }

  getVDITypeName(typeId: number): string {
    const type = this.vdiTypes.find((t) => t.vdI_Type_ID === typeId);
    return type ? type.vdI_Type_Name : "Unknown";
  }

  checkID() {
    this.clientID = this.userService.getUserIDFromToken();
  }

  requestVDI(vdi: VDI) {
    this.dataservice.checkClientVDIOwnership(vdi.vdI_ID, this.clientID).subscribe(
      (response) => {
        if (response.isOwned) {
          this.errorMessage = 'You already own this VDI.';
          this.openErrorModal();
        } else {
          this.dataservice.RequestVDI(vdi.vdI_ID, this.clientID).subscribe(
            (requestResponse) => {
              console.log('VDI request successful:', requestResponse);
              this.openSuccessModal(); 
            },
            (error) => {
              console.error('Error requesting VDI:', error);
              this.errorMessage = error.error;
              this.openErrorModal(); 
            }
          );
        }
      },
      (error) => {
        console.error('Error checking VDI ownership:', error);
        this.errorMessage = 'Error checking VDI ownership. Please try again.';
        this.openErrorModal();
      }
    );
  }

  updateDataSource() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.dataSource.data = this.filteredVDIs.slice(start, end);
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  search() {
    this.updateFilteredVDIs();
  }
}