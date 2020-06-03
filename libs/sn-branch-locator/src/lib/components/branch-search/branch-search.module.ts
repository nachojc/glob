import {NgModule, Pipe} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from 'sn-common-lib';
import { BranchSearchInputComponent } from './branch-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { WindowRefService } from '@globile/mobile-services';
import {LabelPipe} from '../../pipes/label/label.pipe';
import {SharedModule} from '../../modules/shared/shared.module';

@NgModule({
  declarations: [BranchSearchInputComponent],
  imports: [
    SharedModule,
    CommonModule,
    IconModule,
    TranslateModule,

  ],
  exports: [ BranchSearchInputComponent ],
  providers: [
    {provide: WindowRefService, useValue: window}
  ]

})
export class BranchSearchInputModule { }
