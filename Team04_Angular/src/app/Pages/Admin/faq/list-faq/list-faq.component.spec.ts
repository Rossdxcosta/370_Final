import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFAQComponent } from './list-faq.component';

describe('ListFAQComponent', () => {
  let component: ListFAQComponent;
  let fixture: ComponentFixture<ListFAQComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListFAQComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListFAQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
