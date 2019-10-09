import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Branch } from './models/branch.model';
import { LatLngLiteral } from '@agm/core';

@Injectable({
  providedIn: 'root'
})
export class SnBranchLocatorService {

  readonly API_URL = 'https://back-weu.azurewebsites.net/branch-locator';
  constructor(
    private http: HttpClient,
  ) { }


  /**
   * @description Returns a list of branches
   * @Returns {Observable<Branch[]>}
   * @memberOf SnBranchLocatorService
   */
  getBranchesByCoords(coords: LatLngLiteral): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.API_URL}/find/defaultView?config={"coords":[${coords.lat},${coords.lng}]}`);
  }
}
