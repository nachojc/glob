import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SnBranchLocatorModule } from '@globile/branch-locator';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    SnBranchLocatorModule,
    AgmCoreModule.forRoot({
      apiKey: environment.branchLocator.googleApiKey,
      libraries: environment.branchLocator.googleApiLibs || []
    }),
    RouterModule.forRoot([])
  ],
  providers: [
    { provide: 'WINDOW', useValue: window },
    { provide: 'ENV_CONFIG', useValue: environment },
    // { provide: APP_BASE_HREF, useValue: './' },
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
