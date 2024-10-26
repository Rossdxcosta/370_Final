import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CompanyRequest } from '../../Classes/companyRequest';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:5120/api/Company';

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllCompanies`)
      .pipe(catchError(this.handleError));
  }

  getCompany(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetCompany/${id}`)
      .pipe(catchError(this.handleError));
  }

  requestCompany(request: CompanyRequest){
    return this.http.post<CompanyRequest>(`${this.apiUrl}/RequestCompany`, request)
      .pipe(catchError(this.handleError));
  }

  createCompany(company: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/CreateCompany`, company)
      .pipe(catchError(this.handleError));
  }

  updateCompany(id: number, company: any): Observable<any> {
    if (id === undefined || id === null) {
      return throwError('Company ID is undefined or null');
    }
    return this.http.put<any>(`${this.apiUrl}/UpdateCompany/${id}`, company)
      .pipe(catchError(this.handleError));
  }  

  deleteCompany(id: number): Observable<any> {
    if (id === undefined || id === null) {
        return throwError('Company ID is undefined or null');
    }
    
    const deleteUrl = `${this.apiUrl}/DeleteCompany/${id}`;
    console.log(`Deleting company at: ${deleteUrl}`); 

    return this.http.delete<any>(deleteUrl)
        .pipe(catchError(this.handleError));
}


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.errors) {
        errorMessage += '\nDetails: ' + JSON.stringify(error.error.errors);
      }
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}