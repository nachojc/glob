import {NgModule} from '@angular/core';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from '@angular/common';

import {HttpClientModule} from '@angular/common/http';
import {AgmCoreModule} from '@agm/core';
import {environment} from 'src/environments/environment';
import {AppComponent} from './app.component';
import {PrismModule} from './components/prism/prism.module';

import {DocumentationComponent} from './components/documentation/documentation.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    DocumentationComponent
  ],
  entryComponents: [
    DocumentationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,

    AgmCoreModule.forRoot({
      apiKey: environment.branchLocator.googleApiKey,
      libraries: environment.branchLocator.googleApiLibs || []
    }),
    PrismModule,
    
  ],
  providers: [
    { provide: 'WINDOW', useValue: window },
    { provide: 'ENV_CONFIG', useValue: environment },
    { provide: APP_BASE_HREF, useValue: './' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
