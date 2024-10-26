import { TestBed } from '@angular/core/testing';

import { AdminDataServiceService } from './admin-data-service.service';

describe('SuperAdminDataServiceService', () => {
  let service: AdminDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
