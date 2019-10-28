import { Component, ContentChild, Output, EventEmitter} from '@angular/core';
import { SnBranchInfoComponent } from '../sn-branch-info/sn-branch-info.component';
import { MenuAnimations} from './menu.animations';

@Component({
  selector: 'sn-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [MenuAnimations.menuTrigger]
})
export class MenuComponent {

  @Output() closeInfo = new EventEmitter<MouseEvent>();
  @ContentChild(SnBranchInfoComponent) info: SnBranchInfoComponent;
  @Output() menuDidOpen = new EventEmitter<boolean>();
  @Output() menuDidClose = new EventEmitter<boolean>();
  currentState = 'menuOpened';



  changeState() {
    this.currentState = this.currentState === 'menuOpened' ? 'menuClosed' : 'menuOpened';
  }

  open() {
    this.currentState = 'menuOpened';
  }

  animationEnd(event) {
    event.toState === 'menuOpened' ? this.menuDidOpen.emit(true) : this.menuDidClose.emit(true);
  }

}
