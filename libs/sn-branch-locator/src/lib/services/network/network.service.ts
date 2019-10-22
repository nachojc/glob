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

  get onLine(): boolean {
    return this.windowRef.navigator.onLine;
  }

  get connection() {
    return this.windowRef.navigator['connection'];
  }

  get connectionChange(): Observable<{onLine: boolean, connection: any}> {
    return fromEvent(this.connection, 'change').pipe(
      map(() => ({
        onLine : this.onLine, connection: this.connection}))
    );
  }

  get connectionType(): string {
    return this.connection.effectiveType;
  }
}
