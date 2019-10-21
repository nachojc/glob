import { TestBed } from '@angular/core/testing';

import { NetworkService } from './network.service';
import { NoopWindowRef } from '../../models/window-ref';

describe('NetworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{ provide: 'WINDOW', useClass: NoopWindowRef }]
  }));

  it('should be created', () => {
    const service: NetworkService = TestBed.get(NetworkService);
    expect(service).toBeTruthy();
    expect(service.onLine).toBeTruthy();
    expect(service.connection).toBeTruthy();
    expect(service.connectionType).toEqual('4g');
    expect(service.connectionChange).toBeTruthy();
  });
});
