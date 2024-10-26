import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Priority {
  priority_ID: number;
  priority_Name: string;
  priority_Description: string;
  breachTime: string; 
}

@Injectable({
  providedIn: 'root'
})
export class PriorityService {
  private apiUrl = 'http://localhost:5120/api/Priority';

  constructor(private http: HttpClient) { }

  getPriorities(): Observable<Priority[]> {
    return this.http.get<Priority[]>(this.apiUrl);
  }

  updateBreachTime(priority: Priority): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/UpdateBreachTime`, priority);
  }
}
