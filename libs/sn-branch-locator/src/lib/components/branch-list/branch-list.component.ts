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

  public maxBranchesToLoad = 10;
  public incrementRange = this.maxBranchesToLoad;

  selectBranch(branch: Branch) {
    this.branchSelected.emit(branch);
  }

  loadMoreResults() {
    const remainigBranches = this.branchesList.length - this.maxBranchesToLoad;
    if (remainigBranches >= this.incrementRange ) {
      this.maxBranchesToLoad = this.maxBranchesToLoad + this.incrementRange;
    } else {
      this.maxBranchesToLoad = this.branchesList.length;
    }
  }
}
