import { TestBed } from '@angular/core/testing';

import { FakeRoutesService } from './fake-routes.service';

describe('FakeRoutesService', () => {
  let service: FakeRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FakeRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
