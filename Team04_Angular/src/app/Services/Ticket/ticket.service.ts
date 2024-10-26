import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TicketDTO, Ticket } from '../../Classes/ticket.classes';
import { Priority } from '../../Classes/priority.classes';
import { TicketStatus } from '../../Classes/ticket-status.classes';
import { User } from '../../Classes/users-classes';
import { Tag } from '../../Classes/tags-classes';
import { TicketUpdates } from '../../Classes/ticket-updates';
import { TicketGroup } from '../../Classes/ticket-group.classes';
import { Department } from '../../Classes/department-classes';
import { EscalationRequest } from '../../Classes/escalation-request.classes';
import { TicketEscalation } from '../../Classes/ticket-escalation.classes';
import { EscalationRequestDto } from '../../Classes/escalation-request-dto';


@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly apiUrl = 'http://localhost:5120/api/Tickets/';
  private readonly ticketGroupApiUrl = 'http://localhost:5120/api/TicketGroup/';
  private readonly userApiUrl = 'http://localhost:5120/api/Users/';
  private readonly escalateURl= 'http://localhost:5120/api/EscalationRequests/';

  constructor(private http: HttpClient) {}

  private handleError(operation = 'operation') {
    return (error: any): Observable<never> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(error);
    };
  }


  createTicket(ticket: TicketDTO): Observable<TicketDTO> {
    return this.http.post<TicketDTO>(`${this.apiUrl}AddTicket`, ticket)
      .pipe(catchError(this.handleError('createTicket')));
  }

  getPriorities(): Observable<Priority[]> {
    return this.http.get<Priority[]>(`${this.apiUrl}GetAllPriorities`)
      .pipe(catchError(this.handleError('getPriorities')));
  }

  getTicketStatuses(): Observable<TicketStatus[]> {
    return this.http.get<TicketStatus[]>(`${this.apiUrl}GetAllTicketStatuses`)
      .pipe(catchError(this.handleError('getTicketStatuses')));
  }

  getTickets(): Observable<TicketDTO[]> {
    return this.http.get<TicketDTO[]>(`${this.apiUrl}GetAllTickets`)
      .pipe(catchError(this.handleError('getTickets')));
  }

  getTicketById(ticketId: number): Observable<TicketDTO> {
    return this.http.get<TicketDTO>(`${this.apiUrl}GetTicketByID/${ticketId}`)
      .pipe(catchError(this.handleError('getTicketById')));
  }

  getTicketByIdNonDTO(ticketId: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}GetTicketByID/${ticketId}`)
      .pipe(catchError(this.handleError('getTicketById')));
  }

  getTicketsByUserId(userId: string): Observable<TicketDTO[]> {
    return this.http.get<TicketDTO[]>(`${this.apiUrl}GetTicketsByClientId/${userId}`)
      .pipe(catchError(this.handleError('getTicketsByUserId')));
  }

  updateTicket(ticketId: number, ticket: Ticket): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}UpdateTicket/${ticketId}`, ticket)
      .pipe(
        catchError((error) => {
          console.error('Error in updateTicket:', error);
          return throwError(error);
        })
      );
  }

  updateTicketPriority(ticketId: number, newPriorityId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}UpdateTicketPriority/${ticketId}`, { newPriorityId })
      .pipe(catchError(this.handleError('updateTicketPriority')));
  }

  reassignTicket(ticketId: number, newAssignedEmployeeId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}ReassignTicket/${ticketId}`, { newAssignedEmployeeId })
      .pipe(catchError(this.handleError('reassignTicket')));
  }

  GetAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.userApiUrl}GetAllUsers`)
      .pipe(
        tap(data => console.log('Fetched users:', data)),
        catchError(this.handleError('getAllUsers'))
      );
  }

  searchTickets(userId: string, status?: string, startDate?: Date, endDate?: Date): Observable<TicketDTO[]> {
    let params = new HttpParams().set('userId', userId);
    if (status) params = params.append('status', status);
    if (startDate) {
      const normalizedStartDate = new Date(Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      )).toISOString().split('T')[0];
      params = params.append('startDate', normalizedStartDate);
    }
    if (endDate) {
      const normalizedEndDate = new Date(Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      )).toISOString().split('T')[0];
      params = params.append('endDate', normalizedEndDate);
    }
  
    return this.http.get<TicketDTO[]>(`${this.apiUrl}SearchTickets`, { params })
      .pipe(
        tap(data => console.log('Searched tickets:', data)),
        catchError(this.handleError('searchTickets'))
      );
  }

  getTicketUpdatesByUserId(clientId: string): Observable<TicketUpdates[]> {
    return this.http.get<TicketUpdates[]>(`${this.apiUrl}GetTicketUpdatesByUserId/${clientId}`)
      .pipe(catchError(this.handleError('getTicketUpdatesByUserId')));
  }

  updateTicketNotifications(ticketUpdateId: number, ticketUpdates: TicketUpdates): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}UpdateTicketNotifications/${ticketUpdateId}`, ticketUpdates)
      .pipe(catchError(this.handleError('updateTicketNotifications')));
  }

  getAllTicketGroups(): Observable<TicketGroup[]> {
    return this.http.get<TicketGroup[]>(this.ticketGroupApiUrl)
      .pipe(catchError(this.handleError('getAllTicketGroups')));
  }

  getTicketGroupById(id: number): Observable<TicketGroup> {
    return this.http.get<TicketGroup>(`${this.ticketGroupApiUrl}${id}`)
      .pipe(catchError(this.handleError('getTicketGroupById')));
  }  

  getTicketsByGroupId(groupId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.ticketGroupApiUrl}${groupId}/Tickets`)
      .pipe(catchError(this.handleError('getTicketsByGroupId')));
  }  

  addTicketGroup(ticketGroup: TicketGroup): Observable<TicketGroup> {
    return this.http.post<TicketGroup>(this.ticketGroupApiUrl, ticketGroup)
      .pipe(catchError(this.handleError('addTicketGroup')));
  }

  updateTicketGroup(id: number, ticketGroup: TicketGroup): Observable<void> {
    return this.http.put<void>(`${this.ticketGroupApiUrl}${id}`, ticketGroup).pipe(
      catchError((error) => {
        console.error('Error updating ticket group:', error);
        if (error.error) {
          console.error('Error details:', error.error);
        }
        return throwError(error);
      })
    );
  }
  
  deleteTicketGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ticketGroupApiUrl}${id}`)
      .pipe(catchError(this.handleError('deleteTicketGroup')));
  }

  addTicketToGroup(groupId: number, ticketId: number): Observable<{ success: boolean, message: string }> {
    return this.http.post<void>(`${this.ticketGroupApiUrl}${groupId}/AddTicket/${ticketId}`, {}).pipe(
      map(() => ({ success: true, message: 'Ticket successfully added to ticket group' })),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error === 'Ticket is already in this group') {
          return throwError({ success: false, message: 'Ticket is already in this ticket group' });
        }
        return throwError({ success: false, message: 'An error occurred while adding the ticket to the group' });
      })
    );
  }
  
  removeTicketFromGroup(groupId: number, ticketId: number): Observable<void> {
    return this.http.post<void>(`${this.ticketGroupApiUrl}${groupId}/RemoveTicket/${ticketId}`, {})
      .pipe(catchError(this.handleError('removeTicketFromGroup')));
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl + 'GetAllDepartments');
  }

  escalateTicket(escalationRequest: EscalationRequest): Observable<void> {
    return this.http.post<void>(`${this.escalateURl}CreateEscalationRequest`, escalationRequest);
  }

  getEscalationRequests(): Observable<EscalationRequestDto[]> {
    return this.http.get<EscalationRequestDto[]>(`${this.escalateURl}GetEscalationRequests`);
  }

  processEscalationRequest(request: { escalationId: number; accept: boolean; newEmployeeId: string | null }): Observable<void> {
    return this.http.post<void>(`${this.escalateURl}process`, request);
  }

  getEmployeesByDepartment(departmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.escalateURl}GetEmployeesByDepartment/${departmentId}`);
  }

  getAllTicketGroupsWithTickets(): Observable<TicketGroup[]> {
    return this.http.get<TicketGroup[]>(`${this.ticketGroupApiUrl}GetAllTicketGroupsWithTickets`)
      .pipe(catchError(this.handleError('getAllTicketGroupsWithTickets')));
  }
}
