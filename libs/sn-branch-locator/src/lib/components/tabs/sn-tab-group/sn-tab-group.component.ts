import { Component, OnInit, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { SnTabComponent } from '../sn-tab/sn-tab.component';

@Component({
  selector: 'sn-tab-group',
  templateUrl: './sn-tab-group.component.html',
  styleUrls: ['./sn-tab-group.component.scss']
})
export class SnTabGroupComponent implements OnInit, AfterViewInit {
  @ViewChildren(SnTabComponent) private tabsList: QueryList<SnTabComponent>;

  get tabs() {
    return this.tabsList;
  }

  activeTab = 0;

  get getPosition() {
    return { left : this.activeTab === 1 ? ((100 / this.tabs.length) * this.activeTab) + '%' : 0 };
  }

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // console.log('TABS', this._tabs);
  }
}

