import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalateTicketComponent } from './escalate-ticket.component';

describe('EscalateTicketComponent', () => {
  let component: EscalateTicketComponent;
  let fixture: ComponentFixture<EscalateTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EscalateTicketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EscalateTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
