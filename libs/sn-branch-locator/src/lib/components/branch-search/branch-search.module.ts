import {NgModule, Pipe} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from 'sn-common-lib';
import { BranchSearchInputComponent } from './branch-search.component';
import {SharedModule} from '../../modules/shared/shared.module';

@NgModule({
  declarations: [ BranchSearchInputComponent ],
  imports: [
    SharedModule,
    CommonModule,
    IconModule,
  ],
  exports: [ BranchSearchInputComponent ],
  providers: [
    { provide: 'WINDOW', useValue: window },
  ]

})
export class BranchSearchInputModule { }
