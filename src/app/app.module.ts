import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SnBranchLocatorModule, AutocompleteModule } from 'sn-branch-locator';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SnBranchLocatorModule,
    AutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
