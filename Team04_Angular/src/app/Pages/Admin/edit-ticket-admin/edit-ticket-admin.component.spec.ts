import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTicketAdminComponent } from './edit-ticket-admin.component';

describe('EditTicketAdminComponent', () => {
  let component: EditTicketAdminComponent;
  let fixture: ComponentFixture<EditTicketAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTicketAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTicketAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
