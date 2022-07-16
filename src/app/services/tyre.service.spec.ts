import { TestBed } from '@angular/core/testing';

import { TyreService } from './tyre.service';

describe('TyreService', () => {
  let service: TyreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TyreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
