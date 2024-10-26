import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminDasboardComponent } from './super-admin-dasboard.component';

describe('SuperAdminDasboardComponent', () => {
  let component: SuperAdminDasboardComponent;
  let fixture: ComponentFixture<SuperAdminDasboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuperAdminDasboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuperAdminDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
