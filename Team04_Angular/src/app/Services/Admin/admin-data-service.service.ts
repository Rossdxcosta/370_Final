import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; 
import { AccountRequestDTO } from '../../Classes/requests';

@Injectable({
  providedIn: 'root'
})
export class AdminDataServiceService {
  private apiURL = "http://localhost:5120/api/UserRole"; 

  constructor(private http: HttpClient) { }

  // Get Users
  GetAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/GetAllUsers`).pipe(
      tap(data => console.log('Fetched users:', data)), 
      catchError(error => {
        console.error('Error fetching users', error);
        return throwError(error);
      })
    );
  }

  // Get Roles
  GetAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/GetAllRoles`).pipe(
      tap(data => console.log('Fetched roles:', data)), 
      catchError(error => {
        console.error('Error fetching roles', error);
        return throwError(error);
      })
    );
  }

  // Get User by ID
  GetUserByID(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}?User_ID=${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching user by ID', error);
        return throwError(error);
      })
    );
  }
   // Update User Role
   UpdateUserRole(userId: string, roleId: number): Observable<string> {
    return this.http.put<string>(`${this.apiURL}/UpdateUserRole`, { userId, roleId }, { responseType: 'text' as 'json' }).pipe(
      tap(data => console.log('Updated user role:', data)), 
      catchError(error => {
        console.error('Error updating user role', error);
        return throwError(error);
      })
    );
  }

  // Remove user role
  RemoveUserRole(userId: string): Observable<string> {
    return this.http.put<string>(`${this.apiURL}/RemoveUserRole`, { userId }, { responseType: 'text' as 'json' }).pipe(
      tap((data: string) => console.log('Removed user role:', data)), 
      catchError((error: any) => {
        console.error('Error removing user role', error);
        return throwError(error);
      })
    );
  }

  //REQUEST MANAGEMENT
  ViewAccountRequests(): Observable<AccountRequestDTO[]>{
    return this.http.get<AccountRequestDTO[]>('http://localhost:5120/api/Users/GetAllAccountRequests');
  }

  AcceptAccountRequest(id: number): Observable<void>{
    return this.http.put<void>('http://localhost:5120/api/Request/AcceptAccountRequest/' + id, id);
  }

  DenyAccountRequest(id: number): Observable<void>{
    return this.http.put<void>('http://localhost:5120/api/Request/DenyAccountRequest/' + id, id);
  }

  getVDIRequests(): Observable<VDIRequest[]> {
    return this.http.get<VDIRequest[]>(`http://localhost:5120/api/SuperAdmin/GetAllVDIRequests`);
  }

  approveVDIRequest(vdiRequestID: number): Observable<any> {
    console.log('Sending Approve Request for VDI ID:', vdiRequestID);  
    return this.http.post(`http://localhost:5120/api/SuperAdmin/ApproveVDIRequest?vdiRequestID=${vdiRequestID}`, {});
  }

  denyVDIRequest(vdiRequestID: number): Observable<any> {
    console.log('Sending Deny Request for VDI ID:', vdiRequestID);  
    return this.http.put(`http://localhost:5120/api/SuperAdmin/DenyVDIRequest?vdiRequestID=${vdiRequestID}`, {});
}

}

export interface VDIRequest {
  vdI_Request_ID: number;
  clientName: string;
  vdI_ID: number;
  vdiName: string;  
}

