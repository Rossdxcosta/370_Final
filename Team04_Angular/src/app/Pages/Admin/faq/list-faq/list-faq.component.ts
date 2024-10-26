import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FAQService } from "../../../../Services/FAQ/faq.service";
import { FAQ } from "../../../../Classes/faq.classes";
import { FAQCategory } from "../../../../Classes/faq-category.classes";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserServiceService } from "../../../../Services/Users/user-service.service";

@Component({
  selector: "app-list-faq",
  templateUrl: "./list-faq.component.html",
  styleUrls: ["./list-faq.component.scss"],
})
export class ListFAQComponent implements OnInit {
  displayedColumns: string[] = [
    "faQ_Question",
    "faQ_Answer",
    "faQ_Category_Name",
    "controls",
  ];
  displayedCatColumns: string[] = [
    "faQ_Category_Name",
    "faQ_Category_Description",
    "controls",
  ];
  dataSource: FAQ[] = [];
  filteredFAQs: FAQ[] = [];
  CatdataSource: FAQCategory[] = [];
  filteredCategories: FAQCategory[] = [];
  searchQuery: string = "";
  searchCategoryQuery: string = "";

  // Pagination properties for FAQs
  faqPageIndex: number = 0;
  faqPageSize: number = 10;
  totalFAQs: number = 0;

  // Loading Section
  isLoadingFAQ: boolean = true;
  isDataFAQ: boolean = false;
  isTableDataFAQ: boolean = false;

  isLoadingFAQCat: boolean = true;
  isDataFAQCat: boolean = false;
  isTableDataFAQCat: boolean = false;

  // ------------------------------------------------ Modal Section Start
  // Instructions
  // Copy paste this section into the TypeScript component, AFTER you have copy pasted the HTML components at the bottom of the HTML document
  // Remember to change the HTML to be relevant to the specific component
  // In the button you want to call the modal, most cases will be the submit button,
  //// call the openSuccesModal in the valid part
  //// call the openErrorModal in the invalid part
  // Use this document as a guide if you do not know what I am talking about

  showSuccessFAQModal: boolean = false;
  showErrorFAQModal: boolean = false;
  showDeleteConfirmedFAQModal: boolean = false;

  openSuccessFAQModal() {
    this.showSuccessFAQModal = true;
  }

  closeSuccessFAQModal() {
    this.showSuccessFAQModal = false;
  }

  openErrorFAQModal() {
    this.showErrorFAQModal = true;
  }

  closeErrorFAQModal() {
    this.showErrorFAQModal = false;
  }

  openDeleteConfirmedFAQModal() {
    this.showDeleteConfirmedFAQModal = true;
  }

  closeDeleteConfirmedFAQModal() {
    this.showDeleteConfirmedFAQModal = false;
  }
  // ------------------------------------------------ Break
  showSuccessFAQCatModal: boolean = false;
  showErrorFAQCatModal: boolean = false;
  showDeleteConfirmedFAQCatModal: boolean = false;

  openSuccessFAQCatModal() {
    this.showSuccessFAQCatModal = true;
  }

  closeSuccessFAQCatModal() {
    this.showSuccessFAQCatModal = false;
  }

  openErrorFAQCatModal() {
    this.showErrorFAQCatModal = true;
  }

  closeErrorFAQCatModal() {
    this.showErrorFAQCatModal = false;
  }

  openDeleteConfirmedFAQCatModal() {
    this.showDeleteConfirmedFAQCatModal = true;
  }

  closeDeleteConfirmedFAQCatModal() {
    this.showDeleteConfirmedFAQCatModal = false;
  }
  // ------------------------------------------------ Modal Section End

  // Pagination properties for FAQ Categories
  catPageIndex: number = 0;
  catPageSize: number = 10;
  totalCategories: number = 0;

  // Properties for modal control
  showDeleteFAQModal: boolean = false;
  showDeleteFAQCategoryModal: boolean = false;
  showFAQFormModal: boolean = false;
  showFAQCategoryFormModal: boolean = false;
  FAQId: number | null = null;
  FAQCategoryId: number | null = null;
  deleteFAQId: number | null = null;
  deleteFAQCategoryId: number | null = null;
  faqForm: FormGroup;
  faqCategoryForm: FormGroup;
  userId: string | undefined;
  displayedFAQ: FAQ[] = [];
  displayedCatFAQ: FAQCategory[] = [];

  categories: FAQCategory[] = [];

