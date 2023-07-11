import { TestBed } from '@angular/core/testing';

import { LivingService } from './living.service';

describe('LivingService', () => {
  let service: LivingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
