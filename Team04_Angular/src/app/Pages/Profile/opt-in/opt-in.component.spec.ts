import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptInComponent } from './opt-in.component';

describe('OptInComponent', () => {
  let component: OptInComponent;
  let fixture: ComponentFixture<OptInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptInComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
