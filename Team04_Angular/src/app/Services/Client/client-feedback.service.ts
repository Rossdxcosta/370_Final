import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientFeedback } from '../../Classes/client-feedback';
import { ChatbotLogDto } from '../../Classes/chatbot_log'; 


@Injectable({
  providedIn: 'root'
})
export class ClientFeedbackService {

  private apiUrl = 'http://localhost:5120/api/Feedback'; 

  constructor(private http: HttpClient) { }

  createFeedback(feedback: ClientFeedback): Observable<ClientFeedback> {
    return this.http.post<ClientFeedback>(this.apiUrl, feedback);
  }

  getAllFeedbacks(): Observable<ClientFeedback[]> {
    return this.http.get<ClientFeedback[]>(this.apiUrl);
  }

  getChatbotLogs(): Observable<ChatbotLogDto[]> {
    return this.http.get<ChatbotLogDto[]>(`http://localhost:5120/api/chat/GetClientLogs`);
  }

}
