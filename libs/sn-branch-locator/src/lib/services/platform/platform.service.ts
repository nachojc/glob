import { Injectable, Inject } from '@angular/core';
import { WindowRef } from '../../models/window-ref';
import { fromEvent, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { WindowRefService } from '@globile/mobile-services';

@Injectable({
  providedIn: 'root'
})
export class Platform {

  constructor(private windowRef: WindowRefService) {
  }

  get orientation(): ScreenOrientation {
    const screen = this.windowRef.screen as any;
    return screen.orientation || screen.msOrientation;
  }

  get isMobile(): boolean {
    // TODO: make it with width size of own component
    return !(this.orientation.angle === 0 &&
      this.orientation.type === 'landscape-primary') &&
      this.windowRef.navigator.userAgent.toLowerCase().includes('mobile');
  }

  get isDesktop(): boolean {
    return !this.isMobile;
  }

  get orientationChange(): Observable<ScreenOrientation> {
    return fromEvent(this.orientation, 'change')
      .pipe(
        map(() => this.orientation)
      );
  }


  get screen(): Screen {
    return this.windowRef.screen;
  }

}

