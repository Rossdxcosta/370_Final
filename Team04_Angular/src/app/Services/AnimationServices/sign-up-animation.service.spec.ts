import { TestBed } from '@angular/core/testing';

import { SignUpAnimationService } from './sign-up-animation.service';

describe('SignUpAnimationService', () => {
  let service: SignUpAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignUpAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
