import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoPositionService {
  private _observer$ = new Subject<Position>();
  constructor(@Inject('WINDOW') private windowRef: any) { }


  public watchPosition(): Observable<Position> {

    this.windowRef.navigator.geolocation.watchPosition((pos: Position) => {
      this._observer$.next(pos);
    },
    (error) => {
        console.log('Position is not available', error);
        this._observer$.error(error);
    },
    {
      enableHighAccuracy: true
    });


    return this._observer$.asObservable();
  }

  public getCurrentPosition(): Observable<Position> {
    return Observable.create(
      (observer) => {
        this.windowRef.navigator.geolocation.getCurrentPosition((pos: Position) => {
        observer.next(pos);
      },
      (error) => {
          console.log('Position is not available', error);
          observer.error(error);
      },
      {
        enableHighAccuracy: true
      });
    });
  }
}
