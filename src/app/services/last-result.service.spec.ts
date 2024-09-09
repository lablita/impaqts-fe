import { TestBed } from '@angular/core/testing';

import { LastResultService } from './last-result.service';

describe('LastResultService', () => {
  let service: LastResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
