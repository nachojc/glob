import { Component, OnInit, Input } from '@angular/core';
import { Branch } from '../../models/branch.model';

@Component({
  selector: 'sn-branch-info',
  templateUrl: './sn-branch-info.component.html',
  styleUrls: ['./sn-branch-info.component.scss']
})
export class SnBranchInfoComponent {
  private _branch: Branch;
  public schedulePreview = [];
  public haveAccesibilitty: boolean;
  public attributeList: string[];

  @Input()
  set branch(value: Branch) {
    this._branch = value;
    this.schedulePreview = this.parseHours(this._branch.schedule.workingDay);
    if (this._branch.attrib) {
      this.attributeList = this._branch.attrib.map(attr => attr.code);
      this.haveAccesibilitty = this.attributeList.find(attr => attr.toUpperCase() === 'ACCESIBILITY') ? true : false;
    }
  }

  get branch() {
    return this._branch;
  }

  constructor() { }

  contactBranch(phone: string) {
  }

  private parseHours(branchSchedule: any) {

    // TODO: Verify how it will work with internatilization.
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

}
