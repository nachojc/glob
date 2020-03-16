import { Injectable, Inject } from '@angular/core';
import { Observable, Subject, of, from } from 'rxjs';
import { MapsAPILoader, LatLngLiteral } from '@agm/core';
import { first, map } from 'rxjs/operators';
import { WindowRef } from '../../models/window-ref';

declare const google: any;
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

  public getPositionByText(text: string): Observable<LatLngLiteral> {

    return new Observable(obs => {
      this._readyMaps().subscribe(() => {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({address: text}, (result) => {
          const lat = result[0].geometry.location.lat();
          const lng = result[0].geometry.location.lng();
          obs.next({lat, lng});
          obs.complete();
        });
      });
    });
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

  private _readyMaps(): Observable<unknown> {
    if (this.mapLoaded) {
      return of(true);
    }
    return from(this.mapsAPILoader.load()).pipe(
      map(() => this.mapLoaded = true),
      first()
    );
  }
}
