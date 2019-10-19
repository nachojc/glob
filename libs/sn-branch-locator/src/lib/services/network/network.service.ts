import { Injectable, Inject } from '@angular/core';
import { WindowRef } from '../../models/window-ref';
import { fromEvent, merge, of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(@Inject('WINDOW') private windowRef: WindowRef) {

  }

  get online(): boolean {
    return this.windowRef.navigator.onLine;
  }

  get connection() {
    return this.windowRef.navigator['connection'];
  }

  get connectionChange(): Observable<boolean> {
    return fromEvent(this.connection, 'change');
  }

  get connectionType(): string {
    return this.connection.effectiveType;
  }
}
