import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Report, ReportCreateUpdate } from '../../Classes/report-select';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportoptinService {

  private apiUrl = 'http://localhost:5120/api/ScheduleReports';

  constructor(private http: HttpClient) { }

  public getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.apiUrl);
  }

  // Create new reports
  createReports(reports: ReportCreateUpdate[]): Observable<Report[]> {
    return this.http.post<Report[]>(this.apiUrl, reports);
  }

  // Update existing reports
  updateReports(reports: ReportCreateUpdate[]): Observable<Report[]> {
    return this.http.post<Report[]>(this.apiUrl, reports);
  }

  // Delete reports
  deleteReports(ids: number[]): Observable<any> {
    return this.http.delete(this.apiUrl, { body: ids });
  }
}
