import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

import {
  ClientSatisfactionReport,
  TicketAgingReport,
  OpenTicketReport,
  ClosedTicketReport,
  TicketByClientReport,
  AgentPerformanceReport,
  TicketStatusSummaryReport,
  TicketEscalationReport,
  TicketByDateRangeReport,
  MonthlyTicketTrendReport,
  SummaryData,
} from '../../Classes/reportingmodels';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  private apiUrl = 'http://localhost:5120/api/Reporting'; 

  constructor(private http: HttpClient) {}

  //================================== Statistics ==================================//
  private buildParams(startDate: string | null, endDate: string | null): HttpParams {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    return params;
  }

  getOpenTickets(startDate: string | null, endDate: string | null): Observable<number> {
    const params = this.buildParams(startDate, endDate);
    return this.http.get<number>(`${this.apiUrl}/open-tickets`, { params }).pipe(
      map(response => response),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(error);
      })
    );
  }

  getClosedTickets(startDate: string | null, endDate: string | null): Observable<number> {
    const params = this.buildParams(startDate, endDate);
    return this.http.get<number>(`${this.apiUrl}/closed-tickets`, { params }).pipe(
      map(response => response),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(error);
      })
    );
  }

  getBreachedTickets(startDate: string | null, endDate: string | null): Observable<number> {
    const params = this.buildParams(startDate, endDate);
    return this.http.get<number>(`${this.apiUrl}/breached-tickets`, { params }).pipe(
      map(response => response),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(error);
      })
    );
  }

  getLowPriorityTickets(startDate: string | null, endDate: string | null): Observable<number> {
    const params = this.buildParams(startDate, endDate);
    return this.http.get<number>(`${this.apiUrl}/low-priority-tickets`, { params }).pipe(
      map(response => response),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(error);
      })
    );
  }


  getTotalTicketsCreated(startDate: string | null, endDate: string | null): Observable<number> {
    const params = this.buildParams(startDate, endDate);
    return this.http.get<number>(`${this.apiUrl}/total-tickets-created`, { params }).pipe(
      map(response => response),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(error);
      })
    );
  }

  
  getAverageResolutionTimeStat(startDate: string | null, endDate: string | null): Observable<{ resolved_date: string, avg_resolution_time_hours: number }[]> {
    const params = this.buildParams(startDate, endDate);
    return this.http.get<{ resolved_date: string, avg_resolution_time_hours: number }[]>(`${this.apiUrl}/average-resolution-time-last-week`, { params }).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return throwError(error);
      })
    );
  }

  getTicketsReopened(startDate: string | null, endDate: string | null): Observable<number> {
    const params = this.buildParams(startDate, endDate);
    console.log('Params for Tickets Reopened:', params.toString());
    return this.http.get<number>(`${this.apiUrl}/tickets-reopened`, { params }).pipe(
      map(response => {
        console.log('API Response:', response);
        return response;
      }),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(error);
      })
    );
  }

  getEscalatedTicketsLastWeek(startDate: string | null, endDate: string | null): Observable<{ count: number | null, error?: string }> {
    const params = this.buildParams(startDate, endDate);
    return this.http.get<any>(`${this.apiUrl}/escalated-tickets-last-week`, { params }).pipe(
      map(response => {
        console.log('Raw API response for escalated tickets:', response);
        if (Array.isArray(response) && response.length > 0 && typeof response[0].count === 'number') {
          console.log('Valid count received:', response[0].count);
          return { count: response[0].count };
        } else if (response && typeof response.count === 'number') {
          console.log('Valid count received:', response.count);
          return { count: response.count };
        } else {
          console.warn('Invalid response structure for escalated tickets:', response);
          return { count: null, error: 'Invalid response structure' };
        }
      }),
      catchError(error => {
        console.error('API Error:', error);
        return of({ count: null, error: error.message || 'Unknown error occurred' });
      })
    );
  }
  //================================== Statistics ==================================//

  //================================== Reporting ===================================//
  getClientSatisfactionReport(): Observable<ClientSatisfactionReport[]> {
    return this.http.get<ClientSatisfactionReport[]>(`${this.apiUrl}/ClientSatisfaction`);
  }

  getTicketAgingReport(): Observable<TicketAgingReport[]> {
    return this.http.get<TicketAgingReport[]>(`${this.apiUrl}/TicketAging`);
  }

  getOpenTicketsReport(): Observable<OpenTicketReport[]> {
    return this.http.get<OpenTicketReport[]>(`${this.apiUrl}/OpenTickets`);
  }

  getClosedTicketsReport(): Observable<ClosedTicketReport[]> {
    return this.http.get<ClosedTicketReport[]>(`${this.apiUrl}/ClosedTickets`);
  }

  getTicketsByClientReport(): Observable<TicketByClientReport[]> {
    return this.http.get<TicketByClientReport[]>(`${this.apiUrl}/TicketsByClient`);
  }

  getAgentPerformanceReport(): Observable<AgentPerformanceReport[]> {
    return this.http.get<AgentPerformanceReport[]>(`${this.apiUrl}/AgentPerformance`);
  }

  getTicketStatusSummaryReport(): Observable<TicketStatusSummaryReport[]> {
    return this.http.get<TicketStatusSummaryReport[]>(`${this.apiUrl}/TicketStatusSummary`);
  }

  getTicketEscalationReport(): Observable<TicketEscalationReport[]> {
    return this.http.get<TicketEscalationReport[]>(`${this.apiUrl}/TicketEscalation`);
  }

  getTicketsByDateRangeReport(startDate: string, endDate: string): Observable<TicketByDateRangeReport[]> {
    return this.http.get<TicketByDateRangeReport[]>(`${this.apiUrl}/TicketsByDateRange`, {
      params: {
        startDate,
        endDate
      }
    });
  }

  getMonthlyTicketTrendReport(): Observable<MonthlyTicketTrendReport[]> {
    return this.http.get<MonthlyTicketTrendReport[]>(`${this.apiUrl}/MonthlyTicketTrend`);
  }

  getTicketsSummaryReport(): Observable<{
    prioritySummary: SummaryData[],
    tagSummary: SummaryData[],
    statusSummary: SummaryData[]
  }> {
    return this.http.get<{
      prioritySummary: SummaryData[],
      tagSummary: SummaryData[],
      statusSummary: SummaryData[]
    }>(`${this.apiUrl}/TicketsSummary`);
  }
  //================================== Reporting ===================================//





  //================================== Charts ======================================//
  getClosedTicketsPastWeek(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/closed-tickets-past-week`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(response => {
        return response;
      })
    );
  }

  getTicketStatusCounts(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/ticket-status-counts`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(response => {
        return response;
      })
    );
  }

  getTicketsCreatedResolvedOverTime(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets-created-resolved-over-time`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getAverageResolutionTime(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/average-resolution-time`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getTicketsByPriority(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets-by-priority`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getTicketsByTag(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets-by-tag`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getTicketsAssignedToEmployees(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets-assigned-to-employees`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getTicketsByClient(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets-by-client`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getTicketsCreatedOverTime(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets-created-over-time`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  //================================== Charts ======================================//
  
}
