import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AWelcomePageComponent } from './a-welcome-page.component';

describe('AWelcomePageComponent', () => {
  let component: AWelcomePageComponent;
  let fixture: ComponentFixture<AWelcomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AWelcomePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AWelcomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
