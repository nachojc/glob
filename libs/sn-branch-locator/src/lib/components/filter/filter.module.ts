import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './sn-filter.component';
import { ButtonModule, CheckboxModule, IconModule } from 'sn-common-lib';
import { FilterService } from './services/sn-filter.service';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [FilterComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    IconModule,
    ReactiveFormsModule
  ],
  providers: [FilterService],
  exports: [FilterComponent],
})

export class FilterModule {

}
