import { TestBed } from '@angular/core/testing';

import { Platform } from './platform.service';
import { NoopWindowRef } from '../../models/window-ref';
import { WindowRefService } from '@globile/mobile-services';



describe('PlatformService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{ provide: WindowRefService, useClass: NoopWindowRef }]
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
