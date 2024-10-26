import { Component, OnInit } from "@angular/core";
import { SuperAdminDataServiceService } from "../../../Services/SuperAdmin/super-admin-data-service.service";
import { Auditlog } from "../../../Classes/auditlog";

@Component({
  selector: "app-audit-log",
  templateUrl: "./audit-log.component.html",
  styleUrls: ["./audit-log.component.scss"],
})
export class AuditLogComponent implements OnInit {
  logs: Auditlog[] = [];
  displayedLogs: Auditlog[] = [];
  searchQuery = "";

  // Loading Section
  isLoading: boolean = true;
  isData: boolean = false;
  isTableData: boolean = false;

  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 15;
  totalItems: number = 0;
  pageSizeOptions: number[] = [15, 25, 50, 100];
  totalPages: number = 0;

  // Modal state
  showLogModal: boolean = false;
  selectedLog: Auditlog | null = null;

  constructor(private dataService: SuperAdminDataServiceService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    this.isLoading = true;
    this.dataService.ViewAuditLog().subscribe((logs) => {
      this.logs = logs.map((log) => {
        if (typeof log.affectedColumns === "string") {
          log.affectedColumns = log.affectedColumns ? [log.affectedColumns] : [];
        }
        return log;
      });
      this.totalItems = this.logs.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.updateDisplayedLogs();
      this.isLoading = false;

      if (logs.length > 0) {
        this.isData = true;
        this.isTableData = true;
      } else {
        this.isData = false;
        this.isTableData = false;
      }
    });
  }

  openLogModal(log: Auditlog) {
    this.selectedLog = log;
    this.showLogModal = true;
  }

  closeLogModal() {
    this.showLogModal = false;
    this.selectedLog = null;
  }

  searchLog() {
    if (this.searchQuery) {
      this.isTableData = false;
      const query = this.searchQuery.toLowerCase();
      const filteredLogs = this.logs.filter(
        (log) =>
          (log.tableName && log.tableName.toLowerCase().includes(query)) ||
          (log.dateTime && log.dateTime.toLowerCase().includes(query)) ||
          (log.userId && log.userId.toLowerCase().includes(query))
      );

      this.totalItems = filteredLogs.length;
      if (filteredLogs.length > 0) {
        this.isTableData = true;
      }
      this.updateDisplayedLogs(filteredLogs);
    } else {
      this.totalItems = this.logs.length;
      this.isTableData = true;
      this.updateDisplayedLogs();
    }
  }

  updateDisplayedLogs(filteredLogs: Auditlog[] = this.logs) {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.displayedLogs = filteredLogs.slice(start, end);
  }

  onPageChange(newPageIndex: number) {
    this.pageIndex = newPageIndex;
    this.updateDisplayedLogs();
  }

  onPageSizeChange() {
    this.pageIndex = 0;
    this.updateDisplayedLogs();
  }

  formatJson(jsonStr: string): string {
    if (!jsonStr) return "Not Applicable";
    try {
      const obj = JSON.parse(jsonStr);
      return JSON.stringify(obj, null, 2); 
    } catch (e) {
      return jsonStr.length > 30 ? `${jsonStr.substring(0, 30)}...` : jsonStr;
    }
  }

  formatList(input: string[] | string): string {
    if (!input || input.length === 0) {
      return "Not Applicable";
    }

    if (typeof input === "string") {
      return input;
    }

    return input.join(", ");
  }
}
