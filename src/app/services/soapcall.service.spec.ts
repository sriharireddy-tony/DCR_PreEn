import { TestBed } from '@angular/core/testing';

import { SOAPCallService } from './soapcall.service';

describe('SOAPCallService', () => {
  let service: SOAPCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SOAPCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
