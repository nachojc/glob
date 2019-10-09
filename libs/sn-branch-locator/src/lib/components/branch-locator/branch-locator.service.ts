import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchLocatorService {




  constructor(@Inject('WINDOW') private windowRef: Window) { }


  public watchPosition(): Observable<Position> {
    return Observable.create(
      (observer) => {
        this.windowRef.navigator.geolocation.watchPosition((pos: Position) => {
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
