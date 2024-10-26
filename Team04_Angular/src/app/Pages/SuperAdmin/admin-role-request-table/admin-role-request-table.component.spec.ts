import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoleRequestTableComponent } from './admin-role-request-table.component';

describe('AdminRoleRequestTableComponent', () => {
  let component: AdminRoleRequestTableComponent;
  let fixture: ComponentFixture<AdminRoleRequestTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminRoleRequestTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminRoleRequestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
