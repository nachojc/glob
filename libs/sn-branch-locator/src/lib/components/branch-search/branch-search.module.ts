import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from 'sn-common-lib';
import { BranchSearchInputComponent } from './branch-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { WindowRefService } from '@globile/mobile-services';

@NgModule({
  declarations: [BranchSearchInputComponent],
  imports: [
    CommonModule,
    IconModule,
    TranslateModule
  ],
  exports: [BranchSearchInputComponent],
  providers: [
    {provide: WindowRefService, useValue: window}
  ]

})
export class BranchSearchInputModule { }
