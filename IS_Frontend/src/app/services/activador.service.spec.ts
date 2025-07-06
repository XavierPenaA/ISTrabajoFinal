import { TestBed } from '@angular/core/testing';

import { ActivadorService } from './activador.service';

describe('ActivadorService', () => {
  let service: ActivadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
