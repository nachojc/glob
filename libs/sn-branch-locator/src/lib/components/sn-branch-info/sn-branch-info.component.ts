import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Branch } from '../../models/branch.model';
import { ViewsAnalyticsVariables } from '../../constants/views-analytics-variables';
import { EventsAnalyticsVariables } from '../../constants/events-analytics-variables';
import { LabelPipe } from '../../pipes/label/label.pipe';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { take } from 'rxjs/operators';
import { AnalyticsService } from '../../services/analytic/analytics.service';

@Component({
  selector: 'sn-branch-info',
  templateUrl: './sn-branch-info.component.html',
  styleUrls: ['./sn-branch-info.component.scss']
})
export class SnBranchInfoComponent implements OnInit {
  private _branch: Branch;
  public isBranch = true;
  public todayHours: string;
  // public language = this.translate.getDefaultLang();
  public language: string;

  @Input() isNearestMarker: boolean = false;

  @Input()
  set branch(value: Branch) {
    if (!this.language) {
      this.configuration.settings$.pipe(take(1)).subscribe(settings => {
        this.language = settings.language.defaultLanguage;
        this.branch = value;
      });
      return;
    }

    this._branch = this.setPOIInformation(value);
    if (this._branch.schedule !== null) {
      this.todayHours = this.getTodayTimeInformation(
        this._branch.schedule.workingDay
      );
    }
    this.isBranch = true;
    if (this._branch.objectType.code.toUpperCase() === 'ATM') {
      this._branch.atm = [this.setPOIInformation(value)];
      this.isBranch = false;
    } else if (this._branch.atm && this._branch.atm.length > 0) {
      this._branch.atm[0] = this.setPOIInformation(this._branch.atm[0]);
    }
  }

  get branch() {
    return this._branch;
  }

  @Output() branchInfoClicked = new EventEmitter<any>();

  @Output() branchDirection = new EventEmitter<any>();

  @Output() openDirectionsPanel = new EventEmitter<any>();

  constructor(
    private analyticsService: AnalyticsService,
    public labels: LabelPipe,
    public configuration: ConfigurationService
  ) {}

  ngOnInit(): void {
    const sendView = ViewsAnalyticsVariables.detailScreen;
    this.analyticsService.sendView(sendView);
  }

  contactBranch(phone: string) {}

  private setPOIInformation(poi: Branch): Branch {
    poi.products = this.getProducts(poi);
    poi.attributes = this.getAttributes(poi);
    if (poi.schedule !== null) {
      poi.schedule.preview = this.parseSchedule(poi.schedule.workingDay);
      poi.schedule.timeToClose = this.getHoursToClose(poi.schedule.workingDay);
    }
    return poi;
  }

  private getProducts(poi: Branch): string[] {
    if (poi && poi.comercialProducts) {
      return poi.comercialProducts.map(product =>
        product[this.language] ? product[this.language] : product.default
      );
    }
    return [];
  }

  private getAttributes(poi: Branch): string[] {
    if (poi.attrib) {
      return poi.attrib
        .map(attr => {
          // Remover blank spaces and nullable
          if (attr.code && attr.code !== '') {
            // get accesibility attribute
            if (attr.code.toUpperCase() === 'ACCESIBILITY') {
              poi.hasAccesibility = true;
              return null;
            }
            if (
              attr.multi &&
              (attr.multi.default || attr.multi[this.language])
            ) {
              if (attr.multi.default === 'NO') {
                return null;
              } else if (
                attr.multi.default === 'YES' ||
                attr.multi.default === 'SI'
              ) {
                return attr.code;
              } else {
                return attr.multi[this.language]
                  ? attr.multi[this.language]
                  : attr.multi.default;
              }
            } else {
              // if there aren't translation display the code
              return attr.code;
            }
          }
          return null;
        })
        .filter(attr => attr !== null);
    }
    return [];
  }

