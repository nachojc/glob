import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SnBranchLocatorModule, SnBranchLocatorService} from '@globile/branch-locator';

import { BranchLocatorWrapperComponent } from './branch-locator-wrapper.component';
import { BranchLocatorRoutingModule } from './branch-locator-wrapper.routing.module';




@NgModule({
  declarations: [
    BranchLocatorWrapperComponent
  ],
  imports: [
    CommonModule,
    SnBranchLocatorModule,
    BranchLocatorRoutingModule
  ],


})

export class BranchLocatorModule {}
