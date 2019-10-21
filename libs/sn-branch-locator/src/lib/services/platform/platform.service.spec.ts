import { TestBed } from '@angular/core/testing';

import { Platform } from './platform.service';
import { NoopWindowRef } from '../../models/window-ref';



describe('PlatformService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{ provide: 'WINDOW', useClass: NoopWindowRef }]
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
