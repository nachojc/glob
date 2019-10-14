import { Injectable, Inject} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Branch } from '../../models/branch.model';
import { LatLngLiteral } from '@agm/core';
import { EnvBranchLocatorModel } from '../../models/env-branch-locator.model';
import { ENV_CONFIG } from '@globile/mobile-services';
import { FilterService } from '../filter/filter.service';

@Injectable({
  providedIn: 'root'
})
export class SnBranchLocatorService {

  branchLocator: EnvBranchLocatorModel;

  // TODO:For now we using "any" because mobile service still not updated. Change to EnvironmentConfigModel after.

  constructor(
    @Inject(ENV_CONFIG) envConfig: any,
    public http: HttpClient,
    private filterservice: FilterService
  ) {
    this.branchLocator = envConfig.api.BranchLocator;
  }


  /**
   * @description Returns a list of branches
   * @Returns {Observable<Branch[]>}
   * @memberOf SnBranchLocatorService
   */
  public getBranchesByCoords(coords: LatLngLiteral): Observable<Branch[]> {
    const configVal = encodeURI(`{"coords":[${coords.lat},${coords.lng}]}`);
    return this.http.get<Branch[]>(`${this.branchLocator.apiURL}/find/defaultView?config=${configVal}`);
  }

  public getBranchesByBounds(northEast: LatLngLiteral, southWest: LatLngLiteral): Observable<Branch[]> {
    const params = this.filterservice.filterParams as any;
    const configVal = encodeURI(`${northEast.lat},${northEast.lng}&southWest=${southWest.lat},${southWest.lng}`);
    return this.http.get<Branch[]>(`${this.branchLocator.apiURL}/find/defaultView?northEast=${configVal}`, { params});
  }
}
