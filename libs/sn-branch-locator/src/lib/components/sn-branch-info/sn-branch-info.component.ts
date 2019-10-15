import { Component, Input,  ChangeDetectorRef } from '@angular/core';
import { Branch } from '../../models/branch.model';

@Component({
  selector: 'sn-branch-info',
  templateUrl: './sn-branch-info.component.html',
  styleUrls: ['./sn-branch-info.component.scss']
})
export class SnBranchInfoComponent {
  private _branch: Branch;
  public isBranch: boolean = true;


  @Input()
  set branch(value: Branch) {
    this._branch = this.setPOIInformation(value);
    // setTimeout(() => {
    this.isBranch = true;
    if (this._branch.objectType.code.toUpperCase() === 'ATM') {
      this._branch.atm = [this.setPOIInformation(value)];
      this.isBranch = false;
    } else if (this._branch.atm && this._branch.atm.length > 0) {
      this._branch.atm[0] = this.setPOIInformation(this._branch.atm[0]);
    }
    // }, 0);
    // console.log(this._branch);
    // if (this._branch.attrib) {
    //   this.attributeList = this._branch.attrib.map(attr => attr.code);
    //   const auxAccesibility = this.attributeList.findIndex(attr => attr.toUpperCase() === 'ACCESIBILITY');
    //   this.haveAccesibility = auxAccesibility > -1 ? true : false;
    // }
  }

  get branch() {
    return this._branch;
  }

  constructor(private ref: ChangeDetectorRef) { }

  contactBranch(phone: string) {
  }

  setPOIInformation(poi: Branch): Branch {
    poi.products = this.getProducts(poi);
    poi.attributes = this.getAttributes(poi);
    poi.schedule.preview = this.parseHours(poi.schedule.workingDay);
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

  public parseHours(branchSchedule: any): any[] {
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

}
