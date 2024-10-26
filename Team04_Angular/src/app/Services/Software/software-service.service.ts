import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Software, SoftwareRequest } from '../../Classes/software';

@Injectable({
  providedIn: 'root'
})
export class SoftwareServiceService {
  private apiURL = "http://localhost:5120/api/Software"; 

  constructor(private http: HttpClient) { }

  // Create Software
  createNewSoftware(software: Software): Observable<Software> {
    return this.http.post<Software>(`${this.apiURL}/CreateSoftware`, software);
  }

  // Get all Software
  getAllSoftware(): Observable<Software[]> {
    return this.http.get<Software[]>(`${this.apiURL}/GetAllSoftware`).pipe(
      tap(data => console.log('Fetched software:', data)), 
      catchError(error => {
        console.error('Error fetching software', error);
        return throwError(error);
      })
    );
  }

  // Delete Software
  deleteSoftware(id: number): Observable<number> {
    return this.http.delete<number>(this.apiURL + '/DeleteSoftware/' + id); 
  }

  // Update Software
  updateSoftware(newSoftware: Software): Observable<Software> {
    return this.http.put<Software>(this.apiURL + '/UpdateSoftware', newSoftware).pipe(
      tap(data => console.log('Updated software:', data)),
      catchError(error => {
        console.error('Error updating software', error);
        return throwError(error);
      })
    );
  }

  requestSoftware(request: SoftwareRequest): Observable<any> {
    console.log('Sending request for software:', request);
    return this.http.post(`${this.apiURL}/RequestSoftware`, null, {
        params: {
            softID: request.softID.toString(),
            clientID: request.clientID.toString()
        }
    });
}
}