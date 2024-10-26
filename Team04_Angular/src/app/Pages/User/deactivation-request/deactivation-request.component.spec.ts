import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivationRequestComponent } from './deactivation-request.component';

describe('DeactivationRequestComponent', () => {
  let component: DeactivationRequestComponent;
  let fixture: ComponentFixture<DeactivationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeactivationRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeactivationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
