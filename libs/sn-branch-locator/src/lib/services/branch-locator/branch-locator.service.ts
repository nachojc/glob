import { Injectable, Inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';

import { Branch } from '../../models/branch.model';
import { LatLngLiteral } from '@agm/core';
import { map } from 'rxjs/operators';
import { EnvBranchLocatorModel } from '../../models/env-branch-locator.model';
import { ENV_CONFIG } from '@globile/mobile-services';
import { FilterService } from '../filter/filter.service';

@Injectable({
  providedIn: 'root'
})
export class SnBranchLocatorService {
  private _observer$ = new Subject<Branch[]>();
  private _initPosition: LatLngLiteral;
  branchLocator: EnvBranchLocatorModel;

  constructor(
    @Inject(ENV_CONFIG) envConfig: any,
    public http: HttpClient,
    private filterservice: FilterService
  ) {
    this.branchLocator = envConfig.api.BranchLocator;
  }


  /**
   * @description Returns a list of points of interest
   * @Returns {Observable<Branch[]>}
   * @memberOf SnBranchLocatorService
   */
  public getBranchesByCoords(coords: LatLngLiteral): void {
    if (!coords) {
      this._observer$.next([]);
    }
    if (!this._initPosition) {
      this._initPosition = coords;
    }

    const configVal = encodeURI(`{"coords":[${coords.lat},${coords.lng}]}`);
    this.http.get<Branch[]>(`${this.branchLocator.apiURL}/find/defaultView?config=${configVal}`)
    .pipe(map(resp => this.groupAtmToBranch(resp))).subscribe((resp) => this._observer$.next(resp));
  }

  public getBranchesByBounds(northEast: LatLngLiteral, southWest: LatLngLiteral): void {
    const params = this.filterservice.filterParams as any;
    const configVal = encodeURI(`${northEast.lat},${northEast.lng}&southWest=${southWest.lat},${southWest.lng}`);
    this.http.get<Branch[]>(`${this.branchLocator.apiURL}/find/defaultView?northEast=${configVal}`, { params})
      .pipe(
        map(resp => this._changeDistance(resp)),
        map(resp => this.groupAtmToBranch(resp))
      ).subscribe((resp) => this._observer$.next(resp));
  }

  private groupAtmToBranch(array: Branch[]): Branch[] {
    return array.reduce((poiArray, currentValue) => {
      const index = poiArray.findIndex(el => el.distanceInKm.toFixed(2) === currentValue.distanceInKm.toFixed(2));
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
        ele.distanceInKm = parseFloat( this.getDistance(
          {lat: p.latitude, lng: p.longitude}).toFixed(2));
        ele.distanceInMiles = parseFloat( (ele.distanceInKm / 1.609).toFixed(2));
        ele.distanceDone = true;
      }
      return ele;
    });
  }
  private  getDistance(p2: LatLngLiteral): number {
    const p1 = this._initPosition;
    const rad = (x) => x * Math.PI / 180;
    const R = 6378.137;
    const dLat = rad( p2.lat - p1.lat );
    const dLong = rad( p2.lng - p1.lng );
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }


   get branchesObservable(): Observable<Branch[]> {
    return this._observer$.asObservable();
  }
}
