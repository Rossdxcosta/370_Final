import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RentVDIComponent } from './rent-vdi.component';

describe('RentVDIComponent', () => {
  let component: RentVDIComponent;
  let fixture: ComponentFixture<RentVDIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RentVDIComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RentVDIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
