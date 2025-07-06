import { TestBed } from '@angular/core/testing';

import { ProtocolDataService } from './protocol-data.service';

describe('ProtocolDataService', () => {
  let service: ProtocolDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtocolDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
