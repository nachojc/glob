import { TestBed } from '@angular/core/testing';
import { Platform } from './platform.service';

describe('PlatformService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: 'WINDOW', useValue: window },
    ]
  }));

  it('should be created', () => {
    const service: Platform = TestBed.get(Platform);
    expect(service).toBeTruthy();
    expect(service.orientation).toBeTruthy();
    expect(service.isMobile).toBeTruthy();
    expect(service.isDesktop).not.toBeTruthy();
    expect(service.screen).toBeTruthy();
  });

});
