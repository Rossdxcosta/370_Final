import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRoleTableComponent } from './user-role-table.component';

describe('UserRoleTableComponent', () => {
  let component: UserRoleTableComponent;
  let fixture: ComponentFixture<UserRoleTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRoleTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRoleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
