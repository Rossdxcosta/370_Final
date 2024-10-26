import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketCreationToggleService {
  private ticketCreationSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    localStorage.getItem('ticketCreationState') === 'true'
  );

  ticketCreation$ = this.ticketCreationSubject.asObservable();

  constructor() {}

  setTicketCreation(status: boolean) {
    this.ticketCreationSubject.next(status);
    localStorage.setItem('ticketCreationState', status.toString());
  }

  getTicketCreation() {
    return this.ticketCreationSubject.getValue();
  }
}
