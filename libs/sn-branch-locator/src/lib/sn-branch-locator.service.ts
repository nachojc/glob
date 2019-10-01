import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Branch } from './models/branch.model';

@Injectable({
  providedIn: 'root'
})
export class SnBranchLocatorService {

  constructor(
    private http: HttpClient,
  ) { }


  /**
   * @description Returns a list of branches
   * @Returns {Observable<Branch[]>}
   * @memberOf SnBranchLocatorService
   */
  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>('/find/defaultView');
  }
}
