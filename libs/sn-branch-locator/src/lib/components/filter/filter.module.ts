import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { ButtonModule, CheckboxModule, IconModule } from 'sn-common-lib';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FilterComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    IconModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [FilterComponent],
})

export class FilterModule {

}
