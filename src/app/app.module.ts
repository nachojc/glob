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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { TestingPostcodeComponent } from './components/testing-postcode/testing-postcode.component';
import {SnBranchLocatorService} from '@globile/branch-locator';

@NgModule({
  declarations: [
    AppComponent,
    DocumentationComponent,
    TestingPostcodeComponent
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
    RouterModule.forRoot([
      {
        path: 'documentation',
        component: DocumentationComponent
      },
      {
        path: 'sample', // TODO: Use ModuleId.BRANCHLOCATOR from globile_services
        loadChildren: () => import('./modules/branch-locator/branch-locator-wrapper.module').then(m => m.BranchLocatorModule)
      },
      {
        path: 'search',
        component: TestingPostcodeComponent
      },
      {
        path: '',
        redirectTo: '/documentation',
        pathMatch: 'full'
      },
      {
        path: '**', component: DocumentationComponent
      }
    ]),
    FormsModule
  ],
providers: [
    { provide: 'WINDOW', useValue: window },
    { provide: 'ENV_CONFIG', useValue: environment },
    { provide: APP_BASE_HREF, useValue: './' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  SnBranchLocatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
