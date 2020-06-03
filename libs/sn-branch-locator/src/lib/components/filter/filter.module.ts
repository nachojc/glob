import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { ButtonModule, CheckboxModule, IconModule } from 'sn-common-lib';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {LabelPipe} from '../../pipes/label/label.pipe';
import {SharedModule} from '../../modules/shared/shared.module';

@NgModule({
  declarations: [FilterComponent],
  imports: [
    SharedModule,
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
