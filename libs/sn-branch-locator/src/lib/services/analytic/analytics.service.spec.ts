import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [],
    });
    service = TestBed.get(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
