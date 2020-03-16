import { Injectable, Inject } from '@angular/core';
import { WindowRef } from '../../models/window-ref';
import { fromEvent, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Platform {

  constructor(@Inject('WINDOW') private windowRef: WindowRef) {
  }

  get orientation(): ScreenOrientation {
    return this.windowRef.screen.orientation;
  }

  get isMobile(): boolean {
    // tslint:disable-next-line: max-line-length
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

