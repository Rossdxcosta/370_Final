import { AfterContentInit, Component, OnInit } from "@angular/core";
import { documents } from "../../../Classes/documents";
import { ChatbotService } from "../../../Services/Chatbot/chatbot.service";
import { withInMemoryScrolling } from "@angular/router";
import { TicketCreationToggleService } from "../../../ticket-creation-toggle.service";

@Component({
  selector: "app-train-chatbot",
  templateUrl: "./train-chatbot.component.html",
  styleUrl: "./train-chatbot.component.scss",
})
export class TrainChatbotComponent implements OnInit {
  constructor(
    private service: ChatbotService,
    private ticketCreationService: TicketCreationToggleService
  ) {}

  documents: documents[] = [];

  showDeleteModal: boolean = false;
  deleteDocumentId: String = "";
  showURLModal = false;
  showDocumentModal = false;

  ticketCreation!: boolean;

  ngOnInit(): void {
    this.getAllDocuments();
    this.ticketCreation = this.ticketCreationService.getTicketCreation();
  }

  headers = {
    "content-type": "application/json",
    Authorization: "VF.DM.66be7523b1a982bcb5022b1e.AYvxvXSLKJ8KXxwN",
  };

  getAllDocuments() {
    this.documents = [];

    const url =
      "https://api.voiceflow.com/v1/knowledge-base/docs?page=1&limit=100";
    const options = { method: "GET", headers: this.headers };

    fetch(url, options)
      .then((res: { json: () => any }) => res.json())
      .then((json: any) => this.prepDocs(json))
      .catch((err: string) => console.error("error:" + err));
  }

  onToggleChange(event: any) {
    this.ticketCreationService.setTicketCreation(event.target.checked);
  }

  closeURLModal() {
    this.showURLModal = false;
  }

  closeDocumentModal() {
    this.showDocumentModal = false;
  }

  openDeleteModal(DocumentId: String): void {
    this.deleteDocumentId = DocumentId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.deleteDocumentId) {
      this.service.deleteDoc(this.deleteDocumentId).subscribe(
        () => {
          this.closeDeleteModal();
          this.getAllDocuments();
        },
        (error) => console.error("Error deleting document:", error)
      );
    }
  }

  uploadURL(link: String) {
    this.service.uploadURL(link).subscribe({
      next: (res) => {
        this.getAllDocuments();
      },
      error: (err) => {
        this.showURLModal = true;
      },
    });
  }

  uploadDoc(doc: any) {
    if (doc != null) {
      console.log(doc);
      this.service.uploadDoc(doc).subscribe({
        next: (res) => {
          this.getAllDocuments();
        },
        error: (err) => {
          this.showDocumentModal = true;
        },
      });
    }
  }

  prepDocs(result: any) {
    this.documents = [];
  
    for (let i = result.data.length - 1; i >= 0; i--) {
      const updatedDate = new Date(result.data[i].updatedAt);
      const dateString = updatedDate.toISOString();

      this.documents.push(
        new documents(
          result.data[i].documentID,   
          result.data[i].data.name,    
          dateString                   
        )
      );
    }
  }
}
