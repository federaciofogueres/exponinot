import { TestBed } from '@angular/core/testing';

import { NinotsService } from './ninots.service';

describe('NinotsService', () => {
  let service: NinotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NinotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
