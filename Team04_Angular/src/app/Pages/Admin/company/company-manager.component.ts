import { AfterViewInit, Component, OnInit } from "@angular/core";
import { CompanyService } from "../../../Services/Admin/company-service.service";
import { Company } from "../../../Classes/company";


@Component({
  selector: "app-company-manager",
  templateUrl: "./company-manager.component.html",
  styleUrls: ["./company-manager.component.scss"],
})
export class CompanyManagerComponent implements AfterViewInit {
  companies: Company[] = [];
  //filteredCompanies: Company[] = [];
  displayedCompanies: Company[] = [];
  currentCompany: Company = {} as Company;
  searchQuery: string = '';
  isEdit = false;

  showModal = false;
  showDeleteModal = false;
  companyToDelete: Company | null = null;

  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;

  // Loading Section
  isLoading: boolean = true;
  isData: boolean = false;
  isTableData: boolean = false;

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(private companyService: CompanyService) { }


  ngAfterViewInit() {
    this.getAllCompanies();
  }

  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (company) => {
        this.companies = company;
        this.totalItems = company.length;
        this.updateDataSource();
        this.isLoading = false;

        if (company.length > 0) {
          this.isData = true;
          this.isTableData = true;
        } else {
          this.isData = false;
          this.isTableData = false;
        }
      });
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

  openAddModal() {
    this.currentCompany = {} as Company;
    this.isEdit = false;
    this.showModal = true;
  }

  openEditModal(company: Company) {
    this.currentCompany = { ...company };
    this.isEdit = true;
    this.showModal = true;
  }

  openDeleteModal(company: Company) {
    this.companyToDelete = company; 
    console.log('Selected company for deletion:', this.companyToDelete); 
    this.showDeleteModal = true;
  }


  closeModal() {
    this.showModal = false;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.companyToDelete = null; 
  }


  onSubmit() {
    if (this.isEdit) {
      console.log('Updating company:', this.currentCompany);
      if (this.currentCompany.company_ID) {
        this.companyService
          .updateCompany(this.currentCompany.company_ID, this.currentCompany)
          .subscribe(
            (updatedCompany) => {
              console.log('Company updated successfully:', updatedCompany);
              this.getAllCompanies();
              this.closeModal();
            },
            (error) => {
              console.error('Error updating company:', error);
              this.openErrorModal();
            }
          );
      } else {
        console.error('Company_ID is undefined');
        this.openErrorModal();
      }
    } else {
      console.log('Adding new company:', this.currentCompany);
      this.companyService.createCompany(this.currentCompany).subscribe(
        (newCompany) => {
          console.log('Company added successfully:', newCompany);
          this.getAllCompanies();
          this.closeModal();
          this.openSuccessModal();
        },
        (error) => {
          console.error('Error adding company:', error);
          this.openErrorModal();
        }
      );
    }
  }

  confirmDelete() {
    console.log('Company to delete:', this.companyToDelete); 
    if (this.companyToDelete && this.companyToDelete.company_ID) {
        this.companyService.deleteCompany(this.companyToDelete.company_ID).subscribe(
            () => {
                console.log('Company deleted successfully');
                this.getAllCompanies();
                this.closeDeleteModal();
            },
            (error) => {
                console.error('Error deleting company:', error);
            }
        );
    } else {
        console.error("Company_ID is undefined or null.");
    }
}

  searchCompanies(): void {
    if (this.searchQuery) {
      this.isTableData = false;
      const query = this.searchQuery.toLowerCase();
      const filteredCompanies = this.companies.filter(
        (company) =>
          company.company_Name.toLowerCase().includes(query)
      );

      if (filteredCompanies.length > 0) {
        this.isTableData = true;
      }

      this.totalItems = filteredCompanies.length;
      this.updateDataSource(filteredCompanies);
    } else {
      this.isTableData = true;
      this.totalItems = this.companies.length;
      this.updateDataSource();
    }
  }

  updateDataSource(filteredCompanies: Company[] = this.companies) {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.displayedCompanies = filteredCompanies.slice(start, end);
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
