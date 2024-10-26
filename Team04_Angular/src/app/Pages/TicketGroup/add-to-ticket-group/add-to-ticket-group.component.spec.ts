import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToTicketGroupComponent } from './add-to-ticket-group.component';

describe('AddToTicketGroupComponent', () => {
  let component: AddToTicketGroupComponent;
  let fixture: ComponentFixture<AddToTicketGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddToTicketGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddToTicketGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
