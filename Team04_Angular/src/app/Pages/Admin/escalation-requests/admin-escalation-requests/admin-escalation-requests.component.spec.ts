import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEscalationRequestsComponent } from './admin-escalation-requests.component';

describe('AdminEscalationRequestsComponent', () => {
  let component: AdminEscalationRequestsComponent;
  let fixture: ComponentFixture<AdminEscalationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEscalationRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEscalationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
