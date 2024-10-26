import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareRequestComponent } from './software-request.component';

describe('SoftwareRequestComponent', () => {
  let component: SoftwareRequestComponent;
  let fixture: ComponentFixture<SoftwareRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoftwareRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoftwareRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
