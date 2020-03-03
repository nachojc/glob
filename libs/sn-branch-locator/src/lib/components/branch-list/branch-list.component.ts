import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Branch } from '../../models/branch.model';
import { max } from 'rxjs/operators';

@Component({
  selector: 'sn-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnChanges {

  @Input() branchesList: Branch[];
  @Input() isLoading: boolean;
  @Output() branchSelected = new EventEmitter<Branch>();

  private numberOfBranchesToLoad = 10;
  public maxBranchesToLoad = this.numberOfBranchesToLoad;
  public incrementRange = this.numberOfBranchesToLoad;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes: ', changes);
    if (typeof (changes.branchesList) !== 'undefined' &&
      changes.branchesList.previousValue !== changes.branchesList.currentValue) {
      this.maxBranchesToLoad = this.numberOfBranchesToLoad;
    }
  }

  selectBranch(branch: Branch) {
    this.branchSelected.emit(branch);
  }

  loadMoreResults() {
    const remainigBranches = this.branchesList.length - this.maxBranchesToLoad;
    if (remainigBranches >= this.incrementRange) {
      this.maxBranchesToLoad = this.maxBranchesToLoad + this.incrementRange;
    } else {
      this.maxBranchesToLoad = this.branchesList.length;
    }
  }
}
