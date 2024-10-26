import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReopenTicketComponent } from './reopen-ticket.component';

describe('ReopenTicketComponent', () => {
  let component: ReopenTicketComponent;
  let fixture: ComponentFixture<ReopenTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReopenTicketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReopenTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
