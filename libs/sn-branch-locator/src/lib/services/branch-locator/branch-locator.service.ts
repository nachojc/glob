import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { LatLngLiteral } from '@agm/core';
import { GlobileSettingsService, WindowRefService } from '@globile/mobile-services';

import { Branch } from '../../models/branch.model';
import { EnvBranchLocatorModel } from '../../models/env-branch-locator.model';
import { FilterService } from '../filter/filter.service';
import { GeoPositionService } from '../geo-position/geo-position.service';

@Injectable({
  providedIn: 'root'
})
export class SnBranchLocatorService {
  private URL: string;
  private _observer$ = new Subject<Branch[]>();
  private _initPosition: LatLngLiteral;
  branchLocator: EnvBranchLocatorModel;

  constructor(
    globileSettings: GlobileSettingsService,
    public http: HttpClient,
    private filterservice: FilterService,
    @Inject(WindowRefService) windowRef: WindowRefService,
    private geoPositionService: GeoPositionService
  ) {
    this.branchLocator = globileSettings.branchLocator;
  }

  get onChange(): Observable<Branch[]> {
    return this._observer$.asObservable();
  }

  /**
   * @description Returns a list of points of interest
   * @Returns {Observable<Branch[]>}
   * @memberOf SnBranchLocatorService
   */
  public getBranchesByCoords(coords: LatLngLiteral): void {
    console.log('BLA - getBranchesByCoords()');
    if (!coords) {
      this._observer$.next([]);
      return;
    }
    if (!this._initPosition) {
      this.setApiURL(coords);
    }

    const configVal = encodeURI(`config={"coords":[${coords.lat},${coords.lng}]}`);
    this.getBranches(`${this.URL}/find/defaultView?${configVal}`).subscribe(
      resp => this._observer$.next(resp),
      err => this._observer$.error(err)
    );
  }

  public getBranchesByBounds(
    northEast: LatLngLiteral,
    southWest: LatLngLiteral,
    coords?: LatLngLiteral
  ): void {
    console.log('BLA - getBranchesByBounds');
    if (!this._initPosition) {
      this.setApiURL(coords);
    }
    const params = this.filterservice.filterParams as any;
    const configInit = encodeURI(
      `config={"coords":[${this._initPosition.lat},${this._initPosition.lng}]}`
    );
    const configVal = encodeURI(
      `northEast=${northEast.lat},${northEast.lng}&southWest=${southWest.lat},${southWest.lng}`
    );
    this.getBranches(`${this.URL}/find/defaultView?${configInit}&${configVal}`, {
      params
    }).subscribe(
      resp => this._observer$.next(resp),
      err => this._observer$.error(err)
    );
  }

  public getClosestBranchByTextQuery(text: string) {
    return this.geoPositionService.getPositionByText(text).pipe(
      flatMap(coords => {
        console.log('BLA - getClosestBranchByTextQuery');
        const configVal = encodeURI(`config={"coords":[${coords.lat},${coords.lng}]}`);
        if (!this._initPosition) {
          this.setApiURL({ lat: coords.lat, lng: coords.lng });
        }
        return this.getBranches(`${this.URL}/find/defaultView?${configVal}`);
      }),
      map(branches => {
        branches.sort((a, b) =>
          a.distanceInKm > b.distanceInKm ? 1 : b.distanceInKm > a.distanceInKm ? -1 : 0
        );
        return branches[0];
      })
    );
  }

  private getBranches(url: string, params = {}): Observable<Branch[]> {
    return this.http.get<Branch[]>(url, params).pipe(
      map(resp => this._changeDistance(resp)),
      map(resp => this.groupAtmToBranch(resp))
    );
  }

  private groupAtmToBranch(array: Branch[]): Branch[] {
    console.log('BLA - groupAtmToBranch');
    return array.reduce((poiArray, currentValue) => {
      const index = poiArray.findIndex(
        el => el.distanceInKm.toFixed(2) === currentValue.distanceInKm.toFixed(2)
      );
      if (index >= 0) {
        if (poiArray[index].objectType.code.toUpperCase() === 'BRANCH') {
          if (poiArray[index].atm) {
            poiArray[index].atm.push(currentValue);
          } else {
            poiArray[index].atm = [currentValue];
          }
          return poiArray;
        } else {
          if (currentValue.objectType.code.toUpperCase() === 'BRANCH') {
            if (poiArray[index].atm) {
              currentValue.atm = poiArray[index].atm;
              currentValue.atm.push(poiArray[index]);
            } else {
              currentValue.atm = [poiArray[index]];
            }
            poiArray[index] = currentValue;
          } else {
            // TODO: What should we do when there are 2 atm in the same place?
            currentValue.atm = [poiArray[index]];
            if (poiArray[index].atm) {
              poiArray[index].atm.push(currentValue);
            } else {
              poiArray[index].atm = [currentValue];
            }
          }
          return poiArray;
        }
      }
      poiArray.push(currentValue);
      return poiArray;
    }, []);
  }

  private _changeDistance(array: Branch[]): Branch[] {
    return array.map(ele => {
      if (!ele.distanceDone && this._initPosition) {
        const p = ele.location.geoCoords;
        ele.distanceInKm = parseFloat(
          this.getDistance({ lat: p.latitude, lng: p.longitude }).toFixed(2)
        );
        ele.distanceInMiles = parseFloat((ele.distanceInKm / 1.609).toFixed(2));
        ele.distanceDone = true;
      }
      return ele;
    });
  }
  private getDistance(p2: LatLngLiteral): number {
    const p1 = this._initPosition;
    const rad = x => (x * Math.PI) / 180;
    const R = 6378.137;
    const dLat = rad(p2.lat - p1.lat);
    const dLong = rad(p2.lng - p1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  private setApiURL(coords?: LatLngLiteral) {
    this._initPosition = coords;
    const pos0 = this.getDistance(this.branchLocator.endpoints[0]);
    const pos1 = this.getDistance(this.branchLocator.endpoints[1]);
    this.URL =
      pos0 < pos1 ? this.branchLocator.endpoints[0].URL : this.branchLocator.endpoints[1].URL;
  }
}
