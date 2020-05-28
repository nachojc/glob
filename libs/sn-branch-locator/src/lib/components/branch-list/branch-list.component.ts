import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Branch } from '../../models/branch.model';

@Component({
  selector: 'sn-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnChanges, OnInit {

  @Input() branchesList: Branch[];
  @Input() isLoading: boolean;
  @Output() branchSelected = new EventEmitter<Branch>();
  @Output() menuDidOpen = new EventEmitter<boolean>();
  @Output() menuDidClose = new EventEmitter<boolean>();
  currentState = 'menuOpened';

  private numberOfBranchesToLoad = 10;
  private branchIconTypes = {
    branch: {
      particulares: 'sn-CHAN007',
      select: 'sn-BAN020',
      bancaprivada: 'sn-SERV008',
      pyme: 'sn-BAN023',
      universidades: 'sn-SERV049',
      workcafe: 'sn-FUNC136',
      ag_financieros: 'sn-BAN040',
      empresas: 'sn-SERV006'
    },
    atm: {
      non_santander_atm: 'sn-FUNC019C',
      santander_atm: 'sn-FUNC029',
    },
    corresponsales: {
      corresponsales: 'sn-BAN025'
    }
  };
  public maxBranchesToLoad = this.numberOfBranchesToLoad;
  public incrementRange = this.numberOfBranchesToLoad;
  public isMoreBranchesToLoad = true;
  public  branchIcons = [];

  ngOnInit(): void {
    this.isMoreBranchesToLoad = this.branchesList && this.branchesList.length > this.incrementRange ? true : false;
  }

  identifyIconType() {
    this.branchIcons = this.branchesList.map((branch: Branch) => {
      if (branch.objectType && branch.subType &&
        this.branchIconTypes[branch.objectType.code.toLowerCase()]
        .hasOwnProperty(branch.subType.code.toLowerCase())) {
        const iconType = this.branchIconTypes[branch.objectType.code.toLowerCase()];
        return iconType[branch.subType.code.toLowerCase()];
      }
      return 'sn-CHAN007';
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof (changes.branchesList) !== 'undefined' &&
      changes.branchesList.previousValue !== changes.branchesList.currentValue) {
      this.maxBranchesToLoad = this.numberOfBranchesToLoad;
      this.isMoreBranchesToLoad = this.branchesList && this.branchesList.length > this.incrementRange ? true : false;
      this.identifyIconType();
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
      this.isMoreBranchesToLoad = false;
    }
  }

  changeState() {
    this.currentState = this.currentState === 'menuOpened' ? 'menuClosed' : 'menuOpened';
  }

  open() {
    this.currentState = 'menuOpened';
  }

  close() {
    this.currentState = 'menuClosed';
  }
}
