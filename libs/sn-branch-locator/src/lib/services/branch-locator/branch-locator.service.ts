import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Branch } from '../../models/branch.model';
import { LatLngLiteral } from '@agm/core';

@Injectable({
  providedIn: 'root'
})
export class SnBranchLocatorService {

  readonly API_URL = 'https://back-weu.azurewebsites.net/branch-locator';
  constructor(
    public http: HttpClient,
  ) { }


  /**
   * @description Returns a list of branches
   * @Returns {Observable<Branch[]>}
   * @memberOf SnBranchLocatorService
   */
  public getBranchesByCoords(coords: LatLngLiteral): Observable<Branch[]> {
    const configVal = encodeURI(`{"coords":[${coords.lat},${coords.lng}]}`);
    return this.http.get<Branch[]>(`${this.API_URL}/find/defaultView?config=${configVal}`);
  }

  public getBranchesByBounds(northEast: LatLngLiteral, southWest: LatLngLiteral): Observable<Branch[]> {
    const configVal = encodeURI(`${northEast.lat},${northEast.lng}&southWest=${southWest.lat},${southWest.lng}`);
    return this.http.get<Branch[]>(`${this.API_URL}/find/defaultView?northEast=${configVal}`);
  }
}
