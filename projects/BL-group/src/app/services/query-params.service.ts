import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueryParamsService implements OnDestroy {

  private _activatedRouteSubscription: any;
  private _parametersSubject: Subject<any> = new Subject();
  public parametersWatcher: Observable<any> = this._parametersSubject.asObservable();

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    this._activatedRouteSubscription = this.activatedRoute
      .queryParams
      .subscribe(
        params => {
          this._parametersSubject.next(params);
        },
        (error) => this.handleError(error)
      );
  }

  handleError(error: Error) {
    console.log('Error: ', error);
  }

  ngOnDestroy() {
    this._activatedRouteSubscription.unsubscribe();
  }

}
