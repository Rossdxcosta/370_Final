import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketGroupListComponent } from './ticket-group-list.component';

describe('TicketGroupListComponent', () => {
  let component: TicketGroupListComponent;
  let fixture: ComponentFixture<TicketGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketGroupListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
