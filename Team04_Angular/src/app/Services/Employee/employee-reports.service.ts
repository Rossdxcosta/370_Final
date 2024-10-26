import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TicketsAssignedClosed {
    TicketsAssigned: number;
    TicketsClosed: number;
}

interface TicketStatusCount {
    Status: string;
    Count: number;
}

interface AverageResolutionTimeOverMonth {
    Date: string; 
    AvgResolutionTime: number;
}

interface ClosedTicketsPastWeekItem {
    Date: string; 
    Count: number;
}

interface TicketsByPriority {
    Priority: string;
    Count: number;
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeReportingService {
    private apiUrl = 'http://localhost:5120/api/Reporting'; // Replace with your actual API URL

    constructor(private http: HttpClient) { }

    // Statistics
    getOpenTickets(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/employee/open-tickets`);
      }
    
      getBreachedTickets(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/employee/breached-tickets`);
      }
    
      getAverageResolutionTime(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/employee/average-resolution-time`);
      }
    
      getPriorityTickets(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/employee/priority-tickets`);
      }
    
      getCurrentAssignedTickets(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/employee/current-assigned-tickets`);
      }
    
      getTicketsAssignedVsClosed(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/employee/tickets-assigned-vs-closed`);
      }
    
      getTicketStatusDistribution(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/employee/ticket-status-distribution`);
      }
    
      getAverageResolutionTimeTrend(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/employee/average-resolution-time-trend`);
      }
    
      getClosedTicketsPastWeek(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/employee/closed-tickets-past-week`);
      }
    
      getTicketsByPriority(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/employee/tickets-by-priority`);
      }
}
