import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './component/autocomplete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AutocompleteComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  exports: [AutocompleteComponent]
})
export class AutocompleteModule { }
