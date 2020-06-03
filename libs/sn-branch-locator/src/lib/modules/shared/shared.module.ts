import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelPipe } from '../../pipes/label/label.pipe';

@NgModule({
  declarations: [LabelPipe],
  imports: [CommonModule],
  exports: [LabelPipe]
})
export class SharedModule {}
