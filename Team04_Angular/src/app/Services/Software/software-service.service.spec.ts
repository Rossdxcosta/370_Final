import { TestBed } from '@angular/core/testing';

import { SoftwareServiceService } from './software-service.service';

describe('SoftwareServiceService', () => {
  let service: SoftwareServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoftwareServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
