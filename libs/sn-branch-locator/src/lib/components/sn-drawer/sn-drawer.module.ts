import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnDrawerComponent } from './sn-drawer.component';



@NgModule({
  declarations: [SnDrawerComponent],
  imports: [
    CommonModule
  ],
  exports: [SnDrawerComponent]
})
export class SnDrawerModule { }
