import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SnTabComponent } from './sn-tab/sn-tab.component';
import { SnTabGroupComponent } from './sn-tab-group/sn-tab-group.component';
import { IconModule } from 'sn-common-lib';


@NgModule({
  declarations: [SnTabComponent, SnTabGroupComponent],
  imports: [
    CommonModule,
    IconModule
  ],
  exports: [SnTabComponent, SnTabGroupComponent]
})
export class SnTabModule { }
