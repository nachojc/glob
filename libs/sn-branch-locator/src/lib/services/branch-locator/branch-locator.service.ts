import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Branch } from '../../models/branch.model';
import { LatLngLiteral } from '@agm/core';
import { retry, groupBy, map, mergeMap, reduce, filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SnBranchLocatorService {

  readonly API_URL = 'https://back-weu.azurewebsites.net/branch-locator';
  constructor(
    public http: HttpClient,
  ) { }


  /**
   * @description Returns a list of points of interest
   * @Returns {Observable<Branch[]>}
   * @memberOf SnBranchLocatorService
   */
  public getBranchesByCoords(coords: LatLngLiteral): Observable<any> {
    // coords = {lat: 52.037222, lng: -0.77027524 };
    return this.http.get<any>(`${this.API_URL}/find/defaultView?config={"coords":[${coords.lat},${coords.lng}]}`)
      .pipe(map(resp => this.groupAtmToBranch(resp)));
  }

  public getBranchesByBounds(northEast: LatLngLiteral, southWest: LatLngLiteral): Observable<Branch[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get<Branch[]>(`${this.API_URL}/find/defaultView?northEast=${northEast.lat},${northEast.lng}&southWest=${southWest.lat},${southWest.lng}`)
      .pipe(map(resp => this.groupAtmToBranch(resp)));
  }

  private groupAtmToBranch(array: Branch[]): Branch[] {
    return array.reduce((pv, cv) => {
      const index = pv.findIndex(el => el.distanceInKm === cv.distanceInKm);
      if (index >= 0) {
        if (pv[index].objectType.code.toUpperCase() === 'BRANCH') {
          pv[index].atm = cv;
          return pv;
        } else {
          cv.atm = pv[index];
          pv[index] = cv;
          return pv;
        }
      }
      pv.push(cv);
      return pv;
    }, []);
  }
}
