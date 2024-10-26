import { TestBed } from '@angular/core/testing';

import { TicketCreationToggleService } from './ticket-creation-toggle.service';

describe('TicketCreationToggleService', () => {
  let service: TicketCreationToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketCreationToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
