import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenChatsComponent } from './open-chats.component';

describe('OpenChatsComponent', () => {
  let component: OpenChatsComponent;
  let fixture: ComponentFixture<OpenChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenChatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
