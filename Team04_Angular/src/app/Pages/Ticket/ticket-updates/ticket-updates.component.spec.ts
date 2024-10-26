import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketUpdatesComponent } from './ticket-updates.component';

describe('TicketUpdatesComponent', () => {
  let component: TicketUpdatesComponent;
  let fixture: ComponentFixture<TicketUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketUpdatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
