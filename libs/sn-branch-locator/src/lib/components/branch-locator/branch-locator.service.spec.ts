import { TestBed } from '@angular/core/testing';

import { BranchLocatorService } from './branch-locator.service';

describe('BranchLocatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BranchLocatorService = TestBed.get(BranchLocatorService);
    expect(service).toBeTruthy();
  });
});
