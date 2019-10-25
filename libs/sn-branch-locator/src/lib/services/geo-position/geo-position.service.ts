import { Injectable, Inject } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { MapsAPILoader } from '@agm/core';
import { first } from 'rxjs/operators';
import { WindowRef } from '../../models/window-ref';

@Injectable({
  providedIn: 'root'
})
export class GeoPositionService {
  private _observer$ = new Subject<Position>();
  private _position$ = new Subject<Position>();
  private mapLoaded = false;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    @Inject('WINDOW') private windowRef: WindowRef
  ) { }

  get geolocation(): Geolocation {
    return this.windowRef.navigator.geolocation;
  }

  public watchPosition(): Observable<Position> {
    this._readyMaps().subscribe( () => {
      this.windowRef.navigator.geolocation.watchPosition((pos: Position) => {
        this._observer$.next(pos);
      },
      (error) => {
          // console.error('Position is not available', error);
          this._observer$.error(error);
      },
      {
        enableHighAccuracy: true
      });
    });

    return this._observer$.asObservable().pipe(first());
  }

  public getCurrentPosition(): Observable<Position> {

    this._readyMaps().subscribe( () => {
      this.windowRef.navigator.geolocation.getCurrentPosition((pos: Position) => {
        this._position$.next(pos);
      },
      (error) => {
        // console.error('Position is not available', error);
        this._position$.error(error);
      },
      {
        enableHighAccuracy: true
      });
    });
    return this._position$.asObservable().pipe(first());
  }

  private _readyMaps(): Observable<void> {
    return this._readyMaps ? of(true) : Observable.create(obs => {
      this.mapsAPILoader.load()
      .then( () => { this.mapLoaded = true; obs.next(); });
    }).pipe(first());
  }
}
