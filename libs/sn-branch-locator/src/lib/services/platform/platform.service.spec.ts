import { TestBed } from '@angular/core/testing';

import { Platform } from './platform.service';

class WindowRef extends Window {

}

describe('PlatformService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: 'WINDOW', useValue: WindowRef}]
  }));

  it('should be created', () => {
    const service: Platform = TestBed.get(Platform);
    expect(service).toBeTruthy();
  });

});
