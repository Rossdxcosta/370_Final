import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { VDI, VDIType } from '../../Classes/VDI';

@Injectable({
  providedIn: 'root'
})
export class VDIService {
  private apiURL = "http://localhost:5120/api/Vdi"; 

  constructor(private http: HttpClient) {}

  // Create new VDI
  CreateNewVDI(vdi: VDI): Observable<VDI> {
    return this.http.post<VDI>(`${this.apiURL}/CreateVDI`, vdi);
  }

  // Fetch all VDIs
  GetAllVDI(): Observable<VDI[]> {
    return this.http.get<VDI[]>(`${this.apiURL}/GetAllVDI`).pipe(
      tap(data => console.log('Fetched VDIs:', data)),
      catchError(error => {
        console.error('Error fetching VDIs', error);
        return throwError(error);
      })
    );
  }

  // Fetch all VDI types
  getAllVDITypes(): Observable<VDIType[]> {
    return this.http.get<VDIType[]>(`${this.apiURL}/GetAllVDITypes`);
  }

  // Delete a VDI
  DeleteVDI(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/DeleteVDI/${id}`);
  }

  // Update an existing VDI
  UpdateVDI(id: number, updatedVDI: VDI): Observable<VDI> {
    return this.http.put<VDI>(`${this.apiURL}/UpdateVDI/${id}`, updatedVDI).pipe(
      tap(data => console.log('Updated VDI:', data)),
      catchError(error => {
        console.error('Error updating VDI', error);
        return throwError(error);
      })
    );
  }

  // Request a VDI
  RequestVDI(vdiID: number, clientID: string): Observable<any> {
    const url = `${this.apiURL}/RequestVDI`;

    // Set the query parameters
    let params = new HttpParams()
      .set('vdiID', vdiID.toString())
      .set('clientID', clientID);

    // Post request with query params to request a VDI
    return this.http.post(url, null, { params }).pipe(
      tap(response => console.log('VDI requested successfully:', response)),
      catchError(error => {
        console.error('Error requesting VDI:', error);
        return throwError(error);
      })
    );
  }

  checkClientVDIOwnership(vdiid: number, clientID: string): Observable<any> {
    const body = { clientID, vdiid }; 
    return this.http.post('http://localhost:5120/api/Vdi/CheckClientVDIOwnership', body);
}


  ApproveVDIRequest(vdiRequestID: number): Observable<any> {
    const url = `${this.apiURL}/ApproveVDIRequest`;

    let params = new HttpParams()
      .set('vdiRequestID', vdiRequestID.toString());

    return this.http.post(url, null, { params }).pipe(
      tap(response => console.log('VDI request approved successfully:', response)),
      catchError(error => {
        console.error('Error approving VDI request:', error);
        return throwError(error);
      })
    );
  }
}
