import { Component } from '@angular/core';
import { Department } from '../../../Classes/department';
//import { departmentsService } from '../../../Services/Tickets/departments/department.service';
//import { department } from '../../../Classes/departments-classes';
import { DepartmentService } from '../../../Services/Department/department.service';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { TagsService } from '../../../Services/Tickets/Tags/tag.service';
import { Tag } from '../../../Classes/tags-classes';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent {
  // ------------------------------------------------ Modal Section Start
  // Instructions
  // Copy paste this section into the TypeScript component, AFTER you have copy pasted the HTML components at the bottom of the HTML document
  // Remember to change the HTML to be relevant to the specific component
  // In the button you want to call the modal, most cases will be the submit button,
  //// call the openSuccesModal in the valid part
  //// call the openErrorModal in the invalid part
  // Use this document as a guide if you do not know what I am talking about

  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  showDeleteConfirmedModal: boolean = false;

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
  // ------------------------------------------------ Modal Section End
  openAddModal(): void {
    this.isEdit = false;
    this.currentDepartment = new Department();
    this.openModal();
    this.showModal = true;
  }

  openEditModal(department: Department): void {
    this.isEdit = true;
    this.currentDepartment = { ...department };
    this.openModal();
    this.showModal = true;
    console.log(this.currentDepartment)
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

  // Loading Section
  isLoading: boolean = true;
  isData: boolean = false;
  isTableData: boolean = false;

  departments: Department[] = [];
  //departments: department[] = [];
  displayeddepartments: Department[] = [];
  currentDepartment: Department = new Department();
  searchQuery: string = '';
  isEdit: boolean = false;
  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  // New properties for modal control
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  deleteDepartmentId: number | null = null;

  constructor( private departmentService: DepartmentService, private tagService: TagsService) { }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadTags();
    this.currentDepartment.tagIds = []
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;
      this.totalItems = departments.length;
      this.updateDataSource();
      this.isLoading = false;
      if (departments.length > 0) {
        this.isData = true;
        this.isTableData = true;
      }
      else {
        this.isData = false;
        this.isTableData = false;
      }
    });
  }

  loadTags(): void {
    this.tagService.getAllTags().subscribe(tags => {
      this.checks = tags
    })
  }

  openDeleteModal(DepartmentId: number): void {
    this.deleteDepartmentId = DepartmentId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  onSubmit(): void {
    if (this.isEdit) {
      this.departmentService.updateDepartment(this.currentDepartment.department_ID, this.currentDepartment).subscribe(() => {
        this.loadDepartments();
        this.closeModal();
        this.openSuccessModal();
      });
    } else {
      this.departmentService.createDepartment(this.currentDepartment).subscribe(() => {
        this.loadDepartments();
        this.closeModal();
        this.openSuccessModal();
      });
    }
  }

  //This is used to handle the array of departments
  form = new FormGroup({
    myChoices: new FormArray([])
  });

  checks!: Tag[];

  selectedChoices: number[] = [];

  onCheckChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      const value = parseInt(event.target.value, 10);
      
      if (!isNaN(value)) {
        if (!Array.isArray(this.currentDepartment.tagIds)) {
          this.currentDepartment.tagIds = [];
        }

        if (event.target.checked) {
          // Add the value if it's not already in the array
          if (!this.currentDepartment.tagIds.includes(value)) {
            this.currentDepartment.tagIds.push(value);
          }
        } else {
          // Remove the value if it's in the array
          this.currentDepartment.tagIds = this.currentDepartment.tagIds.filter(item => item !== value);
        }
      }
    }
  }

  isChecked(id: number) {
    return this.currentDepartment.tagIds?.includes(id);
  }

  confirmDelete(): void {
    if (this.deleteDepartmentId) {
      this.departmentService.deleteDepartment(this.deleteDepartmentId).subscribe(
        () => {
          this.loadDepartments();
          this.closeDeleteModal();
          this.openDeleteConfirmedModal();
        },
        (error) => {
          console.error('Error deleting ticket group:', error)
          this.openErrorModal();
        }
      );
    }
  }

  deleteDepartment(id: number): void {
    this.departmentService.deleteDepartment(id).subscribe(() => {
      this.loadDepartments();
    });
  }

  searchdepartments(): void {
    if (this.searchQuery) {
      this.isTableData = false;
      const query = this.searchQuery.toLowerCase();
      const filtereddepartments = this.departments.filter(department =>
        department.department_Name.toLowerCase().includes(query) ||
        department.department_Description.toLowerCase().includes(query)
      );

      if (filtereddepartments.length > 0) {
        this.isTableData = true;
      }

      this.totalItems = filtereddepartments.length;
      this.updateDataSource(filtereddepartments);
    } else {
      this.isTableData = true;
      this.totalItems = this.departments.length;
      this.updateDataSource(this.departments);
    }
  }

  // Update Table from Pagination
  updateDataSource(filtereddepartments: Department[] = this.departments) {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.displayeddepartments = filtereddepartments.slice(start, end);
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

}
