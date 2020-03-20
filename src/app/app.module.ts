
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { PrismModule } from './components/prism/prism.module';

import { DocumentationComponent } from './components/documentation/documentation.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobileSettingsService, GlobileModule } from '@globile/mobile-services';

export function HttpLoaderFactory(http: HttpClient, globileSettings: GlobileSettingsService) {
  return new TranslateHttpLoader(http, globileSettings.branchLocator.languages, '.json');
}

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, GlobileSettingsService]
      }
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.branchLocator.googleApiKey,
      libraries: environment.branchLocator.googleApiLibs || []
    }),
    PrismModule,
    GlobileModule.forRoot({
      modulesRoutes: [
        {
          path: 'documentation',
          component: DocumentationComponent
        },
        {
          path: 'sample', // TODO: Use ModuleId.BRANCHLOCATOR from globile_services
          loadChildren: () => import('./modules/branch-locator/branch-locator-wrapper.module').then(m => m.BranchLocatorModule)
        }],
      nativeModules: [],
      notFoundRoute: 'documentation',
      startRoute: 'documentation'
    }, environment),
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: './' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
