export interface AnalyticsViewModel {
  ScreenName: string;
  ScreenNamelocal?: string;
  [key: string]: string;
}
export interface AnalyticsEventModel extends AnalyticsViewModel {
  EventCategory: string;
  EventAction: string;
  EventLabel: string;
  EventName: string;
  EventCategorylocal?: string;
  EventActionlocal?: string;
  EventLabellocal?: string;
}

export interface AnalyticsInitModel {
  account: string;
  profile: string;
  environment: string;
}
