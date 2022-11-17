import { TestBed } from '@angular/core/testing';

import { CorpusInfoService } from './corpus-info.service';

describe('CorpusInfoService', () => {
  let service: CorpusInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorpusInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
