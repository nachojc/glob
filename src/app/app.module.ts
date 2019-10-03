import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SnBranchLocatorModule, AutocompleteModule, BranchSearchInputModule } from 'sn-branch-locator';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SnBranchLocatorModule,
    AutocompleteModule,
    BranchSearchInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
