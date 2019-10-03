import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchSearchInputComponent } from './component/branch-search-input.component';
import { IconModule } from 'sn-common-lib';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';

@NgModule({
  declarations: [BranchSearchInputComponent],
  imports: [
    CommonModule,
    IconModule,
    AutocompleteModule
  ],
  exports: [BranchSearchInputComponent]
})
export class BranchSearchInputModule { }
