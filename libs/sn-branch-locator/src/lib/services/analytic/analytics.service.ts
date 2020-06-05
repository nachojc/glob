import { Injectable } from '@angular/core';
import { AnalyticsViewModel, AnalyticsEventModel } from '../../models/analytics';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private _subject = new Subject<AnalyticsViewModel | AnalyticsEventModel>();

  constructor() {}

  sendView(screenName: string) {
    const view: AnalyticsViewModel = { ScreenName: screenName};
    this._subject.next(view);
  }

  sendEvent(msg: AnalyticsViewModel | AnalyticsEventModel) {

    this._subject.next(msg);
  }

  getAnalytics() {
    return this._subject.asObservable();
  }
}
