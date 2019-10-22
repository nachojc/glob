import { Component, Input,  ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Branch } from '../../models/branch.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'sn-branch-info',
  templateUrl: './sn-branch-info.component.html',
  styleUrls: ['./sn-branch-info.component.scss']
})
export class SnBranchInfoComponent {
  private _branch: Branch;
  public isBranch: boolean = true;
  public todayHours: string;
  public language = this.translate.getDefaultLang();

  @Input() isNearestMarker: boolean = false;

  @Input()
  set branch(value: Branch) {
    this._branch = this.setPOIInformation(value);
    this.todayHours = this.getTodayTimeInformation(this._branch.schedule.workingDay);
    console.log(this._branch);
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

  // TODO : Temporary fix.
  @Output() branchInfoClicked = new EventEmitter<any>();



  constructor(public translate: TranslateService) {
  }

  contactBranch(phone: string) {
  }

  private setPOIInformation(poi: Branch): Branch {
    poi.products = this.getProducts(poi);
    poi.attributes = this.getAttributes(poi);
    poi.schedule.preview = this.parseSchedule(poi.schedule.workingDay);
    poi.schedule.timeToClose = this.getHoursToClose(poi.schedule.workingDay);
    return poi;
  }

  private getProducts(poi: Branch): string[] {
    if (poi.comercialProducts) {
      return poi.comercialProducts.map(product => product[this.language] ? product[this.language] : product.default);
    }
    return [];
  }

  private getAttributes(poi: Branch): string[] {
    if (poi.attrib) {
      return poi.attrib.map(attr => {
        // Remover blank spaces and nullable
        if (attr.code && attr.code !== '') {
          // get accesibility attribute
          if (attr.code.toUpperCase() === 'ACCESIBILITY') {
            poi.hasAccesibility = true;
            return null;
          }
          if (attr.multi && (attr.multi.default || attr.multi[this.language])) {
            if (attr.multi.default === 'NO') {
              return null;
            } else if (attr.multi.default === 'YES' || attr.multi.default === 'SI') {
              return attr.code;
            } else {
              return attr.multi[this.language] ? attr.multi[this.language] :  attr.multi.default;
            }
          } else {
            // if there aren't translation display the code
            return attr.code;
          }
        }
        return null;
      }).filter(attr => attr !== null);
    }
    return [];
  }


  getHoursToClose(schedule) {
    const poiHours = this.getTodayTimeInformation(schedule);
    if (poiHours) {
      const now = new Date(0, 0, 0 , new Date().getHours(), new Date().getMinutes(), 0);
      const [start, end] = poiHours.split('-').map(res => res.split(':'));
      const startDate = new Date(0, 0, 0, Number(start[0]), Number(start[1]), 0);
      const endDate = new Date(0, 0, 0, Number(end[0]), Number(end[1]), 0);
      if (now.getTime() < startDate.getTime() || now.getTime() > endDate.getTime()) {
        return {
          text: this.translate.instant('branchlocator.details.closed'),
          mode: 'CLOSED'
        };
      } else {
        let diff = endDate.getTime() - now.getTime();
        const hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        const minutes = Math.floor(diff / 1000 / 60);
        if (hours <= 0) {
          return {
            text: `${this.translate.instant('branchlocator.details.closing')} ${(minutes <= 9 ? '0' : '')}${minutes} min`,
            mode: 'CLOSING'
          };
        }
        // return 'Closing in ' + (hours > 0 ? hours + 'h' : '') + (minutes <= 9 ? '0' : '') + minutes;
        return {
          text: this.translate.instant('branchlocator.details.open'),
          mode: 'OPEN'
        };
      }
    }
  }

  getAccesibility(attributes): boolean {
    return attributes ? attributes.find(attr => attr.code && attr.code.toUpperCase() === 'ACCESIBILITY') ? true : false : false;
  }


  getTodayTimeInformation(branchSchedule: any) {
    const auxHours = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const now = new Date().getDay();
    return branchSchedule[auxHours[now]][0];
  }


  public parseSchedule(branchSchedule: any): any[] {
    const hoursEnum = {
        MONDAY: {
          en: 'Mon',
          es: 'Seg', // TODO: review translation
          pt: 'Seg'
        },
        TUESDAY: {
          en: 'Tue',
          es: 'Ter', // TODO: review translation
          pt: 'Ter'
        },
        WEDNESDAY: {
          en: 'Wed',
          es: 'Qua', // TODO: review translation
          pt: 'Qua'
        },
        THURSDAY: {
          en: 'Thu',
          es: 'Qui', // TODO: review translation
          pt: 'Qui'
        },
        FRIDAY: {
          en: 'Fri',
          es: 'Sex', // TODO: review translation
          pt: 'Sex'
        },
        SATURDAY: {
          en: 'Sat',
          es: 'Sab', // TODO: review translation
          pt: 'Sab'
        },
        SUNDAY: {
          en: 'Sun',
          es: 'Ter', // TODO: review translation
          pt: 'Ter'
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
          if (JSON.stringify(groupedHours[index].hours) === JSON.stringify(branchSchedule[res])) {
            groupedHours[index].text = `${groupedHours[index].text.split(' - ')[0]} - ${hoursEnum[res][this.language]}`;
          } else {
            // else, create a new group
            groupedHours.push({
              text: `${hoursEnum[res][this.language]}`,
              hours: branchSchedule[res]
            });
            index ++;
          }
        }
      }
    });
    return groupedHours;
  }

  emitClick() {
    this.branchInfoClicked.emit();
  }
}
