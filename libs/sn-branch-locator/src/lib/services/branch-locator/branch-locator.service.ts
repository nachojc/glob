import { Injectable, Inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Branch } from '../../models/branch.model';
import { LatLngLiteral } from '@agm/core';
import { map, reduce } from 'rxjs/operators';
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
   * @description Returns a list of points of interest
   * @Returns {Observable<Branch[]>}
   * @memberOf SnBranchLocatorService
   */
  public getBranchesByCoords(coords: LatLngLiteral): Observable<any> {
    // coords = {lat: 52.037222, lng: -0.77027524 };
    const configVal = encodeURI(`{"coords":[${coords.lat},${coords.lng}]}`);
    return this.http.get<Branch[]>(`${this.branchLocator.apiURL}/find/defaultView?config=${configVal}`)
      .pipe(map(resp => this.groupAtmToBranch(resp)));
  }

  public getBranchesByBounds(northEast: LatLngLiteral, southWest: LatLngLiteral): Observable<Branch[]> {
    const configVal = encodeURI(`${northEast.lat},${northEast.lng}&southWest=${southWest.lat},${southWest.lng}`);
    return this.http.get<Branch[]>(`${this.branchLocator.apiURL}/find/defaultView?northEast=${configVal}`)
      .pipe(map(resp => this.groupAtmToBranch(resp)));
  }

  private groupAtmToBranch(array: Branch[]): Branch[] {
    return array.reduce((poiArray, currentValue) => {
      const index = poiArray.findIndex(el => el.distanceInKm === currentValue.distanceInKm);
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
            // TODO: What should we do when there are 2 branches in the same place?
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

}
