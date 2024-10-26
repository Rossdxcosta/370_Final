import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainChatbotComponent } from './train-chatbot.component';

describe('TrainChatbotComponent', () => {
  let component: TrainChatbotComponent;
  let fixture: ComponentFixture<TrainChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainChatbotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
