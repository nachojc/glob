import { Component, AfterContentInit, QueryList, ContentChildren, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SnTabComponent } from '../sn-tab/sn-tab.component';
import { SelectedTab } from '../models/sn-selected-tab.model';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { TabLabelEventModel } from '../sn-tab/sn-tab.model';
@Component({
  selector: 'sn-tab-group',
  templateUrl: './sn-tab-group.component.html',
  styleUrls: ['./sn-tab-group.component.scss'],
})
export class SnTabGroupComponent implements AfterContentInit, OnDestroy {
  private _onLabelChange$: Subscription[] = [];
  @ContentChildren(SnTabComponent) private _tabs: QueryList<SnTabComponent>;

  @Input() startIndex: number;


  @Input()
  set selectIndex(value: number) {
    // this.selectedIndex = value;
    if (this._tabs && value >= 0 && value !== null && value < this._tabs.toArray().length) {
      this.tabClick(value);
    }
  }

  @Output() selectedTab = new EventEmitter<SelectedTab>();

  tabslabel: string[] = [];
  private _activeIndex: number;
  get getPosition() {
    return {
      left : this.tabslabel ? ((100 / this.calcPosition()) * (this._activeIndex < 2 ? this._activeIndex : 2)) + '%' : 0,
      width:  this.tabslabel ? (100 / this.calcPosition()) + '%' : 0 + '%'
    };
  }

  constructor() {
  }

  ngAfterContentInit(): void {
    this.setTabsInitialValue();
    if (this._tabs && this._tabs.changes) {
      this._tabs.changes.subscribe(res => {
        this.setTabsInitialValue();
      });
    }
  }

  setTabsInitialValue() {
    this._activeIndex =  this.startIndex  < this._tabs.toArray().length ? this.startIndex : 0;
    this.tabslabel = this._tabs.toArray().map<string>((tab, index) => {
      tab.index = index;
      this._onLabelChange$.push(tab.onLabelChange().subscribe(val => {
        this.tabslabel[val.index] = val.label;
      } ));
      if (this._activeIndex === index) {
        tab.setTabActive();
      } else {
        tab.setTabInactive();
      }
      return tab.label || '';
    });
  }
  ngOnDestroy(): void {
    this._onLabelChange$.forEach((tab: Subscription) => {
      tab.unsubscribe();
    });
  }

  tabClick(index: number) {
    this._tabs.toArray()[this._activeIndex].setTabInactive();
    this._activeIndex = index;
    this._tabs.toArray()[this._activeIndex].setTabActive();
    this.selectedTab.emit({tab: this._tabs.toArray()[this._activeIndex], tabIndex: this._activeIndex});
  }

  private calcPosition() {
    return this.tabslabel.length < 3 ? this.tabslabel.length : 3 ;
  }
}

