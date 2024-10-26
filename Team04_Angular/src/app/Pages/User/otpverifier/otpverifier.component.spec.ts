import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTPVerifierComponent } from './otpverifier.component';

describe('OTPVerifierComponent', () => {
  let component: OTPVerifierComponent;
  let fixture: ComponentFixture<OTPVerifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OTPVerifierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OTPVerifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
