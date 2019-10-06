import { TestBed } from '@angular/core/testing';

import { SnBranchLocatorService } from './sn-branch-locator.service';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientModule } from '@angular/common/http';

describe('SnBranchLocatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
      // providers: [HttpClient]
    })
    .compileComponents();
  });

  it('should be created', () => {
    const service: SnBranchLocatorService = TestBed.get(SnBranchLocatorService);
    expect(service).toBeTruthy();
  });
});
