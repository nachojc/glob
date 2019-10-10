import { Component, OnInit, Input } from '@angular/core';
import { Branch } from '../../models/branch.model';

@Component({
  selector: 'sn-branch-info',
  templateUrl: './sn-branch-info.component.html',
  styleUrls: ['./sn-branch-info.component.scss']
})
export class SnBranchInfoComponent {
  private _branch: Branch;

  @Input()
  set branch(value: Branch) {
    this._branch = value;
  }

  get branch() {
    return this._branch;
  }

  constructor() { }

  callBranch() {
  }

}
