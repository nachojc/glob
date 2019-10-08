import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from 'sn-common-lib';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';
import { BranchSearchInputComponent } from './branch-search-input.component';

@NgModule({
  declarations: [BranchSearchInputComponent],
  imports: [
    CommonModule,
    IconModule,
    AutocompleteModule
  ],
  exports: [BranchSearchInputComponent],
  providers: [{provide: 'WINDOW', useValue: window}]

})
export class BranchSearchInputModule { }
