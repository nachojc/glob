import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Branch } from '../../models/branch.model';

@Component({
  selector: 'sn-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent {

  @Input() branchesList: Branch[];
  @Input() isLoading: boolean;
  @Output() branchSelected = new EventEmitter<Branch>();

  selectBranch(branch: Branch) {
    this.branchSelected.emit(branch);
  }



}