  getHoursToClose(schedule) {
    const poiHours = this.getTodayTimeInformation(schedule);
    if (poiHours) {
      if (poiHours === 'Closed') {
        return {
          // text: this.labels.transform('branchLocator.details.closed'),
          text: this.labels.transform('POICLOSED'),
          mode: 'CLOSED'
        };
      }
      const now = new Date(
        0,
        0,
        0,
        new Date().getHours(),
        new Date().getMinutes(),
        0
      );
      const [start, end] = poiHours.split('-').map(res => res.split(':'));
      const startDate = new Date(
        0,
        0,
        0,
        Number(start[0]),
        Number(start[1]),
        0
      );
      const endDate = new Date(0, 0, 0, Number(end[0]), Number(end[1]), 0);
      if (
        now.getTime() < startDate.getTime() ||
        now.getTime() > endDate.getTime()
      ) {
        return {
          text: this.labels.transform('POICLOSED'),
          mode: 'CLOSED'
        };
      } else {
        let diff = endDate.getTime() - now.getTime();
        const hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        const minutes = Math.floor(diff / 1000 / 60);
        if (hours <= 0) {
          return {
            text: `${this.labels.transform('POICLOSING')} ${
              minutes <= 9 ? '0' : ''
            }${minutes} min`,
            mode: 'CLOSING'
          };
        }
        // return 'Closing in ' + (hours > 0 ? hours + 'h' : '') + (minutes <= 9 ? '0' : '') + minutes;
        return {
          text: this.labels.transform('POIOPEN'),
          mode: 'OPEN'
        };
      }
    }
  }

  getTodayTimeInformation(branchSchedule: any) {
    const auxHours = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY'
    ];
    const now = new Date().getDay();
    return branchSchedule[auxHours[now]][0];
  }

  public parseSchedule(branchSchedule: any): any[] {
    const hoursEnum = {
      MONDAY: {
        en: 'Mon',
        es: 'Lun',
        pt: 'Seg'
      },
      TUESDAY: {
        en: 'Tue',
        es: 'Mar',
        pt: 'Ter'
      },
      WEDNESDAY: {
        en: 'Wed',
        es: 'Mi??',
        pt: 'Qua'
      },
      THURSDAY: {
        en: 'Thu',
        es: 'Jue',
        pt: 'Qui'
      },
      FRIDAY: {
        en: 'Fri',
        es: 'Vie',
        pt: 'Sex'
      },
      SATURDAY: {
        en: 'Sat',
        es: 'S??b',
        pt: 'S??b'
      },
      SUNDAY: {
        en: 'Sun',
        es: 'Dom',
        pt: 'Dom'
      }
    };

    const groupedHours = [];
    let index = 0;
    Object.keys(hoursEnum).forEach(res => {
      if (branchSchedule[res] && branchSchedule[res].length > 0) {
        // create first group.
        if (groupedHours.length === 0) {
          groupedHours.push({
            text: `${hoursEnum[res][this.language]}`,
            hours: branchSchedule[res]
          });
        } else {
          // if same hours, add to the previous group
          if (
            JSON.stringify(groupedHours[index].hours) ===
            JSON.stringify(branchSchedule[res])
          ) {
            groupedHours[index].text = `${
              groupedHours[index].text.split(' - ')[0]
            } - ${hoursEnum[res][this.language]}`;
          } else {
            // else, create a new group
            groupedHours.push({
              text: `${hoursEnum[res][this.language]}`,
              hours: branchSchedule[res]
            });
            index++;
          }
        }
      }
    });
    return groupedHours;
  }

  emitClick() {
    this.branchInfoClicked.emit();
  }

  emitDirectionCoords(geoCoords: any) {
    this.branchDirection.emit(geoCoords);
  }

  emitOpenDirectionsPanel() {
    this.emitDirectionCoords({
      geoCoords: this._branch.location.geoCoords,
      travelMode: 'DRIVING'
    });

    this.openDirectionsPanel.emit();
  }

  sendEvent(event) {
    const sendEvent = EventsAnalyticsVariables.clickTabPicker;
    sendEvent.BranchAtmType = event.tab.label ? event.tab.label : '';
    sendEvent.BranchAtmName = event.tab.label ? event.tab.label : '';
    sendEvent.TabName = this._branch.id ? this._branch.id : '';
    this.analyticsService.sendEvent(sendEvent);
  }

  sendCall() {
    const sendEvent = EventsAnalyticsVariables.clickCall;
    this.analyticsService.sendEvent(sendEvent);
  }
}
