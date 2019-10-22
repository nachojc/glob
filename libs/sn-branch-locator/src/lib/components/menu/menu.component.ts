import { Component, ContentChild, Output, EventEmitter } from '@angular/core';
import { SnBranchInfoComponent } from '../sn-branch-info/sn-branch-info.component';

@Component({
  selector: 'sn-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent  {
  @Output() closeInfo = new EventEmitter<MouseEvent>();
  @ContentChild(SnBranchInfoComponent) info: SnBranchInfoComponent;

}
