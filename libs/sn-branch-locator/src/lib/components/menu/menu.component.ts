import { Component, OnInit, ContentChild } from '@angular/core';
import { SnBranchInfoComponent } from '../sn-branch-info/sn-branch-info.component';
import { OptionListComponent } from 'sn-common-lib';

@Component({
  selector: 'sn-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent  {

  @ContentChild(SnBranchInfoComponent) info: SnBranchInfoComponent;

}
