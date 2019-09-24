import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchLocatorService {




  constructor() { }


  public watchPosition(): Observable<Position> {
    return Observable.create(
      (observer) => {
      navigator.geolocation.watchPosition((pos: Position) => {
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
      navigator.geolocation.getCurrentPosition((pos: Position) => {
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
