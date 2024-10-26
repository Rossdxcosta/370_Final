import { TestBed } from '@angular/core/testing';

import { SuperAdminDataServiceService } from './super-admin-data-service.service';

describe('SuperAdminDataServiceService', () => {
  let service: SuperAdminDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperAdminDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