  constructor(
    private faqService: FAQService,
    public dialog: MatDialog,
    private userService: UserServiceService,
    private fb: FormBuilder
  ) {
    this.faqForm = this.fb.group({
      faQ_Question: ["", Validators.required],
      faQ_Answer: ["", Validators.required],
      faQ_Category_ID: ["", Validators.required],
      faQ_Category_Name: [""],
      user_ID: [""],
    });

    this.faqCategoryForm = this.fb.group({
      faQ_Category_Name: ["", Validators.required],
      faQ_Category_Description: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadFAQs();
    this.loadCategories();

    this.userId = this.userService.getUserIDFromToken();
  }

  loadFAQs(): void {
    this.faqService.getAllFAQs().subscribe(
      (data) => {
        this.dataSource = data;
        this.filteredFAQs = [...data];
        this.totalFAQs = data.length;
        this.updateFAQDataSource();
        this.isLoadingFAQ = false;
        this.isDataFAQ = data.length > 0;
        this.isTableDataFAQ = data.length > 0;
      },
      (error) => {
        console.error("Error fetching FAQs", error);
        this.isDataFAQ = false;
        this.isTableDataFAQ = false;
      }
    );
  }

  loadCategories(): void {
    this.faqService.getAllFAQCategories().subscribe(
      (categories) => {
        this.CatdataSource = categories;
        this.categories = categories;
        this.filteredCategories = [...categories];
        this.totalCategories = categories.length;
        this.updateCategoryDataSource();
        this.isLoadingFAQCat = false;
        this.isDataFAQCat = categories.length > 0;
        this.isTableDataFAQCat = categories.length > 0;
      },
      (error) => {
        console.error("Error fetching categories", error);
        this.isDataFAQCat = false;
        this.isTableDataFAQCat = false;
      }
    );
  }

  // Add or Edit FAQ
  openFAQFormModal(FAQId?: number): void {
    if (FAQId) {
      this.FAQId = FAQId;
      this.faqService.getFAQById(FAQId).subscribe(
        (data) => {
          this.faqForm.patchValue(data);
          this.showFAQFormModal = true;
        },
        (error) => console.error("Error fetching FAQ:", error)
      );
    } else {
      this.FAQId = null;
      this.faqForm.reset({
        faQ_Question: "",
        faQ_Answer: "",
        faQ_Category_ID: "",
        faQ_Category_Name: "",
        user_ID: this.userId,
      });
      this.showFAQFormModal = true;
    }
  }

  // Close FAQ Add or Edit
  closeFAQFormModal(): void {
    this.showFAQFormModal = false;
  }

  // Add or Edit FAQ Category
  openFAQCategoryFormModal(FAQCategoryId?: number): void {
    if (FAQCategoryId) {
      this.FAQCategoryId = FAQCategoryId;
      this.faqService.getFAQCategoryById(FAQCategoryId).subscribe(
        (data) => {
          this.faqCategoryForm.patchValue(data);
          this.showFAQCategoryFormModal = true;
        },
        (error) => console.error("Error fetching FAQ Category:", error)
      );
    } else {
      this.FAQCategoryId = null;
      this.faqCategoryForm.reset({
        faQ_Category_Name: "",
        faQ_Category_Description: "",
      });
      this.showFAQCategoryFormModal = true;
    }
  }

  // Close FAQ Add or Edit
  closeFAQCategoryFormModal(): void {
    this.showFAQCategoryFormModal = false;
  }

  // Delete FAQ Modal
  openDeleteFAQModal(FAQId: number): void {
    this.deleteFAQId = FAQId;
    this.showDeleteFAQModal = true;
  }

  // Close FAQ Delete
  closeDeleteFAQModal(): void {
    this.showDeleteFAQModal = false;
  }

  // Delete FAQ Category Modal
  openDeleteFAQCategoryModal(FAQCategoryId: number): void {
    this.deleteFAQCategoryId = FAQCategoryId;
    this.showDeleteFAQCategoryModal = true;
  }

  // Close FAQ Category Delete
  closeDeleteFAQCategoryModal(): void {
    this.showDeleteFAQCategoryModal = false;
  }

  // Confirm FAQ Delete
  confirmFAQDelete(): void {
    if (this.deleteFAQId) {
      this.faqService.deleteFAQ(this.deleteFAQId).subscribe(
        () => {
          this.loadFAQs();
          this.loadCategories();
          this.closeDeleteFAQModal();
          this.openDeleteConfirmedFAQModal();
        },
        (error) => {
          console.error("Error deleting FAQ:", error);
          this.openErrorFAQModal();
        }
      );
    }
  }

  // Confirm FAQ Category Delete
  confirmFAQCategoryDelete(): void {
    if (this.deleteFAQCategoryId) {
      this.faqService.deleteFAQCategory(this.deleteFAQCategoryId).subscribe(
        () => {
          this.loadFAQs();
          this.loadCategories();
          this.closeDeleteFAQCategoryModal();
          this.openDeleteConfirmedFAQCatModal();
        },
        (error) => {
          console.error("Error deleting FAQ Category:", error);
          this.openErrorFAQCatModal();
        }
      );
    }
  }

  // Save FAQ
  saveFAQ() {
    if (this.faqForm.valid) {
      const faqData: FAQ = this.faqForm.value;
      faqData.User_ID = this.userId;

      if (this.FAQId) {
        // Update FAQ
        faqData.faQ_ID = this.FAQId;
        this.faqService.updateFAQ(this.FAQId, faqData).subscribe(
          () => {
            this.loadFAQs();
            this.closeFAQFormModal();
            this.openSuccessFAQModal();
          },
          (error) => {
            console.error("Error updating FAQ:", error);
            this.openErrorFAQModal();
          }
        );
      } else {
        // Add FAQ
        this.faqService.addFAQ(faqData).subscribe(
          () => {
            this.loadFAQs();
            this.closeFAQFormModal();
            this.openSuccessFAQModal();
          },
          (error) => {
            console.error("Error adding FAQ:", error);
            this.openErrorFAQModal();
          }
        );
      }
    }
  }

  // Save FAQ category
  saveCategory() {
    if (this.faqCategoryForm.valid) {
      const categoryData: FAQCategory = this.faqCategoryForm.value;

      if (this.FAQCategoryId) {
        // Update FAQ Category
        categoryData.faQ_Category_ID = this.FAQCategoryId;
        this.faqService
          .updateFAQCategory(this.FAQCategoryId, categoryData)
          .subscribe(
            () => {
              this.loadCategories();
              this.loadFAQs();
              this.closeFAQCategoryFormModal();
              this.openSuccessFAQCatModal();
            },
            (error) => {
              console.error("Error updating FAQ Category:", error);
              this.openErrorFAQCatModal();
            }
          );
      } else {
        // Add FAQ Category
        this.faqService.addFAQCategory(categoryData).subscribe(
          () => {
            this.loadCategories();
            this.loadFAQs();
            this.closeFAQCategoryFormModal();
            this.openSuccessFAQCatModal();
          },
          (error) => {
            console.error("Error adding FAQ Category:", error);
            this.openErrorFAQCatModal();
          }
        );
      }
    }
  }

  get totalFAQPages(): number {
    return Math.ceil(this.totalFAQs / this.faqPageSize);
  }

  get totalCategoryPages(): number {
    return Math.ceil(this.totalCategories / this.catPageSize);
  }

  searchFAQ(): void {
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      this.filteredFAQs = this.dataSource.filter(
        (faq) =>
          faq.faQ_Question.toLowerCase().includes(query) ||
          faq.faQ_Answer.toLowerCase().includes(query) ||
          faq.faQ_Category_Name.toLowerCase().includes(query)
      );
    } else {
      this.filteredFAQs = [...this.dataSource];
    }

    this.totalFAQs = this.filteredFAQs.length;
    this.isTableDataFAQ = this.filteredFAQs.length > 0;
    this.faqPageIndex = 0;
    this.updateFAQDataSource();
  }

  searchCategory(): void {
    if (this.searchCategoryQuery) {
      const query = this.searchCategoryQuery.toLowerCase();
      this.filteredCategories = this.CatdataSource.filter(
        (category) =>
          category.faQ_Category_Name.toLowerCase().includes(query) ||
          category.faQ_Category_Description.toLowerCase().includes(query)
      );
    } else {
      this.filteredCategories = [...this.CatdataSource];
    }

    this.totalCategories = this.filteredCategories.length;
    this.isTableDataFAQCat = this.filteredCategories.length > 0;
    this.catPageIndex = 0;
    this.updateCategoryDataSource();
  }

  updateFAQDataSource(): void {
    const start = this.faqPageIndex * this.faqPageSize;
    const end = start + this.faqPageSize;
    this.displayedFAQ = this.filteredFAQs.slice(start, end);
  }

  updateCategoryDataSource(): void {
    const start = this.catPageIndex * this.catPageSize;
    const end = start + this.catPageSize;
    this.displayedCatFAQ = this.filteredCategories.slice(start, end);
  }

  onFAQPageChange(event: any): void {
    this.faqPageIndex = event.pageIndex;
    this.faqPageSize = event.pageSize;
    this.updateFAQDataSource();
  }

  onCategoryPageChange(event: any): void {
    this.catPageIndex = event.pageIndex;
    this.catPageSize = event.pageSize;
    this.updateCategoryDataSource();
  }
}
