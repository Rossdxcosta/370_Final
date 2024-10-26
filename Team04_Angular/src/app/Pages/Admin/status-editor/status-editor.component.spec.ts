import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusEditorComponent } from './status-editor.component';

describe('StatusEditorComponent', () => {
  let component: StatusEditorComponent;
  let fixture: ComponentFixture<StatusEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatusEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
