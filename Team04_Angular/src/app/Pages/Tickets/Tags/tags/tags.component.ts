import { Component, OnInit } from "@angular/core";
import { Tag } from "../../../../Classes/tags-classes";
import { TagsService } from "../../../../Services/Tickets/Tags/tag.service";
import { ChatbotService } from "../../../../Services/Chatbot/chatbot.service";

@Component({
  selector: "app-tags",
  templateUrl: "./tags.component.html",
  styleUrls: ["./tags.component.scss"],
})
export class TagsComponent implements OnInit {
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
    this.currentTag = new Tag();
    this.openModal();
    this.showModal = true;
  }

  openEditModal(tag: Tag): void {
    this.isEdit = true;
    this.currentTag = { ...tag };
    this.openModal();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.UploadTags();

  }

  openModal(): void {
    const modal = document.getElementById("crud-modal");
    if (modal) {
      modal.classList.remove("hidden");
    }
  }

  // Loading Section
  isLoading: boolean = true;
  isData: boolean = false;
  isTableData: boolean = false;

  tags: Tag[] = [];
  displayedTags: Tag[] = [];
  currentTag: Tag = new Tag();
  searchQuery: string = "";
  isEdit: boolean = false;
  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  // New properties for modal control
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  deleteTicketTagId: number | null = null;

  constructor(private tagsService: TagsService, private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.tagsService.getAllTags().subscribe((tags) => {
      this.tags = tags;
      this.totalItems = tags.length;
      this.updateDataSource();
      this.isLoading = false;
      if (tags.length > 0) {
        this.isData = true;
        this.isTableData = true;
      } else {
        this.isData = false;
        this.isTableData = false;
      }
    });
  }

  openDeleteModal(ticketTagId: number): void {
    this.deleteTicketTagId = ticketTagId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.UploadTags();
  }

  onSubmit(): void {
    if (this.isEdit) {
      this.tagsService.updateTag(this.currentTag).subscribe(() => {
        this.loadTags();
        this.closeModal();
        this.openSuccessModal();
      });
    } else {
      this.tagsService.addTag(this.currentTag).subscribe(() => {
        this.loadTags();
        this.closeModal();
        this.openSuccessModal();
      });
    }
  }

  confirmDelete(): void {
    if (this.deleteTicketTagId) {
      this.tagsService.deleteTag(this.deleteTicketTagId).subscribe(
        () => {
          this.loadTags();
          this.closeDeleteModal();
          this.openDeleteConfirmedModal();
        },
        (error) => {
          console.error("Error deleting ticket group:", error);
          this.openErrorModal();
        }
      );
    }
  }

  deleteTag(id: number): void {
    this.tagsService.deleteTag(id).subscribe(() => {
      this.loadTags();
    });
  }

  searchTags(): void {
    if (this.searchQuery) {
      this.isTableData = false;
      const query = this.searchQuery.toLowerCase();
      const filteredTags = this.tags.filter(
        (tag) =>
          tag.tag_Name.toLowerCase().includes(query) ||
          tag.tag_Description.toLowerCase().includes(query)
      );

      if (filteredTags.length > 0) {
        this.isTableData = true;
      }

      this.totalItems = filteredTags.length;
      this.updateDataSource(filteredTags);
    } else {
      this.isTableData = true;
      this.totalItems = this.tags.length;
      this.updateDataSource(this.tags);
    }
  }

  // Update Table from Pagination
  updateDataSource(filteredTags: Tag[] = this.tags) {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.displayedTags = filteredTags.slice(start, end);
  }

  // Update Pagination Numbers
  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  // Pagination Calculation
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  //uploading tags to chatbot
  UploadTags(){
    this.tagsService.getAllTags().subscribe(a => {
      this.chatbotService.uploadTags(a).subscribe()
    });
    
  }
}
