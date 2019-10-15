import { Component, Input,  ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Branch } from '../../models/branch.model';

@Component({
  selector: 'sn-branch-info',
  templateUrl: './sn-branch-info.component.html',
  styleUrls: ['./sn-branch-info.component.scss']
})
export class SnBranchInfoComponent {
  private _branch: Branch;
  public isBranch: boolean = true;
  public todayHours: string;


  @Input()
  set branch(value: Branch) {
    this._branch = this.setPOIInformation(value);
    console.log(this._branch);
    this.todayHours = this.getTodayTimeInformation(this._branch.schedule.workingDay);
    // setTimeout(() => {
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



  constructor(private ref: ChangeDetectorRef) { }

  contactBranch(phone: string) {
  }

  getHoursToClose(schedule) {
    const poiHours = this.getTodayTimeInformation(schedule);
    if (poiHours) {
      const now = new Date(0, 0, 0 , new Date().getHours(), new Date().getMinutes(), 0);
      const [start, end] = poiHours.split('-').map(res => res.split(':'));
      const startDate = new Date(0, 0, 0, Number(start[0]), Number(start[1]), 0);
      const endDate = new Date(0, 0, 0, Number(end[0]), Number(end[1]), 0);
      if (now.getTime() < startDate.getTime() || now.getTime() > endDate.getTime()) {
        return 'Closed';
      } else {
        let diff = endDate.getTime() - now.getTime();
        const hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        const minutes = Math.floor(diff / 1000 / 60);

        return 'Closing in ' + (hours > 0 ? hours + 'h' : '') + (minutes <= 9 ? '0' : '') + minutes;
      }
    }
  }

  getAccesibility(attributes): boolean {
    return attributes ? attributes.find(attr => attr.toUpperCase() === 'ACCESIBILITY') ? true : false : false;
  }


  getTodayTimeInformation(branchSchedule: any) {
    const auxHours = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const now = new Date();
    return branchSchedule[auxHours[now.getDay()]][0];
  }

  setPOIInformation(poi: Branch): Branch {
    poi.products = this.getProducts(poi);
    poi.attributes = this.getAttributes(poi);
    poi.schedule.preview = this.parseSchedule(poi.schedule.workingDay);
    poi.schedule.timeToClose = this.getHoursToClose(poi.schedule.workingDay);
    return poi;
  }

  public getProducts(poi: Branch): string[] {
    return poi.comercialProducts ? poi.comercialProducts.map(product => product.default) : [];
  }

  public getAttributes(poi: Branch): string[] {
    // remove blank attributes and accesibility
    return (poi.attrib ? poi.attrib.map(attr => attr.code && attr.code !== '' ? attr.code : null) : [])
      .filter(attr => (attr !== null && attr.toUpperCase() !== 'ACCESIBILITY'));
  }

  public parseSchedule(branchSchedule: any): any[] {
    // TODO: Verify how it will work with translation.
    const language = 'default';
    const hoursEnum = {
        MONDAY: {
          default: 'Mon',
          br: 'Seg'
        },
        TUESDAY: {
          default: 'Tue',
          br: 'Ter'
        },
        WEDNESDAY: {
          default: 'Wed',
          br: 'Qua'
        },
        THURSDAY: {
          default: 'Thu',
          br: 'Qui'
        },
        FRIDAY: {
          default: 'Fri',
          br: 'Sex'
        },
        SATURDAY: {
          default: 'Sat',
          br: 'Sab'
        },
        SUNDAY: {
          default: 'Sun',
          br: 'Ter'
        }
      };

    const groupedHours = [];
    let index = 0;
    Object.keys(hoursEnum).forEach(res => {
      if (branchSchedule[res] && branchSchedule[res].length > 0) {
        // create first group.
        if (groupedHours.length === 0) {
          groupedHours.push({
            text: `${hoursEnum[res][language]}`,
            hours: branchSchedule[res]
          });
        } else {
          // if same hours, add to the previous group
          if (JSON.stringify(groupedHours[index].hours) === JSON.stringify(branchSchedule[res])) {
            groupedHours[index].text = `${groupedHours[index].text.split(' - ')[0]} - ${hoursEnum[res][language]}`;
          } else {
            // else, create a new group
            groupedHours.push({
              text: `${hoursEnum[res][language]}`,
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
