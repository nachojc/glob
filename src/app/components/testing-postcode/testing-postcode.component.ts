import { Component, OnInit } from '@angular/core';
import {SnBranchLocatorService} from '@globile/branch-locator';

@Component({
  selector: 'app-testing-postcode',
  templateUrl: './testing-postcode.component.html',
  styleUrls: ['./testing-postcode.component.scss']
})
export class TestingPostcodeComponent implements OnInit {
  postcode: string;
  nearestBranch: any;

  constructor(public locatorService: SnBranchLocatorService) {

  }

  ngOnInit() {
  }

  lookup(): void {

    const result = this.locatorService.getClosestBranchByTextQuery(this.postcode);
    result.subscribe((s) => this.nearestBranch = s);



  }

}
