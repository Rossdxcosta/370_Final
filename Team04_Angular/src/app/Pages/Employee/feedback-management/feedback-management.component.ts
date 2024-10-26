import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { ClientFeedbackService } from "../../../Services/Client/client-feedback.service";
import { ClientFeedback } from "../../../Classes/client-feedback";
import { AdminDataServiceService } from "../../../Services/Admin/admin-data-service.service";
import { User } from "../../../Classes/users-classes";
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Component({
  selector: "app-feedback-management",
  templateUrl: "./feedback-management.component.html",
  styleUrls: ["./feedback-management.component.scss"],
})
export class FeedbackManagementComponent implements OnInit, OnChanges {
  feedbacks: (ClientFeedback & { user?: User })[] = [];
  filteredFeedbacks: (ClientFeedback & { user?: User })[] = [];
  searchTerm: string = "";
  users: User[] = [];
  userMap: { [key: string]: User } = {};

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  // Loading Section
  isLoading: boolean = true;
  isData: boolean = true;
  isTableData: boolean = true;

  constructor(
    private feedbackService: ClientFeedbackService,
    private dataService: AdminDataServiceService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["searchTerm"]) {
      this.filterFeedbacks();
    }
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      users: this.dataService.GetAllUsers().pipe(
        catchError((error) => {
          console.error("Error loading users:", error);
          return of([]);
        })
      ),
      feedbacks: this.feedbackService.getAllFeedbacks().pipe(
        catchError((error) => {
          console.error("Error loading feedbacks:", error);
          return of([]);
        })
      ),
    }).subscribe({
      next: ({ users, feedbacks }) => {
        console.log("Users loaded:", users);
        console.log("Feedbacks loaded:", feedbacks);
        this.users = users;
        this.feedbacks = feedbacks;
        this.createUserMap();
        this.mapUsersToFeedbacks();
        this.filterFeedbacks();
        this.isLoading = false;
        if (this.feedbacks.length > 0) {
          this.isData = true;
          this.isTableData = true;
        } else {
          this.isData = false;
          this.isTableData = false;
        }
      },
      error: (err) => {
        console.error("Error loading data:", err);
        this.isLoading = false;
      },
    });
  }

  createUserMap(): void {
    this.users.forEach((user) => {
      this.userMap[user.user_ID] = user;
    });
  }

  mapUsersToFeedbacks(): void {
    this.feedbacks = this.feedbacks.map((feedback) => ({
      ...feedback,
      user: this.userMap[feedback.client_ID],
    }));
  }

  filterFeedbacks(): void {
    this.isTableData = false;
    const term = this.searchTerm.toLowerCase();
    this.filteredFeedbacks = this.feedbacks.filter((feedback) => {
      const feedbackDetailMatches = feedback.client_Feedback_Detail
        .toLowerCase()
        .includes(term);
      const clientIDMatches = feedback.client_ID
        .toString()
        .toLowerCase()
        .includes(term);
      const feedbackDateString = new Date(feedback.feedback_Date_Created)
        .toISOString()
        .split("T")[0]
        .toLowerCase();
      const userMatches =
        feedback.user &&
        (feedback.user.user_Name.toLowerCase().includes(term) ||
          feedback.user.user_Surname.toLowerCase().includes(term));

      if (this.filteredFeedbacks.length > 0) {
        this.isTableData = true;
      }

      return feedbackDetailMatches || clientIDMatches || userMatches;
    });
    this.isTableData = true;
    this.totalItems = this.filteredFeedbacks.length;
    this.updateDataSource();
  }

  updateDataSource() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.filteredFeedbacks = this.feedbacks.slice(start, end);
    console.log("Data source updated:", this.filteredFeedbacks);
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
