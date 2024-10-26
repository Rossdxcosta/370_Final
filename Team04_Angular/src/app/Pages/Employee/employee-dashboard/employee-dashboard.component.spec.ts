import { ComponentFixture, TestBed } from '@angular/core/testing';

import { employeeDashboardComponent } from './employee-dashboard.component';

describe('EmployeeDashboardComponent', () => {
  let component: employeeDashboardComponent;
  let fixture: ComponentFixture<employeeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [employeeDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(employeeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
