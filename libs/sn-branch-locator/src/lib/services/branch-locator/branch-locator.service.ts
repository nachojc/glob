import { Injectable, Inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Branch } from '../../models/branch.model';
import { LatLngLiteral } from '@agm/core';
import { EnvBranchLocatorModel } from '../../models/env-branch-locator.model';
import { ENV_CONFIG } from '@globile/mobile-services';

@Injectable({
  providedIn: 'root'
})
export class SnBranchLocatorService {

  branchLocator: EnvBranchLocatorModel;

  // TODO:For now we using "any" because mobile service still not updated. Change to EnvironmentConfigModel after.

  constructor(
    @Inject(ENV_CONFIG) envConfig: any,
    public http: HttpClient,
  ) {
    this.branchLocator = envConfig.api.BranchLocator;
  }


  /**
   * @description Returns a list of branches
   * @Returns {Observable<Branch[]>}
   * @memberOf SnBranchLocatorService
   */
  public getBranchesByCoords(coords: LatLngLiteral): Observable<Branch[]> {
    // return this.http.get<Branch[]>(`${this.API_URL}/find/defaultView?config={"coords":[${coords.lat},${coords.lng}]}`);
    return this.http.get<Branch[]>(`${this.branchLocator.apiURL}/find/defaultView?config="coords":${coords.lat},${coords.lng}`);
  }

  public getBranchesByBounds(northEast: LatLngLiteral, southWest: LatLngLiteral): Observable<Branch[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get<Branch[]>(`${this.branchLocator.apiURL}/find/defaultView?northEast=${northEast.lat},${northEast.lng}&southWest=${southWest.lat},${southWest.lng}`);
  }
}
