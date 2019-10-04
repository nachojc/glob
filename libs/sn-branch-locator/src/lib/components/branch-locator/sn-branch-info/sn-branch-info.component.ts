import { Component, OnInit, Input } from '@angular/core';
import { Branch } from '../../../models/branch.model';

@Component({
  selector: 'sn-branch-info',
  templateUrl: './sn-branch-info.component.html',
  styleUrls: ['./sn-branch-info.component.scss']
})
export class SnBranchInfoComponent {

  // tslint:disable-next-line: variable-name
  private _branch: Branch;

  @Input()
  set branch(value: Branch) {
    this._branch = value;
    this.parseHour(this._branch.schedule.workingDay);
  }

  get branch() {
    return this._branch;
  }

  constructor() { }

  contactBranch() {
  }

  parseHour(branchSchedule: any) {
    const nowWeekDay = new Date().getDay();
    console.log('nowWeekDay: ', nowWeekDay);
    Object.keys(branchSchedule).forEach(weekDay => {
      console.log('day: ', weekDay);
      console.log(branchSchedule[weekDay]);
    });

  //   "schedule": {
  //     "workingDay": {
  //         "WEDNESDAY": [
  //             "09:30-17:00"
  //         ],
  //         "MONDAY": [
  //             "09:30-17:00"
  //         ],
  //         "THURSDAY": [
  //             "09:30-17:00"
  //         ],
  //         "SUNDAY": [],
  //         "TUESDAY": [
  //             "09:30-17:00"
  //         ],
  //         "FRIDAY": [
  //             "09:30-17:00"
  //         ],
  //         "SATURDAY": [
  //             "09:30-16:00"
  //         ]
  //     },
  //     "specialDay": []
  // },
  }

}
