import { TestBed } from '@angular/core/testing';

import { EmployeeReportsService } from './employee-reports.service';

describe('EmployeeReportsService', () => {
  let service: EmployeeReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
