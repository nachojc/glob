import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from 'sn-common-lib';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';
import { BranchSearchInputComponent } from './branch-search-input.component';
import { WindowRef } from '../../utils/window-ref';

@NgModule({
  declarations: [BranchSearchInputComponent],
  imports: [
    CommonModule,
    IconModule,
    AutocompleteModule
  ],
  exports: [BranchSearchInputComponent],
  providers: [{provide: 'WINDOW', useClass: WindowRef}]

})
export class BranchSearchInputModule { }
