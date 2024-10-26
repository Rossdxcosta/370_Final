import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDoList, ToDoListItem } from '../../../Classes/todolist-classes';

@Injectable({
  providedIn: 'root'
})
export class TodolistService {
  private baseUrl = 'http://localhost:5120/api/ToDoList';

  constructor(private http: HttpClient) { }

  createChecklist(ticketId: number, checklist: ToDoList): Observable<ToDoList> {
    return this.http.post<ToDoList>(`${this.baseUrl}/${ticketId}/checklists`, checklist);
  }

  createNote(ticketId: number, note: { ticket_ID: number; note_Description: string }): Observable<ToDoListItem> {
    return this.http.post<ToDoListItem>(`${this.baseUrl}/${ticketId}/notes`, note);
  }

  getChecklists(ticketId: number): Observable<ToDoList[]> {
    return this.http.get<ToDoList[]>(`${this.baseUrl}/${ticketId}/checklists`);
  }

  getNotes(ticketId: number): Observable<ToDoListItem[]> {
    return this.http.get<ToDoListItem[]>(`${this.baseUrl}/${ticketId}/notes`);
  }

  updateChecklist(checklistId: number, checklist: ToDoList): Observable<ToDoList> {
    return this.http.put<ToDoList>(`${this.baseUrl}/checklists/${checklistId}`, checklist);
  }

  updateNote(noteId: number, note: { note_Description: string }): Observable<ToDoListItem> {
    return this.http.put<ToDoListItem>(`${this.baseUrl}/notes/${noteId}`, note);
  }

  deleteChecklist(checklistId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/checklists/${checklistId}`);
  }

  deleteNote(noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/notes/${noteId}`);
  }

  deleteToDoList(ticketId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${ticketId}/todolist`);
  }
}