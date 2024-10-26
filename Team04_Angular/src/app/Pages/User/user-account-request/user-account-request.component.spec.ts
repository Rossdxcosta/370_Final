import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountRequestComponent } from './user-account-request.component';

describe('UserAccountRequestComponent', () => {
  let component: UserAccountRequestComponent;
  let fixture: ComponentFixture<UserAccountRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAccountRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAccountRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
