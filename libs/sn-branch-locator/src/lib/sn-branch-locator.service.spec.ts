import { TestBed } from '@angular/core/testing';

import { SnBranchLocatorService } from './sn-branch-locator.service';

describe('SnBranchLocatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SnBranchLocatorService = TestBed.get(SnBranchLocatorService);
    expect(service).toBeTruthy();
  });
});
