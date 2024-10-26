import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivationRequestsComponent } from './deactivation-requests.component';

describe('DeactivationRequestsComponent', () => {
  let component: DeactivationRequestsComponent;
  let fixture: ComponentFixture<DeactivationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeactivationRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeactivationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
