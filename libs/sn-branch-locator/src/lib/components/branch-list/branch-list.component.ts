import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Branch } from '../../models/branch.model';

@Component({
  selector: 'sn-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {

  @Input() branchesList: Branch[];
  @Output() branchSelected = new EventEmitter<any>();

  ngOnInit(): void {

  }



  constructor() { }

  selectBranch(branch: Branch) {

    this.branchSelected.emit(branch);
  }



}
