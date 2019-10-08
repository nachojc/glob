import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';

import { AppComponent } from './app.component';
import { SnBranchLocatorModule } from 'sn-branch-locator';

import {
  LanguagesModule,
  LanguageLoader,
  DefLanguageHttpLoader
} from 'sn-branch-locator';


import { HttpClient, HttpClientModule } from '@angular/common/http';


export function HttpLoaderFactory(http: HttpClient) {
  return new DefLanguageHttpLoader(http, '/assets/i18n/', '.json', '');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SnBranchLocatorModule,
    LanguagesModule.forRoot({
      loader: {
        provide: LanguageLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      useDefaultLang: 'es'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
