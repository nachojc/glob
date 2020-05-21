import {Component, ContentChild, Output, EventEmitter, Input} from '@angular/core';
import { SnBranchInfoComponent } from '../sn-branch-info/sn-branch-info.component';
import { SnBranchDirectionComponent } from '../sn-branch-direction/sn-branch-direction.component';
import { MenuAnimations } from './menu.animations';
import { FilterComponent } from '../filter/filter.component';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'sn-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [MenuAnimations.menuTrigger, trigger('slideState', [
    transition('* => true', [
      style({transform: 'translateX(100%)'}),
      animate('400ms ease', style({transform: 'translateX(0%)'}))
    ]),
    transition('true=>*', [
      style({display: 'block'}),
      animate('400ms ease', style({transform: 'translateX(100%)'}))
    ])
  ]),
    trigger('slideStateOut', [
      transition('* => true', [
        animate('400ms ease', style({transform: 'translateX(-100%)'})),
      ]),
      transition('true => *', [
        style({transform: 'translateX(-100%)'}),
        animate('400ms ease', style({transform: 'translateX(0%)'})),
      ])
    ]),
    trigger('showFilter', [
      transition('* => true', [
        style({height: '0', display: 'block'}),
        animate('400ms ease', style({height: '80vh'})),
      ]),
      transition('true => *', [
        style({height: '80vh'}),
        animate('400ms ease', style({height: '0'})),
      ])
    ])
  ]
})
export class MenuComponent {
  transitionActive: boolean;
  previousPanel: string;

  private _displayPanel = 'list';
  @Input()
  set displayPanel(displayPanel: string) {
    if (!displayPanel) { return; }
    this.previousPanel = this._displayPanel;
    this.transitionActive = false;
    this._displayPanel = displayPanel;
  }
  get displayPanel() {
    return this._displayPanel;
  }
  @Output() closeInfo = new EventEmitter<MouseEvent>();
  @Output() closeDirectionsPanel = new EventEmitter<MouseEvent>();
  @Output() closeFilterPanel = new EventEmitter<MouseEvent>();
  @ContentChild(SnBranchInfoComponent, { static: false }) info!: SnBranchInfoComponent;
  @ContentChild(SnBranchDirectionComponent, { static: false }) direction!: SnBranchDirectionComponent;
  @ContentChild(FilterComponent, { static: false }) filter!: FilterComponent;
  @Output() menuDidOpen = new EventEmitter<boolean>();
  @Output() menuDidClose = new EventEmitter<boolean>();
  @Output() filterDeployed = new EventEmitter<boolean>();
  currentState = 'menuOpened';
  showFilter = false;

  changeState() {
    this.currentState = this.currentState === 'menuOpened' ? 'menuClosed' : 'menuOpened';
  }

  open() {
    this.currentState = 'menuOpened';
  }

  close() {
    this.currentState = 'menuClosed';
  }

  animationEnd(event) {
    event.toState === 'menuOpened' ? this.menuDidOpen.emit(true) : this.menuDidClose.emit(true);
  }

  transitionDone(event: AnimationEvent) {
    if (this._displayPanel) {
      this.transitionActive = false;
    }
  }

  filterTransitionDone(event: AnimationEvent) {
    this.showFilter = this.filter.isOpen;
    if (this.showFilter) {
      this.filterDeployed.emit(true);
    }
  }
}
